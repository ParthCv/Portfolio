let rotY = 0
let rotX = 0

let bloom = 0
const focal = 400

let dragging = false
let last_mouseX = 0
let last_mouseY = 0

let rendering_buffer // for rendering the flower
let final_buffer // final image with post process 

const buffer_height = 800
const buffer_width = 800

let render_mode = RENDER_MODE.RINGS

const POST_FX = {
    scanlines:  { on: true, alpha: 40, spacing: 4 },
    aberration: { on: true, offset: 6 },
    glitch:     { on: true, intensity: 0.5 },
    grain:      { on: true, amount: 30 },
    bloom:      { on: true, strength: 0.5, radius: 8 },
}

//glitch
let glitch_slices = []
let glitch_timer = 0