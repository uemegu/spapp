import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { SpriteModel } from "../model-share";
import { WeaponConfig } from "../model-types";
import { HeroModel } from "../hero/hero-common";
import { sound } from "@pixi/sound";
import { getRandom } from "../../util";
import { SceneManager } from "../../shared/scene-manager";

export abstract class WeaponModel extends SpriteModel {
  protected _restTime: number = 0;

  get attackPower(): number {
    const power = (this._config as WeaponConfig).power;
    const rate = (this._config as WeaponConfig).criticalRate ?? 1;
    return power + getRandom(power * rate);
  }

  get knockback(): number {
    const power = (this._config as WeaponConfig).knockback;
    return power ?? 0;
  }

  hitted(): void {
    if ((this._config as WeaponConfig).hittedSEName) {
      sound.play(`se_${(this._config as WeaponConfig).hittedSEName!}`);
    }
    if ((this._config as WeaponConfig).sequenceCount2) {
      const frames = [];
      for (
        let i = 1;
        i <= (this._config as WeaponConfig).sequenceCount2!;
        i++
      ) {
        const name = `after_${this._config.resourceName}${i}`;
        frames.push(Texture.from(name));
      }
      const sprite = new AnimatedSprite(frames);
      sprite.anchor.set(0.5);
      sprite.width = 192 * SceneManager.scale;
      sprite.height = 192 * SceneManager.scale;
      sprite.position.x = this._me!.position.x * SceneManager.scale;
      sprite.position.y = this._me!.position.y * SceneManager.scale;
      sprite.animationSpeed = 0.5;
      sprite.loop = false;
      sprite.onComplete = () => {
        SceneManager.requestRemoveChild(sprite);
        sprite.destroy();
      };
      SceneManager.requestAddChild(sprite);
      sprite.play();
    }
    this._me!.width *= (this._config as WeaponConfig).attenuationRate;
    this._me!.height *= (this._config as WeaponConfig).attenuationRate;
    this._restTime *= (this._config as WeaponConfig).attenuationRate;
    if ((this._config as WeaponConfig).onetime) {
      this.destroy();
    }
  }

  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    if ((this._config as WeaponConfig).startSEName) {
      sound.play(`se_${(this._config as WeaponConfig).startSEName!}`);
    }
    const frames = [];
    for (let i = 1; i <= this._config.sequenceCount; i++) {
      const name = `${this._config.resourceName}${i}`;
      frames.push(Texture.from(name));
    }
    this._me = new AnimatedSprite(frames);
    this._me.anchor.set(0.5);
    (this._me as AnimatedSprite).onComplete = () => {
      this.destroy();
    };
    SceneManager.requestAddChild(this._me);
    this._restTime = (this._config as WeaponConfig).limitTime;
  }

  reverse(): void {
    this._me!.scale = { x: -1, y: 1 };
  }

  update(framesPassed: number): void {
    this._restTime -= framesPassed;
    if (this._restTime <= 0) {
      this.destroy();
    }
  }
}

export class SwordModel extends WeaponModel {
  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    (this._me as AnimatedSprite).loop = false;
    this._me!.width = 128 * SceneManager.scale;
    this._me!.height = 128 * SceneManager.scale;
    this._me!.position.x = this._parentWidth / 2 - 40 * SceneManager.scale;
    this._me!.position.y = this._parentHeight - 200 * SceneManager.scale;
    (this._me as AnimatedSprite).animationSpeed = 0.8;
    (this._me as AnimatedSprite).play();
  }
}

export class LineModel extends WeaponModel {
  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    (this._me as AnimatedSprite).loop = false;
    this._me!.anchor.set(0);
    this._me!.width = this._parentWidth;
    this._me!.height = 128 * SceneManager.scale;
    this._me!.position.x = this._parentWidth / 2 - 40 * SceneManager.scale;
    this._me!.position.y = this._parentHeight - 240 * SceneManager.scale;
    (this._me as AnimatedSprite).animationSpeed = 0.8;
    (this._me as AnimatedSprite).play();
  }
}

export class ThrowAttakModel extends WeaponModel {
  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    (this._me as AnimatedSprite).loop = true;
    this._me!.width = 64 * SceneManager.scale;
    this._me!.height = 64 * SceneManager.scale;
    this._me!.position.x = this._parentWidth / 2 - 40 * SceneManager.scale;
    this._me!.position.y = this._parentHeight - 200 * SceneManager.scale;
    (this._me as AnimatedSprite).animationSpeed = 0.8;
    (this._me as AnimatedSprite).play();
  }

  update(framesPassed: number): void {
    this._me!.x += framesPassed * 2 * SceneManager.scale;
    super.update(framesPassed);
  }
}

export class BigAttakModel extends ThrowAttakModel {
  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    (this._me as AnimatedSprite).loop = true;
    this._me!.width = 128 * SceneManager.scale;
    this._me!.height = 128 * SceneManager.scale;
    this._me!.position.x = this._parentWidth / 2 - 40 * SceneManager.scale;
    this._me!.position.y = this._parentHeight - 210 * SceneManager.scale;
    (this._me as AnimatedSprite).animationSpeed = 0.3;
    (this._me as AnimatedSprite).play();
  }
}

export class FastThrowAttakModel extends ThrowAttakModel {
  update(framesPassed: number): void {
    this._me!.x += framesPassed * 2 * 3 * SceneManager.scale;
    super.update(framesPassed);
  }
}

export interface AuxiliaryModel extends WeaponModel {
  powerUp(team: Array<HeroModel>): void;
}
