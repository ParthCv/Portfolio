function draw_flower() {
    rendering_buffer.background(0)
    rendering_buffer.resetMatrix()
    rendering_buffer.translate(buffer_width/2, buffer_height/2) // move origin to center
    rotY += 0.005
    //rotX = -0.5 + sin(frameCount * 0.003) * 0.3

    let all_petals = []

    let totalLayers = 14

    if (bloom < 1) bloom +=0.0025

    for (let layer = 0; layer < totalLayers; layer++) { 
        let lr=layer / totalLayers // 0=inner, 1=outer 

        let layer_bloom = constrain((bloom - (1 - lr) * 0.3) / 0.7, 0, 1)

        let tilt=lerp(1.3, 0.1, lr) // steep inward, flat outward 
        let len=lerp(60, 200, lr) * layer_bloom // short inner, long outer
        let wid=lerp(20, 65, lr) * layer_bloom // thin inner, wide outer 
        let np=floor(lerp(6, 12, lr)) // fewer inner,more outer 
        let off=layer * 0.4 // stagger each layer 
        // color gets lighter toward center 
        let r = lerp(150, 200, lr)
        let g = lerp(130, 190, lr)
        let b = lerp(255, 255, lr)
        define_petal_layer(all_petals, np, len, wid, tilt, off, r, g, b) 
    }

    all_petals.sort((a, b) => b.z - a.z)

    for (let p of all_petals) {
        rendering_buffer.push()
        rendering_buffer.translate(p.x2, p.y2)
        rendering_buffer.rotate(p.viewAngle )

        if (render_mode === RENDER_MODE.WIREFRAME) {
            rendering_buffer.noFill()
            rendering_buffer.stroke(p.r, p.g, p.b)
            rendering_buffer.strokeWeight(0.8)
        } else {
            rendering_buffer.fill(p.r, p.g, p.b)
            rendering_buffer.noStroke()
        }

        draw_petal(p.length, p.width)
        rendering_buffer.pop()
    }
}

function define_petal_layer(petal_arr, num_petals, length, width, tilt, layer_offset, R, G, B) {
    for (let i = 0; i < num_petals; i++) {
        let base_angle = (TWO_PI / num_petals) * i + layer_offset
        let angle = base_angle + rotY

        let dist = length * 0.4

        let x3 = cos(angle) * dist * cos(tilt)
        let y3 = -sin(tilt) * dist
        let z3 = sin(angle) * dist * cos(tilt)

        let y4 = y3 * cos(rotX) - z3 * sin(rotX)
        let z4 = y3 * sin(rotX) + z3 * cos(rotX)

        let nx_raw = cos(base_angle) * cos(tilt)
        let ny_raw = -sin(tilt)
        let nz_raw = sin(base_angle) * cos(tilt)

        let n_mag = sqrt(nx_raw*nx_raw + ny_raw*ny_raw + nz_raw*nz_raw)
        let nx = nx_raw / n_mag
        let ny = ny_raw / n_mag
        let nz = nz_raw / n_mag

        let light = calculate_lighting(nx, ny, nz)

        let scale = focal / (focal + z4)

        petal_arr.push({
            x2: x3 * scale,
            y2: y4 * scale,
            z: z4,
            angle,
            length: length * scale,
            width: width * scale,
            r: constrain(R * light, 0, 255),
            g: constrain(G * light, 0, 255),
            b: constrain(B * light, 0, 255),
            tilt: tilt,
            viewAngle: atan2(y4, x3)
        })
    }
}

function draw_petal(length, width) {
    rendering_buffer.beginShape()
    for (let tt = 0; tt <= 1; tt +=0.05) { 
        let x = tt * length // length of petal
        let y=sin(tt * PI) * width // width, sine arc
        rendering_buffer.vertex(x, y)
    } 
    for (let tt=1; tt>= 0; tt -= 0.05) {
        let x = tt * length
        let y = -sin(tt * PI) * width // bottom edge mirrored
        rendering_buffer.vertex(x, y)
    }
    rendering_buffer.endShape(CLOSE)
}