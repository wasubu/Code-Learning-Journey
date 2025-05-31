let random = Math.random
let cos = Math.cos
let sin = Math.sin
let atan2 = Math.atan2
let pi = Math.PI

let canvas = document.querySelector("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let vid = canvas.getContext("2d")

function Circle(x, y, size, speed, angle, color) {
    this.x = x
    this.y = y
    this.size = size
    this.speed = speed
    this.angle = angle
    this.color = color
}

var circle = new Circle(100, 100, 60, 0, "red")

function update() {
    requestAnimationFrame(update)
    vid.clearRect(0, 0, innerWidth, innerHeight)
    vid.beginPath()
    vid.arc(100, 100, 60, 0, pi * 2, false)
    vid.stroke()
}

update()
