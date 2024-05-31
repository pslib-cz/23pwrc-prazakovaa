radio.setFrequencyBand(73)
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

///


type Protokol = {
    x: number; //smer
    y: number; //rychlost
    // a: boolean;
    // b: boolean;
    // logo: boolean
}

let letter: string = ""

radio.onReceivedString( function (received: string) {

    letter = received

    let article = letter.split(";")
    let data: Protokol = {
        x: parseInt(article[0]),
        y: parseInt(article[1]),
        // a: article[2] === "1",
        // b: article[3] === "1",
        // logo: article[4] === "1"
    }

    let direction = Math.map(data.x, -1024, 1023, -120, 120);
    let speed = Math.map(data.y, -1024, 1023, -255, 255);

    if (data.x <= 0){
        PCAmotor.MotorRun(PCAmotor.Motors.M1, -speed)
    } else if (data.x >= 0) {
        PCAmotor.MotorRun(PCAmotor.Motors.M4, speed)
    }

    if (data.x <= 0 && data.y >= 0){
        PCAmotor.MotorRun(PCAmotor.Motors.M4, speed -direction)
    } else if (data.x >= 0 && data.y >= 0) {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, -speed -direction)
    } else if (data.x >= 0 && data.y <= 0) {
        PCAmotor.MotorRun(PCAmotor.Motors.M1, -speed + direction)
    } else if (data.x <= 0 && data.y <= 0) {
        PCAmotor.MotorRun(PCAmotor.Motors.M4, speed + direction)
    }
    


})
