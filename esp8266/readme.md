## ESP8266 script for Arduino

sends temp and humidity to the server as a get request at this time, also sends to MAC address or IP address of the device.

IP address will be used if nothing is sent with the IP param.

### Todo

#### small Todo
This script needs to send the battery information to the server and track it, script and DB needs to be updated to add that as a param on the GET request.

I would also like to change from a GET to a POST request just to keep that inline with the web. 

#### Updater
I would like to add a self update function to this for updating the ssid and password
