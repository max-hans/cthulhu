import { DCMotor, InstructionLine, Stepper } from './types';

const blockSplitter = '//-------------------------------- \n\n';

const generate = (motors: Array<Stepper | DCMotor>): string => {
  const imports: Array<InstructionLine | Array<InstructionLine>> = [];
  const global: Array<InstructionLine | Array<InstructionLine>> = [
    blockSplitter,
  ];
  const setup: Array<InstructionLine | Array<InstructionLine>> = [
    `${blockSplitter}void setup(){`,
  ];
  const loop: Array<InstructionLine | Array<InstructionLine>> = [
    `${blockSplitter}void loop(){`,
  ];

  if (motors.some((motor) => motor.motorType === 'STEPPER')) {
    imports.push('#include <AccelStepper.h>');
  }

  motors.forEach((motor, index) => {
    const motorName = `motor${index}`;
    const directionFuncName = `${motorName}SetDirection`;
    const directionVarName = `${motorName}Direction`;

    // INITIALIZATION
    global.push(`boolean ${directionVarName} = true;`);

    if (motor.motorType === 'STEPPER') {
      global.push(
        `AccelStepper ${motorName}(1, ${motor.pin1}, ${motor.pin2});`,
      );

      global.push(
        `void ${directionFuncName}(boolean newDirection){
  if(newDirection){${motorName}.setSpeed(${motor.speed});}
  else {
    ${motorName}.setSpeed(-${motor.speed});
  }
    ${directionVarName} = newDirection;
}`,
      );

      setup.push(`${motorName}.setMaxSpeed(${motor.speed});`);
    } else {
      setup.push(
        `pinMode(${motor.pin1}, OUTPUT);
pinMode(${motor.pin2}, OUTPUT);
pinMode(${motor.pin3}, OUTPUT);`,
      );

      global.push(
        `void ${directionFuncName}(boolean newDirection) {
  if (newDirection) {
    digitalWrite(${motor.pin1}, HIGH);
    digitalWrite(${motor.pin2}, LOW);
  }
  else {
    digitalWrite(${motor.pin1}, LOW);
    digitalWrite(${motor.pin2}, HIGH);
  }
  ${directionVarName} = newDirection;
}`,
      );
    }

    // TIMER

    if (motor.useTimer) {
      const timerName = `${motorName}timer`;
      const deltaName = `${motorName}delta`;

      global.push(
        `unsigned long ${timerName} = 0;
unsigned int ${deltaName} = ${motor.timer};`,
      );

      loop.push(
        `if(${timerName} > millis()){
  ${directionFuncName}(!${directionVarName});
  ${timerName} = ${timerName} + ${deltaName};
}`,
      );
    }

    // ENDSTOPS

    if (motor.useEndstops) {
      setup.push(
        `pinMode(${motor.endstops[0]}, INPUT_PULLUP);
pinMode(${motor.endstops[1]}, INPUT_PULLUP);`,
      );

      loop.push(
        `if (digitalRead(${
          motor.endstops[motor.invertEndstops ? 0 : 1]
        }) == LOW) {
  motor1SetDirection(true);
}

if (digitalRead(${motor.endstops[motor.invertEndstops ? 1 : 0]}) == LOW) {
  motor1SetDirection(false);
}`,
      );
    }
  });
  imports.push();
  global.push();
  setup.push('}\n');
  loop.push('}\n');

  return [imports, global, setup, loop]
    .flat(2)
    .map((elem) => `${elem.trim()}\n`)
    .join('\n');
};

export default generate;
