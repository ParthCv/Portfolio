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

function calibrachoa_petal_shape(tt, length, width) {
    // wide at base, narrows toward tip, slight flare at very end
    let base_width = sin(tt * PI * 0.7) * width * 1.3
    let flare      = tt > 0.8 ? (tt - 0.8) * 5 * width * 0.3 : 0
    return base_width + flare
}

const CALIBRACHOA_CONFIG = {
    total_layers:     4,
    petals_per_layer: { min: 5, max: 5 },  // always 5 petals

    len: { min: 60,  max: 90  },
    wid: { min: 25,  max: 38  },

    tilt:          { inner: 1.2, outer: 0.4 },
    ruffle_amt:    3,
    petal_shape:   calibrachoa_petal_shape,
    layer_stagger: 0.63,  // TWO_PI/5 * 0.5 so petals interleave
    dist_factor:   0.25,

    center_type:        'disc',
    center_bloom_start: 0.4,
    disc_radius:        18,
    disc_height:        6,
    disc_rings:         4,
    disc_segments:      16,
    disc_color:         [255, 240, 100],
    disc_edge_color:    [200, 160, 40],
    disc_offset:        0,

    center_layers:    0,
    center_len:       { min: 0, max: 0 },
    center_wid:       { min: 0, max: 0 },
    center_tilt:      { inner: 0, outer: 0 },
    center_dot_size:  0,
    center_dot_color: [0, 0, 0],
    center_color:     { inner: [0,0,0], outer: [0,0,0] },

    // hot pink
    petal_color:  { inner: [220, 30, 120], outer: [255, 80, 160] },
    petal_gradient: null,

    stem_len:        180,
    stem_radius:     6,
    stem_color:      [55, 85, 40],
    stem_sides:      6,
    stem_segments:   30,
    stem_curve_amp:  20,
    stem_curve_freq: 0.4,
    stem_taper:      0.5,

    stem_leaf_color: [50, 90, 35],
    stem_leaves: [
        { t: 0.3, side:  1, size: 0.6 },
        { t: 0.6, side: -1, size: 0.55 },
    ],
    stem_thorns: [],

    bloom_speed:  0.003,
    bloom_delay:  0.15,
}

function pericallis_petal_shape(tt, length, width) {
    // wide oval with notch at tip
    let base   = pow(sin(tt * PI), 0.75) * width
    let notch  = tt > 0.88 ? pow((tt - 0.88) / 0.12, 2) * width * 0.4 : 0
    return base - notch
}

const PERICALLIS_CONFIG = {
    total_layers:     3,
    petals_per_layer: { min: 18, max: 22 },

    len: { min: 90,  max: 120 },
    wid: { min: 14,  max: 20  },

    tilt:          { inner: 0.2, outer: 0.04 },
    ruffle_amt:    0,
    petal_shape:   pericallis_petal_shape,
    layer_stagger: 0.18,
    dist_factor:   0.22,

    center_type:        'disc',
    center_bloom_start: 0.3,
    disc_radius:        30,
    disc_height:        6,
    disc_rings:         6,
    disc_segments:      20,
    disc_color:         [255, 220, 60],
    disc_edge_color:    [180, 140, 20],
    disc_offset:        0,

    center_layers:    0,
    center_len:       { min: 0, max: 0 },
    center_wid:       { min: 0, max: 0 },
    center_tilt:      { inner: 0, outer: 0 },
    center_dot_size:  0,
    center_dot_color: [0, 0, 0],
    center_color:     { inner: [0,0,0], outer: [0,0,0] },

    // purple/white bicolor — inner petals white, outer purple
    petal_color:  { inner: [220, 220, 255], outer: [100, 40, 200] },
    petal_gradient: null,

    stem_len:        220,
    stem_radius:     7,
    stem_color:      [55, 85, 40],
    stem_sides:      6,
    stem_segments:   30,
    stem_curve_amp:  14,
    stem_curve_freq: 0.3,
    stem_taper:      0.6,

    stem_leaf_color: [50, 90, 35],
    stem_leaves: [
        { t: 0.25, side:  1, size: 0.8 },
        { t: 0.55, side: -1, size: 0.7 },
    ],
    stem_thorns: [],

    bloom_speed:  0.003,
    bloom_delay:  0.1,
}

function hibiscus_petal_shape(tt, length, width) {
    // broad fan shape — wide in middle, tapers at both ends
    // slight waviness near the tip
    let base  = pow(sin(tt * PI), 0.65) * width
    let wave  = tt > 0.5 ? sin(tt * 12) * width * 0.04 : 0
    return base + wave
}

