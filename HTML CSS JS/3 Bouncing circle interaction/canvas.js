console.log("hello world!")

let pi = Math.PI
let cos = Math.cos
let sin = Math.sin
let atan2 = Math.atan2
let random = Math.random
let floor = Math.floor

function vec2(x, y) {
    return [x, y]
}

let canvas = document.querySelector("canvas")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let circles = [
    { pos: [100, 100], angle: 0, speed: 2, size: 30, color: 'red' },
]

let mouse = {
    x: undefined,
    y: undefined
}

for (i = 0; i < 500; i++) {
    let xy = vec2(Math.random() * innerWidth, Math.random() * innerHeight)
    let angle = Math.random() * 2 * pi

    let colors = ["red", "green", "yellow", "blue", "violet"]
    let color = colors[floor(random() * colors.length)]

    circles.push(
        { pos: xy, angle: angle, speed: 2, size: 30, color: color },
    )
}

let vid = canvas.getContext("2d")

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x
    mouse.y = event.y
    console.log("x:" + mouse.x + ", y:" + mouse.y)
})

window.addEventListener('resize', function(event) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

function moveCircle() {
    circles.forEach(function(circle) {
        circle.pos[0] += cos(circle.angle) * circle.speed
        circle.pos[1] -= sin(circle.angle) * circle.speed
    })
}

function drawCircle() {
    circles.forEach(function(circle) {
        vid.beginPath()
        vid.arc(...circle.pos, circle.size, 0, pi * 2, 0)
        vid.lineWidth = 2
        vid.strokeStyle = circle.color
        vid.stroke()
        vid.fillStyle = circle.color
        vid.fill()
    })
}

function bounceCircle() {
    circles.forEach(function(circle) {
        const [x, y] = circle.pos
        let xBounce = [
            x > innerWidth - circle.size,
            x < 0 + circle.size
        ]
        let yBounce = [
            y > innerHeight - circle.size,
            y < 0 + circle.size
        ]
        if (xBounce[0] || xBounce[1]) {
            circle.angle = atan2(
                sin(circle.angle),
                - cos(circle.angle)
            )
        }
        if (yBounce[0] || yBounce[1]) {
            circle.angle = atan2(
                - sin(circle.angle),
                cos(circle.angle)
            )
        }
    })
}

function interactCircle() {
    circles.forEach(function(circle) {
        const [x, y] = circle.pos
        let ifNearMouseX = Math.abs(mouse.x - x) < 50
        let ifNearMouseY = Math.abs(mouse.y - y) < 50
        if (ifNearMouseX && ifNearMouseY) {
            if (circle.size > 40) { return }
            circle.size += 1
        } else if (circle.size > 2) {
            circle.size -= 1
        }
    })
}

function update() {
    requestAnimationFrame(update) //go and call the update
    vid.clearRect(0, 0, innerWidth, innerHeight)
    drawCircle()
    moveCircle()
    bounceCircle()
    interactCircle()
}

update()

