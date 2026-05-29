function render_buffer() {
    final_buffer.background(0)

    if (render_mode === RENDER_MODE.DEFAULT || 
        render_mode === RENDER_MODE.WIREFRAME) {
        final_buffer.image(rendering_buffer, 0, 0)
        
        return
    }

    rendering_buffer.loadPixels()
    const grid = 12 //min-6 max-18
    const pd = rendering_buffer.pixelDensity()

    for (let sy = 0; sy < buffer_height; sy += grid) {
        for (let sx = 0; sx < buffer_width; sx += grid) {
            let idx = ((sy * buffer_width * pd * pd) + sx * pd) * 4
            let r = rendering_buffer.pixels[idx]
            let g = rendering_buffer.pixels[idx + 1]
            let b = rendering_buffer.pixels[idx + 2]
            let brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255

            if (brightness < 0.05) continue // skip black cells
            
            let cx = sx + grid/2 
            let cy = sy + grid/2 

            switch(render_mode) {
                case RENDER_MODE.ASCII: draw_ascii(final_buffer, cx, cy, r, g, b, brightness, grid); break;
                case RENDER_MODE.DOTS: draw_dots(final_buffer, cx, cy, r, g, b, brightness, grid); break;
                case RENDER_MODE.SQUARES: draw_squares(final_buffer, cx, cy, r, g, b, brightness, grid); break;
                case RENDER_MODE.CROSSES: draw_crosses(final_buffer, cx, cy, r, g, b, brightness, grid); break;
                case RENDER_MODE.RINGS: draw_rings(final_buffer, cx, cy, r, g, b, brightness, grid); break;
                case RENDER_MODE.TRIANGLES: draw_triangles(final_buffer, cx, cy, r, g, b, brightness, grid); break;
                case RENDER_MODE.HATCHING: draw_hatching(final_buffer, cx, cy, r, g, b, brightness, grid); break;

            }
        }
    }
}

function draw_dots(buf, cx, cy, r, g, b, brightness, grid) {
    let diameter = grid * brightness * 1.2
    buf.fill(r, g, b)
    buf.noStroke()
    buf.circle(cx, cy, diameter)
}

function draw_rings(buf, cx, cy, r, g, b, brightness, grid) {
    let diameter = grid * 0.9
    let stroke_weight = brightness * grid * 0.3
    buf.noFill()
    buf.stroke(r, g, b)
    buf.strokeWeight(stroke_weight)
    buf.circle(cx, cy, diameter)
    buf.noStroke()
}

function draw_triangles(buf, cx, cy, r, g, b, brightness, grid) {
    let size = grid * brightness
    buf.fill(r, g, b)
    buf.noStroke()
    buf.triangle(
        cx, cy - size/2,
        cx - size/2, cy + size/2,
        cx + size/2, cy + size/2
    )
}

function draw_squares(buf, cx, cy, r, g, b, brightness, grid) {
    buf.fill(r, g, b)
    buf.noStroke()
    buf.square(cx, cy, grid * 0.85)
}

function draw_crosses(buf, cx, cy, r, g, b, brightness, grid) {
    let size = grid * brightness
    let width = size * 0.25
    
    buf.fill(r, g, b)
    buf.noStroke()
    buf.rectMode(CENTER)
    buf.rect(cx, cy, size, width)
    buf.rect(cx, cy, width, size)
}


function draw_ascii(buf, cx, cy, r, g, b, brightness, grid) {
    let pos_hash = (floor(cx * 7) + floor(cy * 13)) % ASCII_CHARS_JP.length
    let char_id = floor(brightness * ASCII_CHARS_JP.length)
    char_id = (char_id + pos_hash) % ASCII_CHARS.length
    let char = ASCII_CHARS_JP[char_id]

    buf.textSize(grid * (0.6 + brightness * 0.8))
    buf.textAlign(CENTER, CENTER)
    buf.fill(r, g, b)
    buf.noStroke()
    buf.text(char, cx, cy)
}

function draw_hatching(buf, cx, cy, r, g, b, brightness, grid) {
    if (brightness < 0.1) return

    buf.stroke(r, g, b)
    buf.noFill()

    // more bright more line
    let num_lines = floor(brightness * 4) + 1
    let spacing = grid / num_lines
    let len = grid * 0.9
    let storke_weight = 0.8

    let brightness_thresh = 0.6

    buf.strokeWeight(storke_weight)

    for (let i = 0; i < num_lines; i++) {
        let offset = ((-grid)/2 + spacing/2) + (i * spacing)

        if (brightness > brightness_thresh) {
            buf.line(cx + offset, cy - len/2, cx + offset, cy + len/2)
            buf.line(cx - len/2, cy + offset, cx + len/2, cy + offset)
        } else if (brightness > brightness_thresh/2) {
            buf.line(cx - len/2, cy + offset - len/2, cx + len/2, cy + offset + len/2)
        } else {
            buf.line(cx - len/2, cy + offset + len/2, cx + len/2, cy + offset - len/2)
        }
    }
}