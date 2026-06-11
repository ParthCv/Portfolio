function draw_flower(config) {
    rendering_buffer.background(0)
    rendering_buffer.resetMatrix()
    rendering_buffer.translate(buffer_width/2, buffer_height/2)
    rotY += 0.005

    let flower_scale = buffer_width / 800
    let all_petals   = []

    if (bloom < 1) bloom += config.bloom_speed

    if (stem_growth < 1) stem_growth += 0.008

    // main layers
    for (let layer = 0; layer < config.total_layers; layer++) {
        let lr = layer / config.total_layers

        let layer_bloom = constrain(
            (bloom - (1 - lr) * config.bloom_delay) / (1 - config.bloom_delay),
            0, 1
        )

        let tilt = lerp(config.tilt.inner, config.tilt.outer, lr)
        let len  = lerp(config.len.min,    config.len.max,    lr) * layer_bloom * flower_scale
        let wid  = lerp(config.wid.min,    config.wid.max,    lr) * layer_bloom * flower_scale
        let np   = floor(lerp(config.petals_per_layer.min, config.petals_per_layer.max, lr))
        let off  = layer * config.layer_stagger

        let r = lerp(config.petal_color.inner[0], config.petal_color.outer[0], lr)
        let g = lerp(config.petal_color.inner[1], config.petal_color.outer[1], lr)
        let b = lerp(config.petal_color.inner[2], config.petal_color.outer[2], lr)

        define_petal_layer(all_petals, np, len, wid, tilt, off, r, g, b, config)
    }

    // center — either disc or petal layers depending on config
    let center_bloom = constrain(
        (bloom - config.center_bloom_start) / (1 - config.center_bloom_start),
        0, 1
    )

    if (config.center_type === 'disc') {
        define_disc(all_petals, flower_scale, config, center_bloom)
    } else {
        for (let cl = 0; cl < config.center_layers; cl++) {
            let clr  = cl / config.center_layers
            let tilt = lerp(config.center_tilt.inner, config.center_tilt.outer, clr)
            let len  = lerp(config.center_len.min,    config.center_len.max,    clr) * center_bloom * flower_scale
            let wid  = lerp(config.center_wid.min,    config.center_wid.max,    clr) * center_bloom * flower_scale
            let np   = floor(lerp(5, 8, clr))
            let off  = cl * 0.5
            let r = lerp(config.center_color.inner[0], config.center_color.outer[0], clr)
            let g = lerp(config.center_color.inner[1], config.center_color.outer[1], clr)
            let b = lerp(config.center_color.inner[2], config.center_color.outer[2], clr)
            define_petal_layer(all_petals, np, len, wid, tilt, off, r, g, b, config)
        }

        // center dot for petal-type centers
        let center_alpha = constrain((bloom - 0.6) / 0.4, 0, 1)
        if (center_alpha > 0) {
            let cp = project_stem_point(0, -10 * flower_scale, 0)
            all_petals.push({
                type:  'center',
                x:     cp.x,
                y:     cp.y,
                z:     cp.z - 1,
                r:     config.center_dot_color[0],
                g:     config.center_dot_color[1],
                b:     config.center_dot_color[2],
                size:  config.center_dot_size * flower_scale * center_alpha
            })
        }
    }

    // let stem_bloom = constrain(bloom / 0.3, 0, 1)
    define_stem(all_petals, flower_scale, config, stem_growth)
    define_leaves(all_petals, flower_scale, config, stem_growth)
    define_thorns(all_petals, flower_scale, config, stem_growth)

    all_petals.sort((a, b) => b.z - a.z)
    draw_all(all_petals)
    rendering_buffer.loadPixels()
}

