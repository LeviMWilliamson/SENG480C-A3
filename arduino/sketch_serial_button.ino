const int serialPort = 9600;

const int buttonPinA = 2;
const int buttonPinB = 4;

int buttonStateA = 0;
int buttonStateB = 0;

void setup() {
  pinMode(buttonPinA, INPUT);
  pinMode(buttonPinB, INPUT);
  Serial.begin(serialPort);
}

void loop() {
  buttonStateA = digitalRead(buttonPinA);
  buttonStateB = digitalRead(buttonPinB);

  if(buttonStateA == HIGH) {
    Serial.println("button-a");
  }
  else if(buttonStateB == HIGH) {
    Serial.println("button-b");
  } else {
    Serial.println();
  }
}
