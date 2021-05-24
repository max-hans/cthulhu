const code = `#include <AccelStepper.h>

//--------------------------------

boolean motor0Direction = true;

AccelStepper motor0(1, 1, 2);

void motor0SetDirection(boolean newDirection) {
  if (newDirection) {
    motor0.setSpeed(500);
  }
  else {
    motor0.setSpeed(-500);
  }
  motor0Direction = newDirection;
}

unsigned long motor0timer = 0;
unsigned int motor0delta = 500;

boolean motor1Direction = true;

void motor1SetDirection(boolean newDirection) {
  if (newDirection) {
    digitalWrite(5, HIGH);
    digitalWrite(6, LOW);
  }
  else {
    digitalWrite(5, LOW);
    digitalWrite(6, HIGH);
  }
  motor1Direction = newDirection;
}

unsigned long motor1timer = 0;
unsigned int motor1delta = 1000;



//--------------------------------

void setup() {

  motor0.setMaxSpeed(500);

  pinMode(3, INPUT_PULLUP);
  pinMode(4, INPUT_PULLUP);

  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);

  pinMode(8, INPUT_PULLUP);
  pinMode(9, INPUT_PULLUP);

}

//--------------------------------

void loop() {

  if (motor0timer > millis()) {
    motor0SetDirection(!motor0Direction);
    motor0timer = motor0timer + motor0delta;
  }

  if (digitalRead(4) == LOW) {
    motor1SetDirection(true);
  }

  if (digitalRead(3) == LOW) {
    motor1SetDirection(false);
  }

  if (motor1timer > millis()) {
    motor1SetDirection(!motor1Direction);
    motor1timer = motor1timer + motor1delta;
  }

  if (digitalRead(9) == LOW) {
    motor1SetDirection(true);
  }

  if (digitalRead(8) == LOW) {
    motor1SetDirection(false);
  }

}`;

export default code;
