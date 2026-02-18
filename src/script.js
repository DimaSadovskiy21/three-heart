import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('textures/particles/10.png')

/**
 * Particles
 */
// Geometry
const heartGeometry = new THREE.BufferGeometry()

const count = 30000
const positions = new Float32Array(count * 3)

let i = 0

while (i < count) {

    const x = (Math.random() - 0.5) * 3
    const y = (Math.random() - 0.5) * 3
    const z = (Math.random() - 0.5) * 3

    const formula =
        Math.pow(x*x + 9/4*z*z + y*y - 1, 3)
        - x*x * Math.pow(y, 3)
        - 9/80 * z*z * Math.pow(y, 3)

    if (formula <= 0) {
        const i3 = i * 3
        positions[i3] = x
        positions[i3 + 1] = y
        positions[i3 + 2] = z
        i++
    }
}

heartGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.02
particlesMaterial.sizeAttenuation = true
particlesMaterial.color = new THREE.Color('#ff88cc')
particlesMaterial.alphaMap = particleTexture
particlesMaterial.transparent = true
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending

// Points
const particles = new THREE.Points(heartGeometry, particlesMaterial);
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    particles.rotation.y = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()