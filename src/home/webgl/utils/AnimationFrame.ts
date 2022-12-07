import * as THREE from 'three'
import { gl } from '../core/WebGL'

export class AnimationFrame {
  private clock: THREE.Clock
  private animeID?: number

  constructor(private callback: (clock: THREE.Clock) => void) {
    this.setAnimationFrame()
    this.clock = new THREE.Clock()
  }

  private setAnimationFrame() {
    const anime = () => {
      this.callback(this.clock)
      gl.render()
      requestAnimationFrame(anime)
    }
    this.animeID = requestAnimationFrame(anime)
  }

  dispose() {
    this.animeID && cancelAnimationFrame(this.animeID)
  }
}
