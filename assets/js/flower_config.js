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
    center_type:   'petal',
    disc_offset: 0,
    dist_factor: 0.4,
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
    petal_gradient: null,
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
    stem_leaf_color: [45, 95, 35],
    stem_leaves: [
        { t: 0.25, side:  1, size: 1.0 },
        { t: 0.50, side: -1, size: 0.85 },
        { t: 0.35, side:  1, size: 0.7  },
    ],
    stem_thorns: [],

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
    center_type:   'petal',
    layer_stagger: 0.4,
    disc_offset: 0,
    dist_factor: 0.4,
    center_layers:       3,
    center_len:          { min: 20, max: 45 },
    center_wid:          { min: 10, max: 22 },
    center_tilt:         { inner: 1.2, outer: 0.8 },
    center_bloom_start:  0.45,
    center_dot_size:     22,
    center_dot_color:    [255, 220, 50],

    // colors — blue lotus
    petal_color:  { inner: [80, 100, 220],  outer: [180, 200, 255] },
    petal_gradient: null,
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
    stem_leaf_color: [40, 80, 50],
    stem_leaves: [],
    stem_thorns: [],
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
    center_type:   'petal',
    disc_offset: 0,
    layer_stagger: 1.2,
    dist_factor: 0.4,
    center_layers:       6,
    center_len:          { min: 20, max: 45 },
    center_wid:          { min: 12, max: 25 },
    center_tilt:         { inner: 1.6, outer: 1.2 },
    center_bloom_start:  0.55,
    center_dot_size:     8,
    center_dot_color:    [180, 30, 60],

    // colors — classic red rose
    petal_color:  { inner: [180, 20, 40],  outer: [220, 60, 80] },
    petal_gradient: null,
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
    stem_leaf_color: [40, 80, 30],
    stem_leaves: [
        { t: 0.3, side:  1, size: 0.9 },
        { t: 0.55, side: -1, size: 0.8 },
    ],
    stem_thorns: [
        { t_start: 0.1, t_end: 0.9, density: 0.35 }
    ],

    // bloom
    bloom_speed:  0.002,
    bloom_delay:  0.35,  // more stagger for rose unfurling effect
}

function gerbera_petal_shape(tt, length, width) {
    return pow(sin(tt * PI), 0.8) * width  // rounder, no notch
}

const GERBERA_CONFIG = {
    // single dense layer of long thin petals
    total_layers:     3,
    petals_per_layer: { min: 28, max: 34 },

    len: { min: 160, max: 200 },
    wid: { min: 12,   max: 18  },

    // nearly flat — gerbera is a flat flower
    tilt:          { inner: 0.15, outer: 0.02 },
    ruffle_amt:    0,
    petal_shape:   gerbera_petal_shape,
    layer_stagger: 0.15,  // slight stagger between rows

    // disc center
    center_type:        'disc',
    center_bloom_start: 0.3,
    disc_radius:        65,
    disc_height:        8,
    disc_rings:         8,
    dist_factor: 0.2,
    disc_offset: -15,
    disc_segments:      24,
    disc_color:         [180, 120, 20],   // golden yellow center
    disc_edge_color:    [100, 60,  10],   // darker edge

    // unused for disc type but needed to avoid errors
    center_layers:    0,
    center_len:       { min: 0, max: 0 },
    center_wid:       { min: 0, max: 0 },
    center_tilt:      { inner: 0, outer: 0 },
    center_dot_size:  0,
    center_dot_color: [0, 0, 0],
    center_color:     { inner: [0,0,0], outer: [0,0,0] },

    // colors — classic orange gerbera
    petal_color:  { inner: [255, 100, 20], outer: [255, 140, 40] },
    petal_gradient: null,

    // stem — straight and tall
    stem_len:        320,
    stem_radius:     14,
    stem_color:      [50, 85, 40],
    stem_sides:      8,
    stem_segments:   40,
    stem_curve_amp:  6,
    stem_curve_freq: 0.2,
    stem_taper:      0.8,
    stem_leaf_color: [50, 90, 35],
    stem_leaves: [
        { t: 0.3, side:  1, size: 1.1 },
        { t: 0.6, side: -1, size: 0.9 },
    ],
    stem_thorns: [],

    bloom_speed:  0.003,
    bloom_delay:  0.1,  // all petals open at once, barely staggered
}

