
#include "DHT.h"
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>

ESP8266WiFiMulti WiFiMulti;

#define USE_SERIAL Serial
#define DHTPIN 2     // sensor pin connected to
#define DHTTYPE DHT22   // DHT 22 sensor

uint8_t MAC_array[6];
char MAC_char[18];

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  USE_SERIAL.begin(115200);
  // USE_SERIAL.setDebugOutput(true);
  dht.begin();
  USE_SERIAL.println();
  delay(4000);

  WiFiMulti.addAP("ssid", "wifipass");
  Serial.print("Wait for WiFi... ");
  WiFi.macAddress(MAC_array);
  for (int i = 0; i < sizeof(MAC_array); ++i){
    sprintf(MAC_char,"%s%02x:",MAC_char,MAC_array[i]);
  }
  
  Serial.println(MAC_char);
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  delay(500);
}

String getdata() {
  // put your main code here, to run repeatedly:
  float h = dht.readHumidity();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  float f = dht.readTemperature(true);
  if(isnan(h) || isnan(f)) {
    //return "";
  }
  USE_SERIAL.print("Temperature: ");
  USE_SERIAL.println(f);
  return "?t=" + String(f) + "&h=" + String(h);
} 

void loop() {
  USE_SERIAL.println("Loop");
  if((WiFiMulti.run() == WL_CONNECTED)) {
    USE_SERIAL.println("is connected");
    // put your main code here, to run repeatedly:
    float h = dht.readHumidity();
    // Read temperature as Fahrenheit (isFahrenheit = true)
    float f = dht.readTemperature(true);
    if(isnan(h) || isnan(f)) {
      USE_SERIAL.println("bad temp");
    }
    USE_SERIAL.print("Temperature: ");
    USE_SERIAL.println(f);
    delay(5000);
    /*HTTPClient http;
    http.begin("http://local.snck.me/index.php?t=" + String(f) + "&h=" + String(h));
    int httpCode = http.GET();
    if(httpCode != -1) {
      USE_SERIAL.println("data sent to server");
      delay(10000);
    } else {
      USE_SERIAL.println("fail");
      delay(5000);
    }*/
  }
}



