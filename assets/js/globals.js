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

let render_mode = RENDER_MODE.DEFAULT

const POST_FX = {
    scanlines:  { on: false, alpha: 40, spacing: 4 },
    aberration: { on: false, offset: 6 },
    glitch:     { on: false, intensity: 0.5 },
    grain:      { on: false, amount: 30 },
    bloom:      { on: false, strength: 0.6 },
}

// glitch effect stu