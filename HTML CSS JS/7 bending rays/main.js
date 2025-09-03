let pi = Math.PI
let tau = Math.PI * 2

let canvas = document.querySelector("canvas")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let vid = canvas.getContext("2d")

class RayBall {
    constructor(x, y) {
        this.pos = { x: x, y: y }
        this.size = 1
    }
    get xy() {
        return [this.pos.x, this.pos.y]
    }
    draw() {
        vid.beginPath()
        vid.arc(...this.xy, this.size, 0, tau, 0)
        vid.fillStyle = "white"
        vid.fill()
    }
    move() {
        this.pos.x += 0.5
    }
}

vid.fillStyle = "black"
vid.fillRect(0, 0, innerWidth, innerHeight)

let rayBalls = []

for (let i = 0; i < 31; i++) {
    rayBalls.push(new RayBall(20, 30 + i * 27))
}

function update() {
    requestAnimationFrame(update)
    // vid.clearRect(0, 0, innerWidth, innerHeight)
    // vid.fillStyle = "white"
    // vid.fillRect(0, 0, innerWidth, innerHeight)
    rayBalls.forEach(ball => {
        ball.draw()
        ball.move()
    })
}

update()


