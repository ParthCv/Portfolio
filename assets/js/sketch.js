function setup() {
    createCanvas(windowWidth, windowHeight)
    frameRate(60)
    rendering_buffer = createGraphics(buffer_width, buffer_height)
    final_buffer = createGraphics(buffer_width, buffer_height)
}

function draw() {
    background(canvas_bg_color[0], canvas_bg_color[1], canvas_bg_color[2])

    let configs = {
        peony:        FLOWER_CONFIG,
        lotus:        LOTUS_CONFIG,
        rose:         ROSE_CONFIG,
        gerbera:      GERBERA_CONFIG,
        marigold:     MARIGOLD_CONFIG,
        sunflower:    SUNFLOWER_CONFIG,
        calibrachoa:  CALIBRACHOA_CONFIG,
        pericallis:   PERICALLIS_CONFIG,
        hibiscus:     HIBISCUS_CONFIG,
        lily:         LILY_CONFIG,
    }

    let config = configs[FLOWER_LIST[flower_index]]
    draw_flower(config)
    render_buffer()
    post_process()
}

function mousePressed() {
    //bloom = 0
    if (window._portfolio_mode) return
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
``