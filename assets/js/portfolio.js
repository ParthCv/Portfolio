const PORTFOLIO_MODES = {
  organic: {
    flowers:       ['peony', 'lotus', 'lily'],
    renders:       [0],           // DEFAULT only — clean no effects
    rotation:      0.008,
    canvas_bg:     [242, 237, 228],
    effects:       { scanlines: false, aberration: false, glitch: false, grain: false, bloom: true }
  },
  digital: {
    flowers:       ['gerbera', 'sunflower', 'pericallis'],
    renders:       [2, 1, 5],     // cycles: DOTS → ASCII → RINGS
    rotation:      0.009,
    canvas_bg:     [4, 5, 15],
    effects:       { scanlines: false, aberration: true, glitch: true, grain: true, bloom: false }
  },
  wire: {
    flowers:       ['rose', 'hibiscus', 'calibrachoa'],
    renders:       [8],           // WIREFRAME only
    rotation:      0.0011,
    canvas_bg:     [0, 0, 0],
    effects:       { scanlines: true, aberration: false, glitch: false, grain: false, bloom: false }
  }
}

const FLOWER_INTERVAL   = 28000  // ms between flower switches
const WILT_DURATION     = 3500   // ms for wilt animation
let   current_mode      = 'digital'
let   current_section   = 'home'
let   cycle_timer       = null
let   is_wilting        = false
let   render_cycle_idx  = 0      // which render mode in digital cycle

window._portfolio_mode = true
const canvasEl = document.getElementById('canvas-container')

function showSection(target) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'))
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'))

  const section = document.getElementById(target)
  if (section) section.classList.add('active')

  const link = document.querySelector(`.nav-link[data-target="${target}"]`)
  if (link) link.classList.add('active')

  current_section = target

  // Shift flower right on home, center on inner pages
  updateFlowerOffset()
}

function updateFlowerOffset() {
  if (current_section === 'home' && window.innerWidth > 768) {
    canvasEl.style.transform = 'translateX(22vw)'
  } else {
    canvasEl.style.transform = 'none'
  }
}

window.addEventListener('resize', updateFlowerOffset)

// Nav buttons
document.querySelectorAll('.nav-link').forEach(btn => {
  btn.addEventListener('click', e => { e.preventDefault(); showSection(btn.dataset.target) })
})

// Home action buttons
document.querySelectorAll('[data-target]').forEach(el => {
  if (el.classList.contains('nav-link') || el.tagName === 'A') return
  el.addEventListener('click', () => { if (el.dataset.target) showSection(el.dataset.target) })
})

document.querySelectorAll('.f-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    const filter = btn.dataset.filter
    document.querySelectorAll('.proj-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && !card.dataset.cat.includes(filter))
    })
  })
})

function cycleFlower() {
  if (is_wilting) return
  is_wilting = true

  const start  = performance.now()
  const cfg    = PORTFOLIO_MODES[current_mode]

  function wiltStep(now) {
    const progress = Math.min(1, (now - start) / WILT_DURATION)
    if (typeof wilt !== 'undefined') wilt = progress

    if (progress < 1) {
      requestAnimationFrame(wiltStep)
    } else {
      // Switch flower
      const modeFlowers = cfg.flowers
      const curIdx      = modeFlowers.indexOf(
        typeof FLOWER_LIST !== 'undefined' ? FLOWER_LIST[flower_index] : ''
      )
      const nextName = modeFlowers[(curIdx + 1) % modeFlowers.length]
      switchToFlower(nextName)

      // In digital mode, cycle render mode
      if (current_mode === 'digital' && typeof render_mode !== 'undefined') {
        render_cycle_idx = (render_cycle_idx + 1) % cfg.renders.length
        render_mode = cfg.renders[render_cycle_idx]
      }

      // Reset wilt
      if (typeof wilt !== 'undefined') wilt = 0
      is_wilting = false
    }
  }

  requestAnimationFrame(wiltStep)
}

function switchToFlower(name) {
  if (typeof FLOWER_LIST === 'undefined') return
  const idx = FLOWER_LIST.indexOf(name)
  if (idx === -1) return
  flower_index = idx
  bloom        = 0
  wilt         = 0
  is_wilting   = false
  if (typeof thorns_generated !== 'undefined') {
    thorns_generated = false
    cached_thorns    = []
  }
}

function applyMode(mode) {
  document.documentElement.dataset.mode = mode
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode)
  })
  current_mode = mode
  render_cycle_idx = 0

  if (typeof wilt !== 'undefined') wilt = 0
  is_wilting = false
  applyFlowerMode(mode)

  // Restart cycle timer
  if (cycle_timer) clearInterval(cycle_timer)
  cycle_timer = setInterval(cycleFlower, FLOWER_INTERVAL)
}

function applyFlowerMode(mode) {
  if (typeof FLOWER_LIST === 'undefined') return
  const cfg = PORTFOLIO_MODES[mode]

  // Render mode
  if (typeof render_mode !== 'undefined') render_mode = cfg.renders[0]

  // Rotation speed
  window._portfolio_rot = cfg.rotation

  // Canvas background color
  if (typeof canvas_bg_color !== 'undefined') canvas_bg_color = cfg.canvas_bg

  // Switch to first flower
  switchToFlower(cfg.flowers[0])

  // Effects
  if (typeof POST_FX !== 'undefined') {
    POST_FX.aberration.on = cfg.effects.aberration
    POST_FX.glitch.on     = cfg.effects.glitch
    POST_FX.grain.on      = cfg.effects.grain
    POST_FX.scanlines.on  = cfg.effects.scanlines
    POST_FX.bloom.on      = cfg.effects.bloom
  }
}

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => applyMode(btn.dataset.mode))
})

showSection('home')
applyMode('digital')