#define AUTOCONNECT_URI "/"
#define API_URL ""
#define API_PORT 5000

#include <WiFi.h>
#include <WebServer.h>
#include <AutoConnect.h>

WebServer Server;
WiFiClient Client;

AutoConnect Portal(Server);
AutoConnectConfig Config;

void redirectPage() {
  Server.sendHeader("Location", String("http://") + Server.client().localIP().toString() + String("/_ac"));
  Server.send(302, "text/plain", "");
  Server.client().flush();
  Server.client().stop();
}

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
}
