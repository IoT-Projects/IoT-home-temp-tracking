// Simple node script to pull data and insert like it is a device.

var openweatherAPIKey = 'ff6f5d189dfa1eba10cc3559a7eb097d'
// ?zip=94040,us&appid=2de143494c0b295cca9337e1e96b00e0
var openweatherAPIUrl = 'http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=' + openweatherAPIKey;
var weathertrackerUrl = 'http://localhost';
var weathertrackerPort = 8000;
var weathertrackerPath = '/index.php/track';

// create fake devices
var devices = [
    {
        deviceIp: '1.1.1.1',
        deviceName: 'home',
        DeviceZip: '98665'
    },
    {
        deviceIp: '2.2.2.2',
        deviceName: 'work',
        DeviceZip: '97210'
    },
    {
        deviceIp: '3.3.3.3',
        deviceName: 'old home',
        DeviceZip: '97006'
    }
];

function getWeather(device) {
    $.ajax({
        url: openweatherAPIUrl + '&zip=' + device.DeviceZip + ',us',
        dataType: 'jsonp'
    }).done(function(response) {
        sendWeather(device, response.main);
    });
}

function sendWeather(device, data) {
    console.log(data);
    var url = weathertrackerUrl + ':' + weathertrackerPort + weathertrackerPath + '?h=' + data.humidity + '&t=' + data.temp + '&ip=' + device.deviceIp;
    fetch(url, function(response) {
        return response.json();
    }).then(function(data) {
        console.log('sent data');
    });
}
var deviceCount = devices.length - 1;
var currentDevice = 0;

function init(e) {
    e.preventDefault();
    setInterval(function() {
        getWeather(devices[currentDevice]);
        currentDevice++
        if(currentDevice === deviceCount) {
            currentDevice = 0;
        }
    }, 1000 * 60 * 5);

    getWeather(devices[deviceCount]);
}
