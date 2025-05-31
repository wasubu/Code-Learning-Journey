let random = Math.random
let cos = Math.cos
let sin = Math.sin
let pi = Math.PI
let atan2 = Math.atan2

let canvas = document.querySelector("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let vid = canvas.getContext("2d")

let cir1 = {
    pos: [100, 300],
    angle: random() * 2 * pi,
    velocity: 15,
    size: 60,
}

console.log(sin(cir1.angle))

function update() {
    requestAnimationFrame(update)
    vid.clearRect(0, 0, innerWidth, innerHeight)
    vid.beginPath()
    vid.arc(...cir1.pos, cir1.size, 0, pi * 2, false)
    vid.stroke()
    cir1.pos[0] += cos(cir1.angle) * cir1.velocity
    cir1.pos[1] -= sin(cir1.angle) * cir1.velocity
    if (cir1.pos[1] + cir1.size > innerHeight) {
        cir1.angle = atan2(-sin(cir1.angle), cos(cir1.angle))
    }
    if (cir1.pos[1] - cir1.size < 0) {
        cir1.angle = atan2(-sin(cir1.angle), cos(cir1.angle))
    }
    if (cir1.pos[0] + cir1.size > innerWidth) {
        cir1.angle = atan2(sin(cir1.angle), -cos(cir1.angle))
    }
    if (cir1.pos[0] - cir1.size < 0) {
        cir1.angle = atan2(sin(cir1.angle), -cos(cir1.angle))
    }
}

update()
