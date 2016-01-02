#include "DHT.h"
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>

ESP8266WiFiMulti WiFiMulti;

#define DHTPIN 2     // sensor pin connected to
#define DHTTYPE DHT22   // DHT 22 sensor

const char* ssid = "yourSSID";
const char* pass = "your-password";
String url = "http://local.snck.me/temp-tracking/index.php";
int main_delay = 15; // delay in min for the loop
bool isFahrenheit = true; // if you want to display in Fahenheit

// other stuff
#define USE_SERIAL Serial
float humidity, temp_f;
uint8_t MAC_array[6];
char MAC_char[18];

DHT dht(DHTPIN, DHTTYPE);

void setup() {
    USE_SERIAL.begin(115200);
    USE_SERIAL.println();
    dht.begin();
    delay(4000);

    WiFiMulti.addAP(ssid, pass);
    Serial.print("Wait for WiFi... ");
    WiFi.macAddress(MAC_array);
    for (int i = 0; i < sizeof(MAC_array); ++i){
    sprintf(MAC_char, "%s%02x:", MAC_char,MAC_array[i]);
    }
    Serial.println("WiFi connected");
    Serial.print("Get MAC address: ");
    Serial.println(MAC_char); // just to see the mac
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP()); // just so you know
    delay(500);
}
void gettemp() {
    humidity = dht.readHumidity();
    temp_f = dht.readTemperature(isFahrenheit);

    if(isnan(humidity) || isnan(temp_f)) {
        USE_SERIAL.println("bad temp, rerun");
        delay(5000);
        gettemp();
    }

    USE_SERIAL.print("Temperature: ");
    USE_SERIAL.println(temp_f);
    USE_SERIAL.print("Humidity: ");
    USE_SERIAL.println(humidity);
}

void loop() {
    if((WiFiMulti.run() == WL_CONNECTED)) {
        gettemp();
        USE_SERIAL.println(url + "?ip=" + String(MAC_char) + "&t=" + String(temp_f) + "&h=" + String(humidity));

        HTTPClient http;
        http.begin(url + "?ip=" + String(MAC_char) + "&t=" + String(temp_f) + "&h=" + String(humidity));
        int httpCode = http.GET();

        if(httpCode != -1) {
            USE_SERIAL.println("data sent to server");
            delay(1000 * 60 * main_delay);
        } else {
            USE_SERIAL.println("fail");
            delay(50000); // run in 5 min on fail
        }
    }
}
