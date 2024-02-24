import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { EnemyModel } from "./enemy-common";
import { SceneManager } from "../../shared/scene-manager";
import { EnemyConfig } from "../model-types";

export class SimpleAttackEnemy extends EnemyModel {
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
      for (let i = 1; i <= 2; i++) {
        frames.push(Texture.from(`${this._config.resourceName}attack_${i}`));
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

export class HitAndAwwayEnemy extends EnemyModel {
  private _attackCounter: number = 0;
  private _isAttacked: boolean = false;

  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    this._me!.width = 100 * SceneManager.scale;
    this._me!.height = 100 * SceneManager.scale;
  }

  destroy() {
    super.destroy();
    this._currentWeapons.forEach((w) => {
      w.destroy();
    });
    this._currentWeapons = [];
  }

  update(framesPassed: number): void {
    if (this._attackMotionCount > 0) {
      this._attackMotionCount -= framesPassed;
      if (this._attackMotionCount <= 0) {
        this._attackMotionCount = 0;

        const frames = [];
        for (let i = 1; i <= this._config.sequenceCount; i++) {
          frames.push(Texture.from(`${this._config.resourceName}${i}`));
        }
        (this._me as AnimatedSprite).textures = frames;
        (this._me as AnimatedSprite).animationSpeed = 0.2;
        (this._me as AnimatedSprite).play();
      }
    } else {
      this._attackCounter += framesPassed;
    }

    this._currentWeapons.forEach((w) => {
      w.update(framesPassed + 1);
    });

    if (this._attackCounter >= (this._config as EnemyConfig).attackCounter!) {
      this._attackCounter = 0;
      this._isStopMoving = true;
      this._isAttacked = true;
      this.attackMotion();
    } else if (this._attackMotionCount == 0) {
      if (this._isAttacked) {
        if (this._me!.scale.x > 0) {
          this._me!.scale = { x: -this._me!.scale.x, y: this._me!.scale.y };
        }
        this.move((this._config as EnemyConfig).speed, 0);
      } else {
        this.move(-(this._config as EnemyConfig).speed / 2, 0);
      }
    }
  }

  attackMotion() {
    if (this._attackMotionCount <= 0) {
      if (this._me!.scale.x < 0) {
        this._me!.scale = { x: -this._me!.scale.x, y: this._me!.scale.y };
      }

      const frames = [];
      for (
        let i = 1;
        i <= (this._config as EnemyConfig).attackSequenceCount!;
        i++
      ) {
        frames.push(Texture.from(`${this._config.resourceName}attack_${i}`));
      }
      (this._me as AnimatedSprite).textures = frames;
      (this._me as AnimatedSprite).loop = false;
      (this._me as AnimatedSprite).animationSpeed = 0.01;
      (this._me as AnimatedSprite).play();
      this.loadAttack((this._config as EnemyConfig).attackType!);
      this._attackMotionCount = 100;
    }
  }
}
