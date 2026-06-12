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
    grain:      { on: false, amount: 2 },
    bloom:      { on: false, strength: 0.5, radius: 8 },
}

//glitch
let glitch_slices = []
let glitch_timer = 0

// Flower stuff
let stem_growth  = 0     // persists across flower switches
let current_flower = 'peony'  // tracks active flower
let cached_thorns = []
let thorns_generated = false
const FLOWER_LIST = [
    'peony', 'lotus', 'rose', 'gerbera', 'marigold', 'sunflower',
    'calibrachoa', 'pericallis', 'hibiscus', 'lily'
]

let flower_index = 0