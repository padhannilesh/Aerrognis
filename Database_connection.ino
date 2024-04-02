#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include "DHT.h"
#define DPIN 4
#define DTYPE DHT11



DHT dht(DPIN,DTYPE);

//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID "OnePlus Nord2 5G"
#define WIFI_PASSWORD "w7j2tuzn"

// Insert Firebase project API Key
#define API_KEY "AIzaSyCEhiQp5iGz_M-X2-2xnL2iKYYM700CQJU"

// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "https://air-quality-monitoring-faf7e-default-rtdb.asia-southeast1.firebasedatabase.app/" 

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;

void setup(){
  Serial.begin(115200);
   pinMode(A0,INPUT);
   Serial.begin(9600);
   dht.begin();
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  /* Assign the api key (required) */
  config.api_key = "AIzaSyCEhiQp5iGz_M-X2-2xnL2iKYYM700CQJU";

  /* Assign the RTDB URL (required) */
  config.database_url = "https://air-quality-monitoring-faf7e-default-rtdb.asia-southeast1.firebasedatabase.app"
;

  /* Sign up */
  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }


  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop(){
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();
    // Write an Int number on the database path test/int
      int a=analogRead(A0);
  float tc = dht.readTemperature(false);
  float tf = dht.readTemperature(true);
  float hu = dht.readHumidity();
    if (Firebase.RTDB.setInt(&fbdo, "test/Polluntant", a)){
      Serial.println("Polluntant: ");
      Serial.println(a);
      Serial.println("PATH: " + fbdo.dataPath());
      Serial.println("TYPE: " + fbdo.dataType());
    }
    else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }
    
    // Write an Float number on the database path test/float
     if (Firebase.RTDB.setInt(&fbdo, "test/tempC", tc)){
      Serial.print("tempC :");
      Serial.print(tc);
      Serial.println("PATH: " + fbdo.dataPath());
      Serial.println("TYPE: " + fbdo.dataType());
    }
    else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }
        if (Firebase.RTDB.setInt(&fbdo, "test/tempF", tf)){
      Serial.print("tempF: ");
      Serial.print(tf);
      Serial.println("PATH: " + fbdo.dataPath());
      Serial.println("TYPE: " + fbdo.dataType());
    }
    else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }
        if (Firebase.RTDB.setInt(&fbdo, "test/Humdity", hu)){
      Serial.print("Humidity: ");
      Serial.print(hu);
      Serial.println("PATH: " + fbdo.dataPath());
      Serial.println("TYPE: " + fbdo.dataType());
    }
    else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }
  }
}
