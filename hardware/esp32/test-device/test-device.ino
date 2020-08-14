#define AUTOCONNECT_URI "/"
#define API_URL "34.101.157.220"
//#define API_URL "192.168.43.106"
#define API_PORT 5000
#define HW_DEFAULT_LIFETIME 2

#include <WiFi.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <AutoConnect.h>
#include <Ticker.h>
#include "esp_task_wdt.h"

WebServer Server;
WiFiClient Client;

AutoConnect Portal(Server);
AutoConnectConfig Config;

void redirectPage();
void http_POST_measurement();
void setMeasurementTimeout();

int set_lifetime = HW_DEFAULT_LIFETIME;
unsigned long last_trigger = 0;

void setup() {
  delay(1000);
  Serial.begin(115200);
  Serial.println();

  Config.title = "Water Level";
  Config.menuItems = 
    AC_MENUITEM_CONFIGNEW | 
    AC_MENUITEM_OPENSSIDS | 
    AC_MENUITEM_RESET |
    AC_MENUITEM_DEVINFO;

  Config.ticker = true;
  Config.tickerPort = 22;
  Config.tickerOn = LOW;
  Config.autoReconnect = true;
  Config.hostName = "adrianaryaputra";
  Portal.config(Config);

  if (Portal.begin()) {
    Serial.println("WiFi connected: " + WiFi.localIP().toString());
  }

  Server.on("/", redirectPage);
}

void loop() {
  Portal.handleClient();
  
  if(millis() - last_trigger > (set_lifetime*1000)){
    http_POST_measurement();
    last_trigger = millis();
  }
}


// SERVER CALLBACK FUNCTIONS
void redirectPage() {
  Server.sendHeader("Location", String("http://") + Server.client().localIP().toString() + String("/_ac"));
  Server.send(302, "text/plain", "");
  Server.client().flush();
  Server.client().stop();
}


// CLIENT CALLBACK FUNCTION
void http_POST_measurement(){
  // feed the dog
  esp_task_wdt_reset();
  
  String httpLink = "/record";
  
  StaticJsonDocument<512> doc;
  doc["mac_address"] = WiFi.macAddress();
  doc["lifetime"] = set_lifetime;
  
  JsonObject measurement = doc.createNestedObject("measurement");
  measurement["level"] = random(500,700) / 100.0;
  measurement["temperature"] = random(3500,3800) / 100.0;
  measurement["humidity"] = random(6000,7000) / 100.0;
  
  String httpBody;
  serializeJson(doc, httpBody);
//  Serial.print("Send : ");
//  Serial.println(httpBody);

  HTTPClient http;
  http.begin(String("http://") + API_URL + ":" + API_PORT + httpLink);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(httpBody);
  String payload = http.getString();
  Serial.print(httpCode);
  Serial.print(" | ");
  Serial.println(payload);
  if(httpCode == HTTP_CODE_OK){
    StaticJsonDocument<256> doc;
    deserializeJson(doc, payload);
    set_lifetime = doc["set"]["lifetime"];
    Serial.print("SET Lifetime : ");
    Serial.println(set_lifetime);
  }
}
