<?php
// basic crud for Temp tempTracking
// tracking is done from device IP
// Did not build as OOP at this time as I just wanted to get something fast out the door.

// Best to change in the php.ini but wanted to add here for now
ini_set('error_reporting', 'E_ALL & ~E_NOTICE');

date_default_timezone_set('America/Los_Angeles');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");


$path = substr($_SERVER['PATH_INFO'], 1);
$sourceIp = $_SERVER['REMOTE_ADDR'];
$ip = isset($_GET['ip']) ? $_GET['ip'] : $sourceIp;
$location = $_GET['location'];
$temp = $_GET['t'];
$humidity = $_GET['h'];

switch($path) {
    case 'track':
        trackTemp($ip, $temp, $humidity);
        break;
    case 'list/locations':
        getAllLocations();
        break;
    case 'list/temps':
        getLocationTemps($ip);
        break;
    case 'list/all-temps':
        getAllTemps();
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
    default:
        echo 'Hello, I am up and running. Thanks for checking.';
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
    $db->exec("CREATE TABLE IF NOT EXISTS Temps (Id INTEGER PRIMARY KEY autoincrement, deviceId INTEGER, Temperature REAL, Humidity REAL, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
    echo 'installed';
}

function checkDevice($ip) {
    $db = connect();
    $deviceCheckSql = "SELECT Id FROM 'Devices' WHERE IP = '$ip'";
    $rowCount = $db->query($deviceCheckSql, PDO::FETCH_ASSOC);
    return $rowCount->fetchColumn() > 0;
}

// Add device, send in 2 params location and MAC/IPv4 address
function addDevice($ip, $location) {
    $db = connect();

    if(checkDevice($ip)) {
        echo '{"error": "Device MAC/IP is in use"}';
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

function trackTemp($ip, $temp, $humidity) {
    $db = connect();
    $timeStamp = date('o-m-d H:i:s');
    if(!checkDevice($ip)) {
        addDevice($ip, 'Unknown');
    }
    $deviceId = GetDeviceId($ip);
    $tempSql = "INSERT into Temps (DeviceId, Temperature, Humidity, Timestamp) VALUES (:deviceId, :temp, :humid, :timeStamp)";
    $insert = $db->prepare($tempSql);
    if($insert->execute(array($deviceId, $temp, $humidity, $timeStamp))) {
        echo '{"status": "uploaded"}';
    } else {
        echo '{"error": "failed to track temp"}';
    }
}

function getAllLocations() {
    $db = connect();
    $devicesSql = "SELECT * FROM 'Devices'";
    $rowCount = $db->query($devicesSql, PDO::FETCH_ASSOC);
    if($rowCount->fetchColumn() > 0) {
        $times = array();
        foreach ($db->query($devicesSql, PDO::FETCH_ASSOC) as $row) {
            $times[] = $row;
        }
        echo json_encode($times);
    } else {
        echo '[]';
    }
}

function getLocationTemps($ip) {
    $db = connect();
    $tempsSql = "SELECT * FROM Temps WHERE IP = '$ip' ORDER BY Id DESC";
    $rowCount = $db->query($tempsSql, PDO::FETCH_ASSOC);
    if($rowCount->fetchColumn() > 0) {
        $temps = array();
        foreach ($db->query($tempsSql, PDO::FETCH_ASSOC) as $row) {
            $temps[] = $row;
        }
        echo json_encode($temps);
    } else {
        echo '[]';
    }
}

function getAllTemps() {
    $db = connect();
    $tempsSql = "SELECT * FROM Temps ORDER BY Id DESC";
    $rowCount = $db->query($tempsSql, PDO::FETCH_ASSOC);
    if($rowCount->fetchColumn() > 0) {
        $temps = array();
        foreach ($db->query($tempsSql, PDO::FETCH_ASSOC) as $row) {
            $temps[] = $row;
        }
        echo json_encode($temps);
    } else {
        echo '[]';
    }
}
