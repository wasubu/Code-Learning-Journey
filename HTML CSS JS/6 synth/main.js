let canvas = document.querySelector("canvas")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let vid = canvas.getContext('2d')

let doDebug = {
    state: true,
    watchFor: {
        whiteCreated: false

    }
}

canvas.addEventListener('mousemove', (event) => {
    const mouseX = event.offsetX
    const mouseY = event.offsetY
    piano.ifHover([mouseX, mouseY])
})

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    piano.position()
})

document.addEventListener('keydown', (event) => {
    console.log(event.code)
    if (event.code === "Space") {
        piano.position()
    }
})

class Piano {
    constructor() {
        this.pos = 0
        this.width = 750
        this.height = 300
        this.whiteWidth = 40
        this.whiteHeight = 200
        this.blackWidth = 30
        this.blackHeight = 95
        this.whiteKeys = []
        this.blackKeys = []
    }

    position() {
        this.pos = [innerWidth / 2, 200]
        let saveSelectedBlack = this.blackKeys.isSelected
        let saveSelectedWhite = this.whiteKeys.isSelected
        this.whiteKeys = []
        this.blackKeys = []
        this.createWhiteKeys(saveSelectedWhite)
        this.createBlackKeys(saveSelectedBlack)
        this.whiteKeys.isSelected = saveSelectedWhite
    }

    createWhiteKeys(selected) {
        doDebug.watchFor.whiteCreated = true
        let drawAtX = this.pos[0] - this.width / 2
        for (let i = 0; i < 16; i++) {
            let color = "white"
            let whitePos = [
                drawAtX + 10 + i * 46,
                this.pos[1] + this.height - this.whiteHeight - 10
            ]
            let [x, y] = whitePos
            let grad = vid.createLinearGradient(x, y, x, y + this.whiteHeight)
            grad.addColorStop(0, "grey")
            grad.addColorStop(0.1, color)
            grad.addColorStop(1, color)
            this.whiteKeys.push({
                pos: [whitePos[0], whitePos[1]],
                color: color,
                isSelected: false,
                grad: grad
            })
        }
    }

    createBlackKeys() {
        let drawAtX = this.pos[0] - this.width / 2
        for (let i = 0; i < 15; i++) {
            let show = [
                true, true, false, true, true, true
            ]
            let blackPos = [
                drawAtX + 32 + this.whiteWidth / 2 + i * 46 - this.blackWidth / 2,
                this.pos[1] + this.height - this.whiteHeight - 10
            ]
            let number = i % (show.length + 1)
            let showThis = show[number]
            if (showThis) {
                this.blackKeys.push(
                    {
                        pos: [blackPos[0], blackPos[1]],
                        color: "black",
                        isSelected: false
                    }
                )
            }
        }
    }

    ifHover(mousePos) {
        this.blackKeys.forEach(key => {
            if (
                mousePos[0] > key.pos[0] - 4 &&
                mousePos[0] < key.pos[0] + this.blackWidth + 3 &&
                mousePos[1] > key.pos[1] &&
                mousePos[1] < key.pos[1] + this.blackHeight
            ) {
                key.isSelected = true
            } else {
                key.isSelected = false
            }
        })

        this.whiteKeys.forEach(key => {
            let blackIsActive = this.blackKeys.some(
                bKey => bKey.isSelected
            ) // check if at least one item is True
            if (!blackIsActive) {
                if (
                    mousePos[0] > key.pos[0] - 4 &&
                    mousePos[0] < key.pos[0] + this.whiteWidth + 3 &&
                    mousePos[1] > key.pos[1] &&
                    mousePos[1] < key.pos[1] + this.whiteHeight
                ) {
                    key.isSelected = true

                } else {
                    key.isSelected = false
                }
            } else {
                key.isSelected = false
            }
        })
    }

    draw() {
        // vid.fillRect(150, 150, 400, 100)
        let drawAtX = this.pos[0] - this.width / 2
        let drawAtY = this.pos[1]

        vid.roundRect(drawAtX, drawAtY, this.width, this.height, 10)

        vid.shadowColor = "rgba(0,0,0,0.2)"
        vid.shadowBlur = 17
        vid.shadowOffsetX = -13
        vid.shadowOffsetY = 17

        vid.fillStyle = "#555555"
        vid.fill()
        vid.stroke()

        vid.shadowColor = "transparent"
        vid.shadowBlur = 0
        vid.shadowOffsetX = 0
        vid.shadowOffsetY = 0

        this.whiteKeys.forEach(key => {
            vid.fillStyle = key.isSelected ? "red" : key.grad
            vid.fillRect(...key.pos, this.whiteWidth, this.whiteHeight)
        })

        this.blackKeys.forEach(key => {
            vid.fillStyle = key.isSelected ? "red" : key.color
            vid.fillRect(...key.pos, this.blackWidth, this.blackHeight)
        })

    }
}

function makeFrameTimer() {
    let last = performance.now()
    return function logFrameTime(label = "Frame") {
        let now = performance.now()
        let delta = now - last
        last = now
        if (false) {
            console.log(`${label}: ${delta.toFixed(2)} ms`)
        }
        return delta
    }
}

function debugStats(state) {
    if (state) {
        let y = innerHeight - 20
        let x = 20
        let gap = 20
        let debugs = [
            `number of whiteKeys: ${piano.whiteKeys.length}`,
            `number of blackKeys: ${piano.blackKeys.length}`,
            `performance: ${Math.round(logFrame())}ms`,
            `white keys created: ${doDebug.watchFor.whiteCreated}`
        ]
        vid.font = "20px Arial"
        debugs.forEach((debug, index) => {
            vid.fillText(debug, x, y - gap * index)
        })
    }
}

function refreshCanvas() {
    /* if (piano.blackKeys.some(bKey => bKey.isSelected)) {
        return
    } else if (piano.whiteKeys.some(wKey => wKey.isSelected)) {
        return
    } */
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    piano.position() // redraws the keys
}
setInterval(refreshCanvas, 3000) //every 3 sec


let piano = new Piano()
piano.position()

const logFrame = makeFrameTimer()

function update() {
    requestAnimationFrame(update)
    vid.clearRect(0, 0, innerWidth, innerHeight)
    vid.fillStyle = "#f9ff9e"
    vid.fillRect(0, 0, canvas.width, canvas.height)
    piano.draw()
    debugStats(doDebug.state)
    doDebug.watchFor.whiteCreated = false
}

update()
