function calculate_lighting(nx, ny, nz) {
    // view vector
    let vx = 0
    let vy = -sin(rotX)
    let vz = -cos(rotX)
    
    let light_angle = frameCount * 0.01

    // light direction
    let lx = sin(light_angle)
    let ly = 0.8
    let lz = cos(light_angle)
    let l_mag = sqrt(lx*lx + ly*ly + lz*lz)
    lx /= l_mag
    ly /= l_mag
    lz /= l_mag

    // half vector
    let hx = lx + vx
    let hy = ly + vy
    let hz = lz + vz
    let h_mag = sqrt(hx*hx + hy*hy + hz*hz)
    
    hx /= h_mag
    hy /= h_mag
    hz /= h_mag

    let ndotl = nx*(-lx) + ny*(-ly) + nz*(-lz)
    let ndoth = nx*hx + ny*hy + nz*hz
    let ndotv = nx*vx + ny*vy + nz*vz

    // light - ambient light
    let ambient = 0.7

    // light - diffuse
    let diffuse = ndotl
    
    // light - specular
    let spec = 0
    if (diffuse > 0) {
        spec = pow(max(0, ndoth), 32)
    }

    // light - rim lighting
    let rim = 0
    if (diffuse < 0.2) {
        rim = pow(1.0 - abs(ndotv), 3)
    }

    let final_lighting = ambient + (0.5 * max(0, diffuse) + 0.5 * spec) + 0.4 * rim
    return final_lighting
}