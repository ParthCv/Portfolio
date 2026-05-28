const RENDER_MODE = Object.freeze({
    DEFAULT:   0,
    ASCII:     1,
    DOTS:      2,
    SQUARES:   3,
    CROSSES:   4,
    RINGS:     5,
    TRIANGLES: 6,
    HATCHING:  7,
    WIREFRAME: 8,
})

const ASCII_CHARS = ' .,;:~!+*/WM&A%#@'.split('')  // sparse to dense
const ASCII_CHARS_JP = 'ｦｧｨｩｪｫｶｷｸｹｺｻｼｽ@#%&*+:. '.split('')