function define_disc(all_petals, flower_scale, config, center_bloom) {
    if (center_bloom <= 0) return

    let disc_r    = config.disc_radius   * flower_scale * center_bloom
    let disc_h    = config.disc_height   * flower_scale
    let rings     = config.disc_rings    // concentric rings of quads
    let segments  = config.disc_segments // segments around each ring
    let dc        = config.disc_color
    let ec        = config.disc_edge_color

    // build disc as a flat grid of triangles from center outward
    // each ring is a band of quads at increasing radius
    for (let ring = 0; ring < rings; ring++) {
        let r0 = (ring     / rings) * disc_r
        let r1 = ((ring+1) / rings) * disc_r

        // slight dome — center higher than edges
        let h0 = config.disc_offset * flower_scale - disc_h * (1 - pow(ring / rings, 2))
        let h1 = config.disc_offset * flower_scale - disc_h * (1 - pow((ring+1) / rings, 2))

        // color lerps from center to edge
        let t  = ring / rings
        let pr = lerp(dc[0], ec[0], t)
        let pg = lerp(dc[1], ec[1], t)
        let pb = lerp(dc[2], ec[2], t)

        for (let s = 0; s < segments; s++) {
            let a0 = (TWO_PI / segments) * s
            let a1 = (TWO_PI / segments) * (s + 1)

            // 4 corners of quad
            let p00 = project_stem_point(cos(a0)*r0, h0, sin(a0)*r0)
            let p10 = project_stem_point(cos(a1)*r0, h0, sin(a1)*r0)
            let p01 = project_stem_point(cos(a0)*r1, h1, sin(a0)*r1)
            let p11 = project_stem_point(cos(a1)*r1, h1, sin(a1)*r1)

            // normal points upward for disc face
            let nx = 0, ny = -1, nz = 0

            // rotate normal
            let nx_y     = nx * cos(rotY) + nz * sin(rotY)
            let nz_y     = -nx * sin(rotY) + nz * cos(rotY)
            let ny_final = ny * cos(rotX) - nz_y * sin(rotX)
            let nz_final = ny * sin(rotX) + nz_y * cos(rotX)

            // backface cull
            if (nz_final > 0.3) continue

            let light = calculate_lighting(nx_y, ny_final, nz_final)
            let avgZ  = (p00.z + p10.z + p01.z + p11.z) / 4

            all_petals.push({
                type: 'quad',
                p00, p10, p01, p11,
                z:    avgZ,
                r:    constrain(pr * light, 0, 255),
                g:    constrain(pg * light, 0, 255),
                b:    constrain(pb * light, 0, 255)
            })
        }
    }
}

function draw_all(all_petals) {
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
            } else {
                rendering_buffer.fill(p.r, p.g, p.b)
                rendering_buffer.noStroke()
            }
            rendering_buffer.circle(p.x, p.y, p.size)
            continue
        }

        if (p.type === 'petal') {
            rendering_buffer.push()
            rendering_buffer.translate(p.x2, p.y2)
            rendering_buffer.rotate(p.viewAngle)
            if (render_mode === RENDER_MODE.WIREFRAME) {
                rendering_buffer.noFill()
                rendering_buffer.stroke(p.r, p.g, p.b)
                rendering_buffer.strokeWeight(0.8)
            } else {
                rendering_buffer.fill(p.r, p.g, p.b)
                rendering_buffer.noStroke()
            }
            draw_petal(p.length, p.width, p.ruffle_amt, p.ruffle_phase, p.shape_fn)
            rendering_buffer.pop()
        }

        if (p.type === 'leaf') {
            rendering_buffer.push()
            if (render_mode === RENDER_MODE.WIREFRAME) {
                rendering_buffer.noFill()
                rendering_buffer.stroke(p.r, p.g, p.b)
                rendering_buffer.strokeWeight(0.8)
            } else {
                rendering_buffer.fill(p.r, p.g, p.b)
                rendering_buffer.noStroke()
            }
            rendering_buffer.beginShape()
            rendering_buffer.vertex(p.base.x, p.base.y)
            rendering_buffer.vertex(p.top.x,  p.top.y)
            rendering_buffer.vertex(p.tip.x,  p.tip.y)
            rendering_buffer.vertex(p.bot.x,  p.bot.y)
            rendering_buffer.endShape(CLOSE)
            rendering_buffer.pop()
            continue
        }

        if (p.type === 'thorn') {
            rendering_buffer.stroke(p.r, p.g, p.b)
            rendering_buffer.strokeWeight(1.5)
            rendering_buffer.line(p.base.x, p.base.y, p.tip.x, p.tip.y)
            rendering_buffer.noStroke()
            continue
        }
    }
}

function define_petal_layer(petal_arr, num_petals, length, width, tilt, layer_offset, R, G, B, config) {
    for (let i = 0; i < num_petals; i++) {
        let base_angle = (TWO_PI / num_petals) * i + layer_offset
        let angle      = base_angle + rotY
        let dist       = length * (config.dist_factor || 0.4)

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
            type:         'petal',
            x2:           x3 * scale,
            y2:           y4 * scale,
            z:            z4,
            angle,
            length:       length * scale,
            width:        width  * scale,
            r:            constrain(R * light, 0, 255),
            g:            constrain(G * light, 0, 255),
            b:            constrain(B * light, 0, 255),
            tilt,
            viewAngle:    atan2(y4, x3),
            ruffle_amt:   config.ruffle_amt,
            ruffle_phase: i * 1.7,
            shape_fn:     config.petal_shape
        })
    }
}

