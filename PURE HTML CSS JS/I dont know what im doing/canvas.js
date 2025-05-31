let canvas = document.querySelector("canvas")

let colorTable = [
    "green", "red", "blue",
    "purple",
]

let pi = Math.PI
let random = Math.random
let cos = Math.cos
let sin = Math.sin

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let vid = canvas.getContext("2d")

vid.fillStyle = colorTable[2]
vid.fillRect(100, 100, 100, 100)

let cirVec2 = { x: random() * innerWidth, y: random() * innerHeight }
let cirAngle = random() * pi * 2
let cirSpeed = random() * 7
let cirVelocity2D = [cos(cirAngle) * cirSpeed, sin(cirAngle) * cirSpeed]

console.log(Math.sqrt(6 ** 2 + (-3) ** 2))
let cirRadius = 50

function animate() {
    requestAnimationFrame(animate)
    vid.clearRect(0, 0, innerWidth, innerHeight)
    vid.beginPath()
    let cirPos = [cirVec2.x, cirVec2.y]
    vid.arc(...cirPos, cirRadius, 0, pi * 2, false)
    vid.stroke()

    if (cirVec2.x + cirRadius > innerWidth || cirVec2.x - cirRadius < 0) {
        cirVelocity2D[0] *= -1
    }

    if (cirVec2.y - cirRadius < 0 || cirVec2.y + cirRadius > innerHeight) {
        cirVelocity2D[1] *= -1
    }

    cirVec2.x += cirVelocity2D[0]
    cirVec2.y += cirVelocity2D[1]
}

animate()
