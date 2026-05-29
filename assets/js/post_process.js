function post_process() {
    image(final_buffer, width/2 - buffer_width/2, height/2 - buffer_height/2)

    glitch_timer -= deltaTime / 1000
    if (glitch_timer <= 0) {
        glitch_timer = random(0.5, 1)
        if (random() < 0.5) trigger_glitch()
    }

    if (POST_FX.scanlines.on) draw_scanlines(POST_FX.scanlines)
    if (POST_FX.aberration.on) draw_aberration(POST_FX.aberration)
    if (POST_FX.glitch.on) draw_glitch(POST_FX.glitch)
    if (POST_FX.grain.on) draw_grain(POST_FX.grain)
    if (POST_FX.bloom.on) draw_bloom(POST_FX.bloom)
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

    drawingContext.globalCompositeOperation = 'source-over'
}

function trigger_glitch() {
    glitch_slices = []
    let num_slices = floor(random(3,10))

    for (let i = 0; i < num_slices; i++) {
        glitch_slices.push({
            y: random(height/2 - buffer_height/2, height/2 + buffer_height/2),
            h: random(2, buffer_height * 0.08),
            offset: random(-80, 80),
            duration: random(0.05, 0.3),
            color_shift: random() < 0.4
        })
    }
}

function draw_glitch(config) {
    if (glitch_slices.length === 0) return

    let context = drawingContext
    context.save()

    // drawImage ignores the canvas transform and works in raw device pixels
    // so reset transform and convert all coords to device pixels
    let t = context.getTransform()
    let pr = t.a // scale factor (p5 sets this to pixelDensity * devicePixelRatio)
    context.resetTransform()

    let bx = floor(width/2 - buffer_width/2) * pr
    let by = floor(height/2 - buffer_height/2) * pr
    let bw = buffer_width * pr
    let bh = buffer_height * pr

    context.beginPath()
    context.rect(bx, by, bw, bh)
    context.clip()

    let still_active = false

    for (let slice of glitch_slices) {
        slice.duration -= deltaTime / 1000
        if (slice.duration <= 0) continue

        still_active = true

        let sy = slice.y * pr
        let sh = slice.h * pr
        let offset = slice.offset * pr

        if (sh < 1) continue

        if (slice.color_shift) {
            context.globalCompositeOperation = 'lighter'
            context.globalAlpha = 0.3
            context.drawImage(context.canvas, bx + offset * 1.5, sy, bw, sh, bx, sy, bw, sh)
            context.globalAlpha = 0.2
            context.drawImage(context.canvas, bx - offset, sy, bw, sh, bx, sy, bw, sh)
            context.globalCompositeOperation = 'source-over'
            context.globalAlpha = 1
        } else {
            context.drawImage(context.canvas, bx + offset, sy, bw, sh, bx, sy, bw, sh)
        }
    }

    if (!still_active) glitch_slices = []

    context.restore()
    drawingContext.globalCompositeOperation = 'source-over'
}

function draw_grain(config) {
    let num_particles = config.amount * 100
    for (let i = 0; i < num_particles; i++) {
        let x = random(width)
        let y = random(height)
        let alpha = random(30, 100)
        let size = random(1, 2)

        if (random() < 0.5) {
            stroke(255, 255, 255, alpha)
        } else {
            stroke(0, 0, 0, alpha)
        }
        strokeWeight(size)
        point(x, y)
    }
    noStroke()
}

function draw_bloom(config) {
    let x = width/2 - buffer_width/2
    let y = height/2 - buffer_height/2

    drawingContext.filter = `blur(${config.radius * 2}px)`
    drawingContext.globalCompositeOperation = 'screen'
    tint(255, 255, 255, config.strength * 120)
    image(final_buffer, x, y)

    drawingContext.filter = `blur(${config.radius}px)`
    tint(255, 255, 255, config.strength * 80)
    image(final_buffer, x, y)

    drawingContext.filter = 'none'
    drawingContext.globalCompositeOperation = 'source-over'
    noTint()
}