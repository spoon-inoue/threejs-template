import * as THREE from 'three'
import { controls } from './utils/OrbitControls'
import { gl } from './core/WebGL'
import vertexShader from './shader/plane.vert'
import fragmentShader from './shader/plane.frag'
import { Assets, loadAssets } from './utils/assetLoader'
import { resolvePath } from '../../scripts/utils'
import { calcCoveredTextureScale } from './utils/coveredTexture'
import { AnimationFrame } from './utils/AnimationFrame'

export class TCanvas {
  private animationFrame?: AnimationFrame

  private assets: Assets = {
    image: { path: resolvePath('resources/unsplash.jpg') },
  }

  constructor(private parentNode: ParentNode) {
    loadAssets(this.assets).then(() => {
      this.init()
      this.createObjects()
      this.animationFrame = new AnimationFrame(this.animationCallback)
    })
  }

  private init() {
    gl.setup(this.parentNode.querySelector('.three-container')!)
    gl.scene.background = new THREE.Color('#133')
    gl.camera.position.z = 1.5
  }

  private createObjects() {
    const texture = this.assets.image.data as THREE.Texture

    const geometry = new THREE.PlaneGeometry(1.5, 1)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_image: { value: { texture, coveredScale: new THREE.Vector2(1, 1) } },
        u_time: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = 'plane'

    const screenAspect = geometry.parameters.width / geometry.parameters.height
    calcCoveredTextureScale(texture, screenAspect, material.uniforms.u_image.value.coveredScale)

    gl.scene.add(mesh)
  }

  // ----------------------------------
  // animation frame
  private animationCallback = (clock: THREE.Clock) => {
    const dt = clock.getDelta()

    controls.update()

    const plane = gl.getMesh<THREE.ShaderMaterial>('plane')
    plane.material.uniforms.u_time.value += dt
  }

  // ----------------------------------
  // dispose
  dispose() {
    this.animationFrame?.dispose()
  }
}
