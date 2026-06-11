function setup() {
    createCanvas(windowWidth, windowHeight)
    frameRate(60)
    rendering_buffer = createGraphics(buffer_width, buffer_height)
    final_buffer = createGraphics(buffer_width, buffer_height)
}

function draw() {
    background(0) // clear
    draw_flower(GERBERA_CONFIG)
    render_buffer()
    post_process()
}

function mousePressed() {
    //bloom = 0
    dragging = true
    last_mouseX = mouseX
    last_mouseY = mouseY
}

function mouseReleased() {
    dragging = false
}

function mouseDragged() {
    if (dragging) {
        rotY += (mouseX - last_mouseX) * 0.01
        rotX += (mouseY - last_mouseY) * 0.01
        last_mouseX = mouseX
        last_mouseY = mouseY
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}