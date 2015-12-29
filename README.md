# IoT temperature Tracking
using a ESP8266 as a temperature logger for a room with a central hub and sending data to a server with a simple GET request.

This project is bigger than just tracking temperature in your home, the big picture is going to be to build a thermostat to use this data.
I will be adding to this project every step of the way and I will also be accepting pull requests as long as they fit.

## parts needed
* [ESP8266](http://www.banggood.com/Upgraded-Version-1M-Flash-ESP8266-ESP-01-WIFI-Transceiver-Wireless-Module-p-979509.html?p=P711131613982201505M)
* [FDTI basic](http://www.amazon.com/gp/product/B00HSX3CXE/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00HSX3CXE&linkCode=as2&tag=ecommsolut-20&linkId=G563PRXQVBW4PBQA)
* [AM2302 DHT22 Temperature And Humidity Sensor](http://www.banggood.com/AM2302-DHT22-Temperature-And-Humidity-Sensor-Module-For-Arduino-SCM-p-937403.html?p=P711131613982201505M)
* [ESP8266 ESP-01 Programming and Dev board](http://www.ebay.com/itm/111819907565?_trksid=p2057872.m2749.l2649&ssPageName=STRK%3AMEBIDX%3AIT)
* some kind of power pack (for now I will use 2 AAA batteries)

## Server
This project requires some king of central server to hold all the data, it can be a raspberry pi or a home computer running PHP and SQLite.

## Other stuff
Sign up for a free account to [openweathermap.org](http://openweathermap.org/) to track local weather data (I find this helpful to compare data)

you can add unlimited sensors around the home or outside as long as they have Wifi or some kind of IoT.

This is a work in progress and I will be updating this repo as I build.
