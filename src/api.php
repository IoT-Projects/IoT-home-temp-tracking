<?php
// basic crud for Temp tempTracking
// tracking is done from device IP
// Did not build as OOP at this time as I just wanted to get something fast out the door.

// Best to change in the php.ini but wanted to add here for now
ini_set('error_reporting', 'E_ALL & ~E_NOTICE');
date_default_timezone_set('America/Los_Angeles'); // list of timezones http://php.net/manual/en/timezones.php

$path = substr($_SERVER['PATH_INFO'], 1);
$sourceIp = $_SERVER['REMOTE_ADDR']; // source the IP if ip is not set.
$ip = isset($_GET['ip']) ? $_GET['ip'] : $sourceIp; // ip can be an IP address, MAC address or anything.
$voltage = isset($_GET['v']) ? $_GET['v'] : null;
$location = $_GET['location'];
$temp = $_GET['t'];
$humidity = $_GET['h'];
$startDate = $_GET['sd'];
$endDate = $_GET['ed'];

switch($path) {
    case 'track':
        trackTemp($ip, $temp, $humidity, $voltage);
        break;
    case 'list/locations':
        echo json_encode(getAllLocations());
        break;
    case 'list/temps':
        echo json_encode(getLocationTemps($ip));
        break;
    case 'list/all-temps':
        echo json_encode(getAllTemps());
        break;
    case 'list/today':
        $date = new DateTime('NOW');
        $startDate = $date->format('Y-m-d');
        $date->modify('+1 day');
        $endDate = $date->format('Y-m-d');
        echo json_encode(getLocationByDate($ip, $startDate, $endDate));
        break;
    case 'list/dates':
        echo json_encode(getLocationByDate($ip, $startDate, $endDate));
        break;
    case 'add':
        addDevice($ip, $location);
        break;
    case 'install':
        install();
        break;
    case 'check':
        device($ip);
        break;
}

function connect() {
    $db = new PDO('sqlite:tempTracking.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, 'SET NAMES utf8');
    return $db;
}

function install() {
    $db = connect();
    $db->exec("CREATE TABLE IF NOT EXISTS Devices (Id INTEGER PRIMARY KEY autoincrement, Location TEXT, IP TEXT UNIQUE)");
    $db->exec("CREATE TABLE IF NOT EXISTS Temps (Id INTEGER PRIMARY KEY autoincrement, deviceId INTEGER, Temperature REAL, Humidity REAL, Voltage REAL, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
    echo 'installed';
}

function checkDevice($ip) {
    $db = connect();
    $deviceCheckSql = "SELECT Id FROM 'Devices' WHERE IP = '$ip'";
    $rowCount = $db->query($deviceCheckSql, PDO::FETCH_ASSOC);
    return $rowCount->fetchColumn() > 0;
}

// Add device, send in 2 params location and IPv4 address
function addDevice($ip, $location) {
    $db = connect();

    if(checkDevice($ip)) {
        echo '{"error": "Device IP is in use"}';
    } else {
        $deviceSql = "INSERT INTO Devices (
            'Location',
            'IP'
        ) VALUES (
            :Location,
            :IP
        )";
        $insert = $db->prepare($deviceSql);
        if($insert->execute(array($location, $ip))) {
            echo '{"deviceID": "' . $db->lastInsertId() . '", "location": "' . $location . '"}';
        } else {
            echo '{"error": "failed to add Device"}';
        }
    }
}

function device($ip) {
    print_r(getDeviceId($ip));
}

function getDeviceId($ip) {
    $db = connect();
    $deviceCheckSql = "SELECT Id FROM 'Devices' WHERE IP = '$ip'";
    $rowCount = $db->query($deviceCheckSql, PDO::FETCH_ASSOC);
    if($rowCount->fetchColumn() > 0) {
        foreach ($db->query($deviceCheckSql, PDO::FETCH_ASSOC) as $row) {
            return $row['Id'];
        }
    }
}

function trackTemp($ip, $temp, $humidity, $voltage) {
    $db = connect();

    if(!checkDevice($ip)) {
        addDevice($ip, 'Unknown');
    }
    $deviceId = GetDeviceId($ip);
    $tempSql = "INSERT into Temps (DeviceId, Temperature, Humidity, Voltage) VALUES (:deviceId, :temp, :humid, :voltage)";
    $insert = $db->prepare($tempSql);
    if($insert->execute(array($deviceId, $temp, $humidity, $voltage))) {
        echo '{"status": "uploaded"}';
    } else {
        echo '{"error": "failed to track temp"}';
    }
}

function getAllLocations() {
    $db = connect();
    $devicesSql = "SELECT * FROM 'Devices' INNER JOIN 'Temps' ON Devices.id = Temps.deviceId GROUP BY Devices.id";
    $rowCount = $db->query($devicesSql, PDO::FETCH_ASSOC);
    if($rowCount->fetchColumn() > 0) {
        $rows = [];
        foreach ($db->query($devicesSql, PDO::FETCH_ASSOC) as $row) {
            $rows[] = $row;
        }
        return $rows;
    } else {
        return array();
    }
}

function getLocationLastTemp($ip) {
    $deviceId = getDeviceId($ip);
    $db = connect();
    $tempsSql = "SELECT * FROM Temps WHERE deviceId = '$deviceId' ORDER BY Timestamp DESC LIMIT 0 , 1";
    $rowCount = $db->query($tempsSql, PDO::FETCH_ASSOC);
    if($rowCount->fetchColumn() > 0) {
        $temps = [];
        foreach ($db->query($tempsSql, PDO::FETCH_ASSOC) as $row) {
            $temps[] = $row;
        }
        return $temps;
    } else {
        return array();
    }
}

function getLocationToday($ip) {

}

function getLocationByDate($ip, $startDate, $endDate) {
    $deviceId = getDeviceId($ip);
    $db = connect();
    $tempsSql = "SELECT * FROM Temps WHERE deviceId = '$deviceId' AND Timestamp BETWEEN '$startDate' AND '$endDate'  ORDER BY Timestamp DESC";
    $rowCount = $db->query($tempsSql, PDO::FETCH_ASSOC);
    if($rowCount->fetchColumn() > 0) {
        $temps = [];
        foreach ($db->query($tempsSql, PDO::FETCH_ASSOC) as $row) {
            $temps[] = $row;
        }
        return $temps;
    } else {
        return array();
    }
}

function getLocationTemps($ip) {
    $deviceId = getDeviceId($ip);
    $db = connect();
    $tempsSql = "SELECT * FROM Temps WHERE deviceId = '$deviceId' ORDER BY Timestamp DESC";
    $rowCount = $db->query($tempsSql, PDO::FETCH_ASSOC);
    if($rowCount->fetchColumn() > 0) {
        $temps = [];
        foreach ($db->query($tempsSql, PDO::FETCH_ASSOC) as $row) {
            $temps[] = $row;
        }
        return $temps;
    } else {
        return array();
    }
}

function getAllTemps() {
    $db = connect();
    $tempsSql = "SELECT * FROM Temps ORDER BY Timestamp DESC";
    $rowCount = $db->query($tempsSql, PDO::FETCH_ASSOC);
    if($rowCount->fetchColumn() > 0) {
        $temps = [];
        foreach ($db->query($tempsSql, PDO::FETCH_ASSOC) as $row) {
            $temps[] = $row;
        }
        return $temps;
    } else {
        return array();
    }
}
