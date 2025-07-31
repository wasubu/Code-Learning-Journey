const pi = Math.PI
const max = Math.max
const min = Math.min
const sqrt = Math.sqrt
const round = Math.round

let canvas = document.querySelector("canvas")
let vid = canvas.getContext("2d")

let keyPressed = {}


function distance(x1, y1, x2, y2) {
    return sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

class Square {
    constructor(pos, size, vecX, vecY, type) {
        this.pos = pos
        this.size = size
        this.returnSize = this.size
        this.vx = vecX
        this.vy = vecY
        this.ifTouchingPlayer = false
        this.touchedTime = 0
        this.type = type
        this.color = this.type === "blue" ? "blue" : "red"
        this.firstTouched = 0
        this.speedMultiply = 1
    }

    draw() {
        if (this.ifTouchingPlayer) {
            vid.fillStyle = "green"
        } else {
            vid.fillStyle = this.color
        }
        let squareArgs = [
            ...this.pos,
            this.size,
            this.size,
        ]
        vid.fillRect(...squareArgs)
    }

    move() {
        this.pos[0] += this.vx * this.speedMultiply
        this.pos[1] += this.vy * this.speedMultiply
    }

    bounce(walls) {
        let ifTouching = {
            right: this.pos[0] + this.vx > canvas.width - this.size,
            left: this.pos[0] + this.vx < 0,
            up: this.pos[1] + this.vy < 0,
            down: this.pos[1] + this.vy > canvas.height - this.size,
        }
        if (ifTouching.down) {
            this.pos[1] = canvas.height - this.size;
            this.vy *= -1
        }
        if (ifTouching.up) {
            this.pos[1] = 0
            this.vy *= -1
        }
        if (ifTouching.right) {
            this.pos[0] = canvas.width - this.size
            this.vx *= -1
        }
        if (ifTouching.left) {
            this.pos[0] = 0
            this.vx *= -1
        }

        walls.forEach(wall => {
            let wallEdge = {
                left: wall.pos[0], right: wall.pos[0] + wall.width,
                bottom: wall.pos[1] + wall.height, top: wall.pos[1]
            }
            let squareEdge = {
                left: this.pos[0], right: this.pos[0] + this.size,
                bottom: this.pos[1] + this.size, top: this.pos[1]
            }
            if (
                squareEdge.right > wallEdge.left && squareEdge.left < wallEdge.right &&
                squareEdge.top < wallEdge.bottom && squareEdge.bottom > wallEdge.top
            ) {
                let overlapRight = squareEdge.right - wallEdge.left;   // how much square's right side is inside wall from the left
                let overlapLeft = wallEdge.right - squareEdge.left;    // how much square's left side is inside wall from the right
                let overlapTop = wallEdge.bottom - squareEdge.top;     // how much square's top is inside wall from the bottom
                let overlapBottom = squareEdge.bottom - wallEdge.top;  // how much square's bottom is inside wall from the top

                let minOverlap = Math.min(overlapRight, overlapLeft, overlapTop, overlapBottom);

                if (minOverlap === overlapRight && this.vx > 0) {
                    this.pos[0] = wallEdge.left - this.size;
                    this.vx *= -1;
                } else if (minOverlap === overlapLeft && this.vx < 0) {
                    this.pos[0] = wallEdge.right;
                    this.vx *= -1;
                } else if (minOverlap === overlapTop && this.vy < 0) {
                    this.pos[1] = wallEdge.bottom;
                    this.vy *= -1;
                } else if (minOverlap === overlapBottom && this.vy > 0) {
                    this.pos[1] = wallEdge.top - this.size;
                    this.vy *= -1;
                }
            }
        })
    }

    collisionCheck(player) {
        let rect = {
            left: this.pos[0],
            right: this.pos[0] + this.size,
            up: this.pos[1],
            down: this.pos[1] + this.size,
        }
        let [playerX, playerY] = player.pos
        let closestX = max(rect.left, min(playerX, rect.right))
        let closestY = max(rect.up, min(playerY, rect.down))
        vid.beginPath()
        vid.arc(closestX, closestY, 5, 0, pi * 2, 1)
        vid.fillStyle = 'white'
        vid.fill()
        vid.stroke()
        let touching = distance(
            playerX, playerY, closestX, closestY
        ) <= player.size
        if (touching) {
            if (!this.ifTouchingPlayer) {
                this.firstTouched = performance.now()
            }
            this.touchedTime = performance.now()
            this.ifTouchingPlayer = true
        } else {
            this.touchedTime = 0
            this.firstTouched = 0
            this.ifTouchingPlayer = false
        }
    }

    displayBlueStats() {
        if (this.type === "blue") {
            let textX = 110
            let textY = 48
            let displayText = ""
            let blueSquareX = 0
            let blueSquareY = 0
            let miniBlueSize = 35

            vid.beginPath()
            vid.roundRect(13, 13, 280, 80, 15)
            vid.fillStyle = 'rgba(0,0,0,0.55)'
            vid.fill()
            vid.stroke()

            vid.font = "100 19px Consolas"
            vid.fillStyle = "white"
            displayText = `${round(this.touchedTime - this.firstTouched)}ms`
            vid.fillText(displayText, textX, textY + 25)
            vid.font = "25px Arial" //30 pixels arial
            vid.fillStyle = "white" //color black
            blueSquareX = round(this.pos[0])
            blueSquareY = round(this.pos[1])
            displayText = `x: ${blueSquareX} y: ${blueSquareY}`
            vid.fillText(displayText, textX, textY) //make text

            miniBlueSize = 35 * this.size / this.returnSize
            vid.fillStyle = this.ifTouchingPlayer ? "green" : "blue"
            vid.fillRect(43, 35, miniBlueSize, miniBlueSize)
        }
    }

    interact() {
        if (this.size > 10) {
            this.size -= (this.touchedTime - this.firstTouched) / 400
        }
        if (!this.ifTouchingPlayer) {
            this.size += (this.returnSize - this.size) / 7
            this.speedMultiply = 1 + (this.returnSize - this.size) / 0.9
        }
    }

    update(player, walls) {
        this.interact()
        this.move()
        this.bounce(walls)
        this.draw()
        this.collisionCheck(player)
    }
}

class Player {
    constructor() {
        this.pos = [200, 200]
        this.dx = 0
        this.dy = 0
        this.size = 25
        this.speed = 6
        this.color = "#54afff"
        this.isHitting = {
            right: false,
            left: false,
            top: false,
            bottom: false
        }
    }

    draw() {
        vid.beginPath()
        vid.lineWidth = 2
        vid.arc(...this.pos, this.size, 0, pi * 2, 0)
        vid.fillStyle = this.color
        vid.fill()
        vid.stroke()
    }

    move() {
        let speed = this.speed
        let clampSpeed = {
            right: this.pos[0] < canvas.width ? speed : 0,
            left: this.pos[0] > 0 ? speed : 0,
            up: this.pos[1] > 0 ? speed : 0,
            down: this.pos[1] < canvas.height ? speed : 0,
        }
        let pressed = {
            a: keyPressed["KeyA"],
            s: keyPressed["KeyS"],
            w: keyPressed["KeyW"],
            d: keyPressed["KeyD"]
        }
        if (pressed.d) {
            this.dx = clampSpeed.right
        }
        if (pressed.a) {
            this.dx = - clampSpeed.left
        }
        if (pressed.w) {
            this.dy = - clampSpeed.up
        }
        if (pressed.s) {
            this.dy = clampSpeed.down
        }
        if (!(pressed.a || pressed.d)) {
            this.dx = 0
        }
        if (!(pressed.w || pressed.s)) {
            this.dy = 0
        }
        this.pos[0] += this.dx
        this.pos[1] += this.dy
    }

    collision(walls) {
        walls.forEach(wall => {
            let radius = this.size * 0.7
            let playerEdge = {
                left: this.pos[0] + this.dx - radius,
                right: this.pos[0] + this.dx + radius,
                top: this.pos[1] + this.dy - radius,
                bottom: this.pos[1] + this.dy + radius
            }
            let wallEdge = {
                right: wall.pos[0] + wall.width,
                left: wall.pos[0],
                top: wall.pos[1],
                bottom: wall.pos[1] + wall.height
            }
            if (
                playerEdge.right > wallEdge.left &&
                playerEdge.left < wallEdge.right &&
                playerEdge.bottom > wallEdge.top &&
                playerEdge.top < wallEdge.bottom

            ) {
                let overlap = {
                    right: playerEdge.right - wallEdge.left,
                    left: wallEdge.right - playerEdge.left,
                    top: wallEdge.bottom - playerEdge.top,
                    bottom: playerEdge.bottom - wallEdge.top
                }
                let smallestGap = min(overlap.right, overlap.left, overlap.bottom, overlap.top)

                console.log("OVERLAP", overlap, "dx:", this.dx, "gap:", smallestGap)
                if (smallestGap === overlap.right && this.dx > 0) {
                    wall.color = "red"
                    this.pos[0] -= this.dx

                }
                if (smallestGap === overlap.left && this.dx < 0) {
                    wall.color = "red"
                    this.pos[0] -= this.dx
                }
                if (smallestGap === overlap.top && this.dy < 0) {
                    wall.color = "red"
                    this.pos[1] -= this.dy
                }
                if (smallestGap === overlap.bottom && this.dy > 0) {
                    wall.color = "red"
                    this.pos[1] -= this.dy
                }
            } else {
                wall.color = "black"
            }
        })
    }
}

class Wall {
    constructor(pos, width, height) {
        this.pos = pos
        this.width = width
        this.height = height
        this.color = "black"
    }

    draw() {
        vid.fillStyle = this.color
        vid.fillRect(...this.pos, this.width, this.height)
    }
}

document.addEventListener("keydown", function(event) {
    keyPressed[event.code] = true
})

document.addEventListener("keyup", function(event) {
    keyPressed[event.code] = false
})

let squares = []
squares.push(new Square([100, 100], 50, 2.6, 5))
squares.push(new Square([300, 200], 50, -2.6, 2))
squares.push(new Square([300, 400], 50, -4.6, -3))
squares.push(new Square([100, 400], 50, 4.6, -3))
squares.push(new Square([300, 400], 70, -1.6, -1))
squares.push(new Square([600, 400], 70, -1.6, -1))
squares.push(new Square([400, 400], 120, 0.7, 0.5, "blue"))
squares.push(new Square([300, 400], 30, -7.6, 2))
squares.push(new Square([100, 100], 30, 7.6, -2))

let player = new Player()

let walls = []
walls.push(new Wall([400, 200], 130, 50))
walls.push(new Wall([100, 400], 50, 50))

function update() {
    requestAnimationFrame(update)
    vid.clearRect(0, 0, canvas.width, canvas.height)
    squares.forEach(function(square) {
        square.update(player, walls)
    })
    player.move()
    player.collision(walls)
    player.draw()
    squares.forEach(function(square) {
        if (square.type === "blue") {
            square.displayBlueStats()
        }
    })
    walls.forEach(function(wall) {
        wall.draw()
    })
}

update()
