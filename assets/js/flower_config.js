const FLOWER_CONFIG = {
    // layers
    total_layers: 14,
    petals_per_layer: { min: 6, max: 12 },

    // petal size
    len: { min: 60,  max: 200 },
    wid: { min: 20,  max: 65  },

    // shape
    tilt: { inner: 1.3, outer: 0.1 },
    ruffle_amt: 8,
    petal_shape: null,

    // center
    layer_stagger: 0.4,
    center_layers: 5,
    center_len: { min: 15, max: 35 },
    center_wid: { min: 8,  max: 18 },
    center_tilt: { inner: 1.5, outer: 1.1 },
    center_bloom_start: 0.5,
    center_dot_size: 12,
    center_dot_color: [100, 60, 180],

    // colors
    petal_color: { inner: [150, 130, 255], outer: [200, 190, 255] },
    center_color: { inner: [120, 80, 200],  outer: [150, 110, 240] },

    // stem — now fully configurable
    stem_len: 220,
    stem_radius: 8,
    stem_color: [55, 90, 40],
    stem_sides: 8,
    stem_segments: 40,
    stem_curve_amp: 18,
    stem_curve_freq: 0.3,
    stem_taper: 0.6,

    // bloom
    bloom_speed: 0.0025,
    bloom_delay: 0.3,
}

function lotus_petal_shape(tt, length, width) {
    // more pointed tip than sine
    return pow(sin(tt * PI), 0.6) * width
}

const LOTUS_CONFIG = {
    // layers — fewer than peony, more open
    total_layers:    11,
    petals_per_layer: { min: 5, max: 9 },

    // petal size — longer and narrower
    len: { min: 80,  max: 240 },
    wid: { min: 12,  max: 40  },

    // shape — flatter dome, smooth petals
    tilt:        { inner: 0.9, outer: 0.05 },
    ruffle_amt:  0,
    petal_shape: lotus_petal_shape,

    // center — prominent seed pod
    layer_stagger: 0.4,
    center_layers:       3,
    center_len:          { min: 20, max: 45 },
    center_wid:          { min: 10, max: 22 },
    center_tilt:         { inner: 1.2, outer: 0.8 },
    center_bloom_start:  0.45,
    center_dot_size:     22,
    center_dot_color:    [255, 220, 50],

    // colors — blue lotus
    petal_color:  { inner: [80, 100, 220],  outer: [180, 200, 255] },
    center_color: { inner: [60, 80, 200],   outer: [130, 155, 255] },

    // stem — straight and tall
    stem_len:        350,
    stem_radius:     8,
    stem_color:      [40, 80, 50],
    stem_sides:      8,
    stem_segments:   40,
    stem_curve_amp:  4,
    stem_curve_freq: 0.2,
    stem_taper:      0.85,

    // bloom
    bloom_speed:  0.002,
    bloom_delay:  0.25,
}

function rose_petal_shape(tt, length, width) {
    // asymmetric — wider toward base, pointed tip
    // using a skewed sine that peaks earlier than middle
    return pow(sin(tt * PI * 0.9), 0.7) * width * (1 - tt * 0.3)
}

const ROSE_CONFIG = {
    // layers — medium density, tight spiral
    total_layers:     16,
    petals_per_layer: { min: 4, max: 5 },

    // petal size — medium, more uniform across layers
    len: { min: 40,  max: 100 },
    wid: { min: 15,  max: 32  },

    // shape — very cupped inner, flat outer
    tilt:        { inner: 1.5, outer: 0.7 },
    ruffle_amt:  2,  // slight ruffle on edges
    petal_shape: rose_petal_shape,

    // center — tight closed bud center
    layer_stagger: 1.2,
    center_layers:       6,
    center_len:          { min: 20, max: 45 },
    center_wid:          { min: 12, max: 25 },
    center_tilt:         { inner: 1.6, outer: 1.2 },
    center_bloom_start:  0.55,
    center_dot_size:     8,
    center_dot_color:    [180, 30, 60],

    // colors — classic red rose
    petal_color:  { inner: [180, 20, 40],  outer: [220, 60, 80] },
    center_color: { inner: [140, 10, 30],  outer: [170, 30, 55] },

    // stem — rose stem with slight curve
    stem_len:        300,
    stem_radius:     10,
    stem_color:      [45, 75, 35],
    stem_sides:      8,
    stem_segments:   40,
    stem_curve_amp:  12,
    stem_curve_freq: 0.25,
    stem_taper:      0.65,

    // bloom
    bloom_speed:  0.002,
    bloom_delay:  0.35,  // more stagger for rose unfurling effect
}