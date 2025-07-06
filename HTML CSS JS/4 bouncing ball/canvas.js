let pi = Math.PI
let random = Math.random

let gravity = 0.6
let friction = 0.97

let canvas = document.querySelector('canvas')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let vid = canvas.getContext('2d')
let colors = ['green', 'red', 'blue', 'magenta', 'yellow']

class Ball {
    constructor(x, y, dx, dy, size) {
        this.pos = [x, y]
        this.size = size
        this.dx = dx
        this.dy = dy
        this.color = colors[Math.floor(Math.random() * colors.length)]
    }

    draw() {
        vid.beginPath()
        vid.arc(
            ...this.pos, this.size, 0, pi * 2, 0
        )
        vid.lineWidth = 6 //size of the outline
        vid.stroke() //gives an outline
        vid.fillStyle = this.color //color of the fill
        vid.fill() //fills the circle
    }

    move() {
        if (this.pos[1] + this.size + this.dy > canvas.height) {
            this.dy = -this.dy * friction
        } else {
            this.dy += gravity
        }
        let sideBounce = [
            this.pos[0] - this.size + this.dx < 0,
            this.pos[0] + this.size + this.dx > canvas.width,
        ]
        if (sideBounce[0] || sideBounce[1]) {
            this.dx = - this.dx * friction
        }
        this.pos[0] += this.dx
        this.pos[1] += this.dy
    }
}

let balls = []

for (let i = 0; i < 100; i++) {
    let pos = [random() * canvas.width, random() * -800 + 300]
    balls.push(new Ball(...pos, Math.random() * (- 9) + 4.5, Math.random() * (-10), 30))
}

console.log(balls)

function update() {
    requestAnimationFrame(update)
    vid.clearRect(0, 0, innerWidth, innerHeight)
    balls.forEach(function(ball) {
        ball.draw()
        ball.move()
    })
}

update()



