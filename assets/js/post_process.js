function post_process() {
    image(final_buffer, width/2 - buffer_width/2, height/2 - buffer_height/2)

    if (POST_FX.scanlines.on) draw_scanlines(POST_FX.scanlines)
    if (POST_FX.aberration.on) draw_aberration(POST_FX.aberration)
    if (POST_FX.glitch.on) draw_scanlines(POST_FX.scanlines)
    if (POST_FX.grain.on) draw_scanlines(POST_FX.scanlines)
    if (POST_FX.bloom.on) draw_scanlines(POST_FX.scanlines)
}

function draw_scanlines(config) {
    stroke(0, 0, 0, config.alpha)
    strokeWeight(1)
    for (let y = 0; y < height; y += config.spacing) {
        line(0, y, width, y)
    }
    noStroke()
}

function draw_aberration(config) {
    let x = width/2 - buffer_width/2
    let y = height/2 - buffer_height/2

    let context = drawingContext
    context.save()

    context.globalCompositeOperation = 'screen'
    tint(255, 0, 0, 180)
    image(final_buffer, x - config.offset, y)

    tint(0, 255, 0, 180)
    image(final_buffer, x, y)

    tint(0, 0, 255, 180)
    image(final_buffer, x + config.offset, y)

    context.restore()
    noTint()
}