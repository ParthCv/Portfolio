let rotY = 0
let rotX = 0

let bloom = 0

let dragging = false
let last_mouseX = 0
let last_mouseY = 0

let rendering_buffer // for rendering the flower
let final_buffer // final image with post process 

const buffer_height = 800
const buffer_width = 800

let render_mode = RENDER_MODE.DEFAULT
const focal = 400