function draw_petal(length, width, ruffle_amt, ruffle_phase, shape_fn) {
    rendering_buffer.beginShape()
    for (let tt = 0; tt <= 1; tt += 0.05) {
        let x      = tt * length
        let ruffle = ruffle_amt > 0 ? sin(tt * 8 + ruffle_phase) * ruffle_amt * tt : 0
        let y      = shape_fn ? shape_fn(tt, length, width) + ruffle : sin(tt * PI) * width + ruffle
        rendering_buffer.vertex(x, y)
    }
    for (let tt = 1; tt >= 0; tt -= 0.05) {
        let x      = tt * length
        let ruffle = ruffle_amt > 0 ? sin(tt * 8 + ruffle_phase + PI) * ruffle_amt * tt : 0
        let y      = shape_fn ? -(shape_fn(tt, length, width) + ruffle) : -(sin(tt * PI) * width + ruffle)
        rendering_buffer.vertex(x, y)
    }
    rendering_buffer.endShape(CLOSE)
}

function define_stem(all_petals, flower_scale, config, stem_bloom) {
    let sides    = config.stem_sides
    let segments = config.stem_segments
    let radius   = config.stem_radius * flower_scale
    let stem_len = config.stem_len    * flower_scale
    let sc       = config.stem_color

    for (let seg = 0; seg < segments; seg++) {
        let t0 = seg       / segments
        let t1 = (seg + 1) / segments

        if (t0 > stem_bloom) continue
        let y0 = t0 * stem_len
        let y1 = min(t1, stem_bloom) * stem_len

        let cx0 = sin(t0 * PI * config.stem_curve_freq) * config.stem_curve_amp * flower_scale +
                  sin(t0 * PI * 0.8) * 6 * flower_scale
        let cx1 = sin(t1 * PI * config.stem_curve_freq) * config.stem_curve_amp * flower_scale +
                  sin(t1 * PI * 0.8) * 6 * flower_scale

        let r0 = lerp(radius * config.stem_taper, radius, t0)
        let r1 = lerp(radius * config.stem_taper, radius, t1)

        for (let s = 0; s < sides; s++) {
            let a0 = (TWO_PI / sides) * s
            let a1 = (TWO_PI / sides) * (s + 1)

            let p00 = project_stem_point(cx0 + cos(a0)*r0, y0, sin(a0)*r0)
            let p10 = project_stem_point(cx0 + cos(a1)*r0, y0, sin(a1)*r0)
            let p01 = project_stem_point(cx1 + cos(a0)*r1, y1, sin(a0)*r1)
            let p11 = project_stem_point(cx1 + cos(a1)*r1, y1, sin(a1)*r1)

            let midA     = (a0 + a1) / 2
            let nx       = cos(midA)
            let ny       = 0
            let nz       = sin(midA)
            let nx_y     = nx * cos(rotY) + nz * sin(rotY)
            let nz_y     = -nx * sin(rotY) + nz * cos(rotY)
            let ny_final = ny * cos(rotX) - nz_y * sin(rotX)
            let nz_final = ny * sin(rotX) + nz_y * cos(rotX)

            if (nz_final > 0) continue

            let light = calculate_lighting(nx_y, ny_final, nz_final)
            let midT  = (t0 + t1) / 2
            let shade = lerp(1, 0.5, midT)

            all_petals.push({
                type: 'quad',
                p00, p10, p01, p11,
                z:    (p00.z + p10.z + p01.z + p11.z) / 4,
                r:    constrain(sc[0] * light * shade, 0, 255),
                g:    constrain(sc[1] * light * shade, 0, 255),
                b:    constrain(sc[2] * light * shade, 0, 255)
            })
        }
    }
}

function project_stem_point(x3, y3, z3) {
    let rx  = x3 * cos(rotY) + z3 * sin(rotY)
    let rz  = -x3 * sin(rotY) + z3 * cos(rotY)
    let ry4 = y3 * cos(rotX) - rz * sin(rotX)
    let rz4 = y3 * sin(rotX) + rz * cos(rotX)
    let s   = focal / (focal + rz4)
    return { x: rx * s, y: ry4 * s, z: rz4 }
}

