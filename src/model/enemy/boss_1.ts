import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { EnemyModel } from "./ememy-common";
import { SceneManager } from "../../shared/scene-manager";

export class Boss_1 extends EnemyModel {
  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    this._me!.width = 140 * SceneManager.scale;
    this._me!.height = 140 * SceneManager.scale;
  }

  update(framesPassed: number): void {
    super.update(framesPassed);
    if (this._isStopMoving) {
      this.attackMotion();
    }
  }

  attackMotion() {
    if (this._attackMotionCount <= 0) {
      const frames = [];
      for (let i = 1; i <= 3; i++) {
        frames.push(Texture.from(`boss_2_attack_${i}`));
      }
      (this._me as AnimatedSprite).textures = frames;
      (this._me as AnimatedSprite).loop = false;
      (this._me as AnimatedSprite).animationSpeed = 0.3;
      (this._me as AnimatedSprite).play();
      (this._me as AnimatedSprite).onComplete = () => {
        const frames = [];
        for (let i = 1; i <= this._config.sequenceCount; i++) {
          frames.push(Texture.from(`${this._config.resourceName}${i}`));
        }
        (this._me as AnimatedSprite).textures = frames;
        (this._me as AnimatedSprite).animationSpeed = 0.1;
        (this._me as AnimatedSprite).play();
      };
      this.loadAttack("スマッシュ");
      this._attackMotionCount = 50;
    }
  }
}