const HIBISCUS_CONFIG = {
    // 5 large petals, single layer
    total_layers:     3,
    petals_per_layer: { min: 5, max: 5 },

    len: { min: 120, max: 180 },
    wid: { min: 55,  max: 75  },

    tilt:          { inner: 0.5, outer: 0.15 },
    ruffle_amt:    4,
    petal_shape:   hibiscus_petal_shape,
    layer_stagger: 0.63,  // TWO_PI/5 * 0.5
    dist_factor:   0.18,

    // no petal center layers — stamen handles it
    center_type:        'disc',
    center_bloom_start: 0.3,
    disc_radius:        12,
    disc_height:        4,
    disc_rings:         3,
    disc_segments:      12,
    disc_color:         [180, 20, 60],
    disc_edge_color:    [140, 10, 40],
    disc_offset:        0,

    center_layers:    0,
    center_len:       { min: 0, max: 0 },
    center_wid:       { min: 0, max: 0 },
    center_tilt:      { inner: 0, outer: 0 },
    center_dot_size:  0,
    center_dot_color: [0, 0, 0],
    center_color:     { inner: [0,0,0], outer: [0,0,0] },

    // stamen column
    stamen: {
        length:    90,
        radius:    4,
        color:     [200, 30, 80],
        tip_color: [255, 220, 50],
    },

    // classic red hibiscus
    petal_color:  { inner: [180, 10, 40], outer: [240, 60, 80] },
    petal_gradient: null,

    stem_len:        280,
    stem_radius:     12,
    stem_color:      [50, 85, 38],
    stem_sides:      8,
    stem_segments:   40,
    stem_curve_amp:  14,
    stem_curve_freq: 0.28,
    stem_taper:      0.7,

    stem_leaf_color: [45, 90, 32],
    stem_leaves: [
        { t: 0.25, side:  1, size: 1.1 },
        { t: 0.50, side: -1, size: 0.95 },
        { t: 0.38, side:  1, size: 0.8  },
    ],
    stem_thorns: [],

    bloom_speed:  0.0025,
    bloom_delay:  0.2,
}

function lily_petal_shape(tt, length, width) {
    let base   = pow(sin(tt * PI), 0.75) * width
    let reflex = tt > 0.75 ? (tt - 0.75) / 0.25 * width * 0.18 : 0
    return base - reflex
}

const LILY_CONFIG = {
    // two alternating whorls of 3 = 6 petals total
    total_layers:     2,
    petals_per_layer: { min: 3, max: 3 },

    len: { min: 150, max: 190 },
    wid: { min: 40,  max: 50  },

    tilt:          { inner: 0.4, outer: 0.2 },
    ruffle_amt:    1,
    petal_shape:   lily_petal_shape,
    layer_stagger: Math.PI / 3,  // 60 degrees so whorls alternate
    dist_factor:   0.15,

    center_type:        'disc',
    center_bloom_start: 0.35,
    disc_radius:        10,
    disc_height:        3,
    disc_rings:         2,
    disc_segments:      10,
    disc_color:         [255, 240, 200],
    disc_edge_color:    [220, 200, 150],
    disc_offset:        0,

    center_layers:    0,
    center_len:       { min: 0, max: 0 },
    center_wid:       { min: 0, max: 0 },
    center_tilt:      { inner: 0, outer: 0 },
    center_dot_size:  0,
    center_dot_color: [0, 0, 0],
    center_color:     { inner: [0,0,0], outer: [0,0,0] },

    // 6 individual filament stamens
    stamen: {
        type:      'filaments',
        count:     6,
        length:    70,
        spread:    18,
        radius:    1.5,
        color:     [200, 180, 120],
        tip_color: [60, 30, 5],    // dark brown anthers
        tip_size:  7,
    },

    // classic orange tiger lily
    petal_color:  { inner: [210, 70, 10], outer: [255, 120, 30] },
    petal_gradient: null,

    stem_len:        300,
    stem_radius:     10,
    stem_color:      [50, 85, 38],
    stem_sides:      8,
    stem_segments:   40,
    stem_curve_amp:  10,
    stem_curve_freq: 0.25,
    stem_taper:      0.75,

    stem_leaf_color: [45, 90, 32],
    stem_leaves: [
        { t: 0.2,  side:  1, size: 0.65 },
        { t: 0.4,  side: -1, size: 0.75 },
        { t: 0.6,  side:  1, size: 0.6  },
    ],
    stem_thorns: [],

    bloom_speed:  0.02,
    bloom_delay:  0.2,
}