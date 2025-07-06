let pi = Math.PI
let random = Math.random
let floor = Math.floor

let gravity = 0.6
let friction = 0.65

let canvas = document.querySelector('canvas')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let vid = canvas.getContext('2d')
let colors = ['red', 'blue', 'magenta', 'yellow']

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
        if (this.pos[1] + this.size > canvas.height - 10) {
            vid.fillStyle = "green" //color of the fill
        } else {
            vid.fillStyle = this.color //color of the fill
        }
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

for (let i = 0; i < 20; i++) {
    let pos = [random() * canvas.width, random() * -800 + 300]
    balls.push(new Ball(...pos, Math.random() * (- 9) + 4.5, Math.random() * (-10), 30))
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault()
        let groundCircles = balls.filter(ball => {
            return ball.pos[1] + ball.size >= canvas.height - 10
        })
        let circleSelected = floor(random() * groundCircles.length)
        if (groundCircles.length === 0) { return }
        groundCircles[circleSelected].dy = -35
        groundCircles[circleSelected].dx = random() * 30 - 15
        console.log(groundCircles.length)
    }
})

function update() {
    requestAnimationFrame(update)
    vid.clearRect(0, 0, innerWidth, innerHeight)
    vid.font = "35px Arial" //30 pixels and arial
    vid.fillStyle = "black" // set text color black
    vid.fillText("Press Space", 100, 100) // put text
    balls.forEach(function(ball) {
        ball.draw()
        ball.move()
    })
}

update()



