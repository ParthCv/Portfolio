function draw_flower() {
    rendering_buffer.background(0)
    rendering_buffer.resetMatrix()
    rendering_buffer.translate(buffer_width/2, buffer_height/2) // move origin to center
    rotY += 0.005
    //rotX = -0.5 + sin(frameCount * 0.003) * 0.3
    let all_petals = []
    let flower_scale = buffer_width / 800
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

    for (let cl = 0; cl < 5; cl++) {
        let clr = cl / 5
        let center_bloom = constrain((bloom - 0.7) / 0.3, 0, 1)
        let tilt = lerp(1.5, 1.1, clr)
        let len  = lerp(15, 35, clr) * center_bloom * flower_scale
        let wid  = lerp(8,  18, clr) * center_bloom * flower_scale
        let np   = floor(lerp(5, 8, clr))
        let off  = cl * 0.5

        // darker more saturated center color
        let r = lerp(120, 150, clr)
        let g = lerp(80,  110, clr)
        let b = lerp(200, 240, clr)

        define_petal_layer(all_petals, np, len, wid, tilt, off, r, g, b)
    }

    let center_alpha = constrain((bloom - 0.85) / 0.15, 0, 1)
    if (center_alpha > 0) {
        let [cx, cy] = [0, 0]
        let cp = project_stem_point(0, -10 * flower_scale, 0)
        all_petals.push({
            type: 'center',
            x: cp.x,
            y: cp.y,
            z: cp.z - 1,  // always on top
            r: 100, g: 60, b: 180,
            size: 12 * flower_scale * center_alpha
        })
    }

    define_stem(all_petals, flower_scale)
    all_petals.sort((a, b) => b.z - a.z)

    for (let p of all_petals) {
        if (p.type === 'quad') {
            rendering_buffer.push()
            if (render_mode === RENDER_MODE.WIREFRAME) {
                rendering_buffer.noFill()
                rendering_buffer.stroke(p.r, p.g, p.b)
                rendering_buffer.strokeWeight(0.5)
            } else {
                rendering_buffer.fill(p.r, p.g, p.b)
                rendering_buffer.noStroke()
            }

            rendering_buffer.beginShape()
            rendering_buffer.vertex(p.p00.x, p.p00.y)
            rendering_buffer.vertex(p.p10.x, p.p10.y)
            rendering_buffer.vertex(p.p11.x, p.p11.y)
            rendering_buffer.vertex(p.p01.x, p.p01.y)
            rendering_buffer.endShape(CLOSE)
            rendering_buffer.pop()
            continue
        }

        if (p.type === 'center') {
            if (render_mode === RENDER_MODE.WIREFRAME) {
                rendering_buffer.noFill()
                rendering_buffer.stroke(p.r, p.g, p.b)
                rendering_buffer.strokeWeight(0.8)
                rendering_buffer.circle(p.x, p.y, p.size)
                rendering_buffer.noStroke()
            } else {
                rendering_buffer.fill(p.r, p.g, p.b)
                rendering_buffer.noStroke()
                rendering_buffer.circle(p.x, p.y, p.size)
            }
            continue
        }

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

function define_stem(all_petals, flower_scale) {
    let sides     = 8
    let segments  = 40
    let radius    = 6  * flower_scale
    let stem_len   = 280 * flower_scale
    let stem_color = [55, 90, 40]

    for (let seg = 0; seg < segments; seg++) {
        let t0 = seg       / segments
        let t1 = (seg + 1) / segments

        let y0 = t0 * stem_len
        let y1 = t1 * stem_len

        let cx0 = sin(t0 * PI * 0.3) * 18 * flower_scale + sin(t0 * PI * 0.8) * 6 * flower_scale
        let cx1 = sin(t1 * PI * 0.3) * 18 * flower_scale + sin(t1 * PI * 0.8) * 6 * flower_scale

        let r0 = lerp(radius * 0.6, radius, t0)
        let r1 = lerp(radius * 0.6, radius, t1)

        for (let s = 0; s < sides; s++) {
            let a0 = (TWO_PI / sides) * s
            let a1 = (TWO_PI / sides) * (s + 1)

            let p00 = project_stem_point(cx0 + cos(a0)*r0, y0, sin(a0)*r0)
            let p10 = project_stem_point(cx0 + cos(a1)*r0, y0, sin(a1)*r0)
            let p01 = project_stem_point(cx1 + cos(a0)*r1, y1, sin(a0)*r1)
            let p11 = project_stem_point(cx1 + cos(a1)*r1, y1, sin(a1)*r1)

            let midA = (a0 + a1) / 2
            let nx   = cos(midA)
            let ny   = 0
            let nz   = sin(midA)

            // apply rotY
            let nx_y = nx * cos(rotY) + nz * sin(rotY)
            let nz_y = -nx * sin(rotY) + nz * cos(rotY)

            // apply rotX
            let ny_final = ny    * cos(rotX) - nz_y * sin(rotX)
            let nz_final = ny    * sin(rotX) + nz_y * cos(rotX)

            // backface cull — skip faces pointing away from camera
            if (nz_final > 0) continue

            // lighting uses fully rotated normal
            let light = calculate_lighting(nx_y, ny_final, nz_final)

            let midT  = (t0 + t1) / 2
            let shade = lerp(1, 0.5, midT)
            let r = constrain(stem_color[0] * light * shade, 0, 255)
            let g = constrain(stem_color[1] * light * shade, 0, 255)
            let b = constrain(stem_color[2] * light * shade, 0, 255)

            let avgZ = (p00.z + p10.z + p01.z + p11.z) / 4

            all_petals.push({
                type: 'quad',
                p00, p10, p01, p11,
                z:    avgZ,
                r, g, b
            })
        }
    }
}

function project_stem_point(x3, y3, z3) {
    // apply rotY
    let rx = x3 * cos(rotY) + z3 * sin(rotY)
    let rz = -x3 * sin(rotY) + z3 * cos(rotY)

    // apply rotX
    let ry4 = y3  * cos(rotX) - rz * sin(rotX)
    let rz4 = y3  * sin(rotX) + rz * cos(rotX)

    let scale = focal / (focal + rz4)
    return {
        x: rx  * scale,
        y: ry4 * scale,
        z: rz4
    }
}