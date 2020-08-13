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
Ticker http_POST_device_ticker;

AutoConnect Portal(Server);
AutoConnectConfig Config;

void redirectPage();

void http_GET(String httpLink);
void http_GET_device();
void http_POST(String httpLink, String httpBody);
void http_POST_measurement();

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
//    http_GET_DeviceTicker.attach(5, http_GET_device);    
    http_POST_measurement();
  }

  Server.on("/", redirectPage);
}

void loop() {
  Portal.handleClient();
  esp_task_wdt_reset();
}


// SERVER CALLBACK FUNCTIONS
void redirectPage() {
  Server.sendHeader("Location", String("http://") + Server.client().localIP().toString() + String("/_ac"));
  Server.send(302, "text/plain", "");
  Server.client().flush();
  Server.client().stop();
}


// CLIENT CALLBACK FUNCTION
void http_GET(String httpLink){
  HTTPClient http;
  http.begin(String("http://") + API_URL + ":" + API_PORT + httpLink);
  int httpCode = http.GET();

  if(httpCode > 0) {
    if(httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println(payload);
      Serial.println(WiFi.macAddress());
    }
  } else {
    Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
}

void http_GET_device(){
  // feed the dog
  esp_task_wdt_reset();
  
  http_GET(String("/device"));
}

void http_POST_measurement(){
  // feed the dog
  esp_task_wdt_reset();

  int set_lifetime = HW_DEFAULT_LIFETIME;
  
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
  Serial.print("Send : ");
  Serial.println(httpBody);

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
  http_POST_device_ticker.once(set_lifetime, http_POST_measurement);
}
