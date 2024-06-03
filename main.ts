radio.setFrequencyBand(72)
radio.setTransmitPower(5)
radio.setGroup(73)
radio.setTransmitSerialNumber(true)

enum Pins {
    wr = DigitalPin.P8,
    wl = DigitalPin.P12,
    r = DigitalPin.P13,
    l = DigitalPin.P14,
    c = DigitalPin.P15,
    trig = DigitalPin.P2,
    echo = DigitalPin.P1
}

enum ServoDirection {
    Left = 2,
    Center = 1,
    Right = 0
}

/*
const allIRPins: Array<number> = [Pins.wr, Pins.wl, Pins.r, Pins.l, Pins.c, Pins.trig]
for (let pin of allIRPins) {
    pins.setPull(pin, PinPullMode.PullNone);
}

const carMotor = (leftwheel: number = 0, rightwheel: number = 0): void => {
    if (leftwheel === 0 && rightwheel === 0) { PCAmotor.MotorStopAll(); return; }

    //PCAmotor.MotorRun(PCAmotor.Motors.M1, -1 * abrakadabra)
    //PCAmotor.MotorRun(PCAmotor.Motors.M4, -1 * abrakabadra)
}

const servoMove = (direction: ServoDirection): void => {
    PCAmotor.GeekServo(PCAmotor.Servos.S1, 500 + 1000 * direction)
    basic.pause(2000)
    PCAmotor.StopServo(PCAmotor.Servos.S1)
}

*/

basic.showLeds(`
. # # . .
. # # # .
. # # # #
. # . . .
. # . . .
`)

let stripHead = neopixel.create(DigitalPin.P0, 9, NeoPixelMode.RGB)
let strip = neopixel.create(DigitalPin.P16, 9, NeoPixelMode.RGB)
strip.showColor(neopixel.rgb(255, 0, 0))
stripHead.showColor(neopixel.rgb(255, 0, 0))
strip.show()

// basic.forever(function () {
//     PCAmotor.GeekServo(PCAmotor.Servos.S1, 800)
//     basic.pause(8000)
//     PCAmotor.GeekServo(PCAmotor.Servos.S1, 2200)
//     basic.pause(8000)
// })

type Protokol = {
    x: number; //smer
    y: number; //rychlost
}

let letter: string

radio.onReceivedString(function (receivedString: string) {
    letter = receivedString

    let data: Protokol = {
        x: parseInt(letter.split(";")[0]),
        y: parseInt(letter.split(";")[1])
    }

    let turns = Math.map(data.x, -1024, 1024, -120, 120)
    let run = Math.map(data.y, -1024, 1024, -255, 255)

    const runMotors = (motor1: PCAmotor.Motors, motor1Speed: number, motor2: PCAmotor.Motors, motor2Speed: number) => {
        PCAmotor.MotorRun(motor1, motor1Speed)
        PCAmotor.MotorRun(motor2, motor2Speed)
    }

    let motor1Speed = 0
    let motor2Speed = 0

    if (data.x <= 0) {
        motor1Speed = -run
        if (data.y >= 0) {
            motor2Speed = run - turns
        } else {
            motor2Speed = run + turns
        }
        runMotors(PCAmotor.Motors.M1, motor1Speed, PCAmotor.Motors.M4, motor2Speed)
    } else {
        motor2Speed = run
        if (data.y >= 0) {
            motor1Speed = -run - turns
        } else {
            motor1Speed = -run + turns
        }
        runMotors(PCAmotor.Motors.M4, motor2Speed, PCAmotor.Motors.M1, motor1Speed)
    }
})