function define_leaves(all_petals, flower_scale, config, stem_growth) {
    if (!config.stem_leaves || config.stem_leaves.length === 0) return

    let stem_len = config.stem_len * flower_scale

    for (let leaf of config.stem_leaves) {
        if (stem_growth < leaf.t) continue  // leaf hasn't grown yet

        let t       = leaf.t
        let side    = leaf.side
        let sz      = leaf.size * 55 * flower_scale

        // position along stem
        let cx = sin(t * PI * config.stem_curve_freq) * config.stem_curve_amp * flower_scale +
                 sin(t * PI * 0.8) * 6 * flower_scale
        let y3 = t * stem_len

        // leaf grows in with stem
        let leaf_bloom = constrain((stem_growth - leaf.t) / 0.2, 0, 1)
        let leaf_sz    = sz * leaf_bloom

        if (leaf_sz < 1) continue

        // project base position
        let base = project_stem_point(cx, y3, 0)

        // leaf is a flat shape — 3 projected points
        let tip  = project_stem_point(cx + side * leaf_sz * 1.4, y3 - leaf_sz * 0.3, 0)
        let top  = project_stem_point(cx + side * leaf_sz * 0.6, y3 - leaf_sz * 0.5, 0)
        let bot  = project_stem_point(cx + side * leaf_sz * 0.6, y3 + leaf_sz * 0.3, 0)

        // leaf normal points toward camera
        let nx = side
        let ny = -0.3
        let nz = -0.8
        let n_mag = sqrt(nx*nx + ny*ny + nz*nz)
        nx /= n_mag; ny /= n_mag; nz /= n_mag

        let nx_y     = nx * cos(rotY) + nz * sin(rotY)
        let nz_y     = -nx * sin(rotY) + nz * cos(rotY)
        let ny_final = ny * cos(rotX) - nz_y * sin(rotX)
        let nz_final = ny * sin(rotX) + nz_y * cos(rotX)

        let light = calculate_lighting(nx_y, ny_final, nz_final)
        let lc    = config.stem_leaf_color || [45, 95, 35]

        all_petals.push({
            type: 'leaf',
            base, tip, top, bot,
            z:    (base.z + tip.z) / 2,
            r:    constrain(lc[0] * light, 0, 255),
            g:    constrain(lc[1] * light, 0, 255),
            b:    constrain(lc[2] * light, 0, 255)
        })
    }
}

function define_thorns(all_petals, flower_scale, config, stem_growth) {
    if (!config.stem_thorns || config.stem_thorns.length === 0) return

    let stem_len = config.stem_len * flower_scale

    for (let zone of config.stem_thorns) {
        let steps = floor((zone.t_end - zone.t_start) / 0.04)

        for (let i = 0; i < steps; i++) {
            if (random() > zone.density) continue

            let t  = zone.t_start + (i / steps) * (zone.t_end - zone.t_start)
            if (t > stem_growth) continue

            let y3 = t * stem_len
            let cx = sin(t * PI * config.stem_curve_freq) * config.stem_curve_amp * flower_scale +
                     sin(t * PI * 0.8) * 6 * flower_scale

            let angle  = random(TWO_PI)
            let radius = config.stem_radius * flower_scale
            let thorn_len = random(6, 14) * flower_scale

            // base of thorn on stem surface
            let bx = cx + cos(angle) * radius
            let bz = sin(angle) * radius

            // tip points outward and slightly upward
            let tx = bx + cos(angle) * thorn_len
            let ty = y3 - thorn_len * 0.4
            let tz = bz + sin(angle) * thorn_len

            let base = project_stem_point(bx, y3, bz)
            let tip  = project_stem_point(tx, ty, tz)

            // check if facing camera
            let nx_y     = cos(angle) * cos(rotY) + sin(angle) * sin(rotY)
            let nz_y     = -cos(angle) * sin(rotY) + sin(angle) * cos(rotY)
            let ny_final = 0
            let nz_final = 0 * sin(rotX) + nz_y * cos(rotX)

            if (nz_final > 0) continue

            all_petals.push({
                type: 'thorn',
                base, tip,
                z:    (base.z + tip.z) / 2,
                r:    45, g: 70, b: 30
            })
        }
    }
}