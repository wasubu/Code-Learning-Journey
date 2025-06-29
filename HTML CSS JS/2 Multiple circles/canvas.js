let random = Math.random
let cos = Math.cos
let sin = Math.sin
let atan2 = Math.atan2
let pi = Math.PI

let canvas = document.querySelector("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let vid = canvas.getContext("2d")

class Circle {
    constructor(x, y, size, speed, angle, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.angle = angle;
        this.color = color;
    }

    draw() {
        vid.beginPath();
        vid.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        vid.lineWidth = 4
        vid.strokeStyle = this.color;
        vid.stroke();
    }

    move() {
        this.x += cos(this.angle) * this.speed
        this.y -= sin(this.angle) * this.speed
        if (this.y + this.size > innerHeight) {
            this.angle = atan2(-sin(this.angle), cos(this.angle))
        }
        if (this.y - this.size < 0) {
            this.angle = atan2(-sin(this.angle), cos(this.angle))
        }
        if (this.x + this.size > innerWidth) {
            this.angle = atan2(sin(this.angle), -cos(this.angle))
        }
        if (this.x - this.size < 0) {
            this.angle = atan2(sin(this.angle), -cos(this.angle))
        }
    }
}

let colors = ["red", "green", "blue", "purple"]
let circles = []

for (i = 0; i < 100; i++) {
    let randomCircleParameters = [
        random() * innerWidth,
        random() * innerHeight,
        30,
        0.5,
        random() * 2 * pi,
        colors[Math.floor(random() * colors.length)]
    ]
    circles.push(new Circle(...randomCircleParameters))
}

console.log(circles)

function update() {
    requestAnimationFrame(update)
    vid.clearRect(0, 0, innerWidth, innerHeight)
    for (i = 0; i < circles.length; i++) {
        circles[i].draw()
        circles[i].move()
    }
}

update()