const MARIGOLD_CONFIG = {
    total_layers:     20,
    petals_per_layer: { min: 8, max: 14 },

    len: { min: 40, max: 100 },
    wid: { min: 18, max: 35  },

    tilt:          { inner: 1.4, outer: 0.3 },
    ruffle_amt:    12,
    petal_shape:   null,
    layer_stagger: 0.5,
    dist_factor:   0.3,

    petal_gradient: [
        { pos: 0.0, color: [220, 80,  10] },
        { pos: 0.4, color: [255, 140, 20] },
        { pos: 1.0, color: [255, 200, 40] },
    ],

    center_type:        'petal',
    center_layers:       4,
    center_len:          { min: 10, max: 25 },
    center_wid:          { min: 8,  max: 15 },
    center_tilt:         { inner: 1.5, outer: 1.2 },
    center_bloom_start:  0.4,
    center_dot_size:     10,
    center_dot_color:    [255, 160, 0],
    center_color:        { inner: [200, 60, 5], outer: [240, 100, 15] },

    petal_color: { inner: [220, 80, 10], outer: [255, 200, 40] },

    stem_len:        260,
    stem_radius:     14,
    stem_color:      [50, 85, 40],
    stem_sides:      8,
    stem_segments:   40,
    stem_curve_amp:  10,
    stem_curve_freq: 0.3,
    stem_taper:      0.7,
    stem_leaf_color: [50, 90, 35],
    stem_leaves: [
        { t: 0.3, side:  1, size: 1.1 },
        { t: 0.6, side: -1, size: 0.9 },
    ],
    stem_thorns: [],

    bloom_speed:  0.003,
    bloom_delay:  0.2,
}

const SUNFLOWER_CONFIG = {
    total_layers:     2,
    petals_per_layer: { min: 26, max: 32 },

    len: { min: 180, max: 220 },
    wid: { min: 18,  max: 24  },

    tilt:          { inner: 0.1, outer: 0.02 },
    ruffle_amt:    0,
    petal_shape:   null,
    layer_stagger: 0.2,
    dist_factor:   0.35,  // was 0.25, petals start further out to clear disc

    petal_gradient: [
        { pos: 0.0, color: [200, 120, 0]  },
        { pos: 0.3, color: [255, 180, 0]  },
        { pos: 1.0, color: [255, 220, 40] },
    ],

    center_type:        'disc',
    center_bloom_start: 0.2,
    disc_radius:        110,  // was 75, much bigger
    disc_height:        14,
    disc_rings:         12,   // more rings for smoother disc
    disc_segments:      40,   // more segments too
    disc_color:         [60,  35, 10],
    disc_edge_color:    [100, 60, 15],
    disc_offset:        -5,

    center_layers:    0,
    center_len:       { min: 0, max: 0 },
    center_wid:       { min: 0, max: 0 },
    center_tilt:      { inner: 0, outer: 0 },
    center_dot_size:  0,
    center_dot_color: [0, 0, 0],
    center_color:     { inner: [0,0,0], outer: [0,0,0] },

    petal_color: { inner: [200, 120, 0], outer: [255, 220, 40] },

    stem_len:        380,
    stem_radius:     20,
    stem_color:      [55, 90, 35],
    stem_sides:      8,
    stem_segments:   40,
    stem_curve_amp:  8,
    stem_curve_freq: 0.2,
    stem_taper:      0.75,
    stem_leaf_color: [50, 90, 35],
    stem_leaves: [
        { t: 0.3, side:  1, size: 1.1 },
        { t: 0.6, side: -1, size: 0.9 },
    ],
    stem_thorns: [],

    bloom_speed:  0.003,
    bloom_delay:  0.05,
}