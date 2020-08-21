#define AUTOCONNECT_URI "/"
#define API_URL "35.184.90.11"
#define API_PORT 5000
#define HW_DEFAULT_LIFETIME 2

#define DHTPIN 13
#define DHTTYPE DHT11

#define HCSRTRIG 15
#define HCSRECHO 2
#define HW_DEFAULT_PIPELENGTH 4

#define PIR_PIN 35
#define BUZZ_PIN 17
#define BUZZ_TIMEOUT 2

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

#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <HCSR04.h>

DHT_Unified dht(DHTPIN, DHTTYPE);
UltraSonicDistanceSensor distanceSensor(HCSRTRIG, HCSRECHO);

String macAddr = WiFi.macAddress();

void redirectPage();
void http_POST_measurement();
void setMeasurementTimeout();

int set_lifetime = HW_DEFAULT_LIFETIME;
int get_lifetime = HW_DEFAULT_LIFETIME;
double set_pipelength = HW_DEFAULT_PIPELENGTH;
double get_pipelength = HW_DEFAULT_PIPELENGTH;
unsigned long last_trigger = 0;
boolean startBuzz = false;
unsigned long lastBuzz = 0;

void IRAM_ATTR detectsMovement() {
  Serial.println("MOTION DETECTED!!!");
  digitalWrite(BUZZ_PIN, HIGH);
  startBuzz = true;
  lastBuzz = millis();
}


void setup() {
  delay(1000);
  Serial.begin(115200);
  macAddr.replace(":","-");

  pinMode(PIR_PIN, INPUT_PULLUP);
  pinMode(BUZZ_PIN, OUTPUT);
  digitalWrite(BUZZ_PIN, HIGH);
  delay(100);
  digitalWrite(BUZZ_PIN, LOW);

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
  Config.hostName = macAddr;
  Portal.config(Config);

  if (Portal.begin()) {
    Serial.println("WiFi connected: " + WiFi.localIP().toString());
  }

  dht.begin();

  Server.on("/", redirectPage);
  
  attachInterrupt(digitalPinToInterrupt(PIR_PIN), detectsMovement, RISING);
}

void loop() {
  Portal.handleClient();

  if(WiFi.status() == WL_CONNECTED){
    if(millis() - last_trigger > (set_lifetime*1000)){
      http_POST_measurement();
      last_trigger = millis();
    }
  }

  if(startBuzz && (millis() - lastBuzz > (BUZZ_TIMEOUT*1000))){
    Serial.println("Motion stopped...");
    digitalWrite(BUZZ_PIN, LOW);
    startBuzz = false;
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

  // get measurement
  sensors_event_t eventTemp;
  sensors_event_t eventHumid;
  dht.temperature().getEvent(&eventTemp);
  dht.humidity().getEvent(&eventHumid);
  
  String httpLink = "/record";
  
  StaticJsonDocument<512> doc;
  doc["mac_address"] = macAddr;
  doc["lifetime"] = set_lifetime;
  
  JsonObject measurement = doc.createNestedObject("measurement");
  int distMeasure = distanceSensor.measureDistanceCm();
  Serial.print("level-raw :");
  Serial.println(distMeasure);
  if(distMeasure < 0){ distMeasure = 0; }
  double levelMeasure = set_pipelength - (distMeasure/100.0);
  measurement["level"] = levelMeasure;
  measurement["temperature"] = isnan(eventTemp.temperature)? 0 : eventTemp.temperature;
  measurement["humidity"] = isnan(eventHumid.relative_humidity)? 0 : eventHumid.relative_humidity;
  
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
    StaticJsonDocument<1024> doc;
    deserializeJson(doc, payload);
    get_lifetime = doc["set"]["update_time"];
    get_pipelength = doc["set"]["pipe_length"];
    Serial.print("db updatetime : ");
    Serial.println(get_lifetime);
    Serial.print("db Pipelength : ");
    Serial.println(get_pipelength);
  }
  if(get_lifetime > 0) set_lifetime = get_lifetime;
  if(get_pipelength > 0) set_pipelength = get_pipelength;
  Serial.print("SET Lifetime : ");
  Serial.println(set_lifetime);
  Serial.print("SET Pipelength : ");
  Serial.println(set_pipelength);
}
