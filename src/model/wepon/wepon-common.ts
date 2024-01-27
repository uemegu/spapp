import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { SpriteModel } from "../model-share";
import { WeaponConfig } from "../model-types";
import { HeroModel } from "../hero/hero-common";
import { GameScene } from "../../scenes/game-scene";
import { sound } from "@pixi/sound";
import { getRandom } from "../../util";

export abstract class WeaponModel extends SpriteModel {
  protected _restTime: number = 0;

  getAttackPower(): number {
    const power = (this._config as WeaponConfig).power;
    const rate = (this._config as WeaponConfig).criticalRate ?? 1;
    return power + getRandom(power * rate);
  }

  hitted(): void {
    if ((this._config as WeaponConfig).hittedSEName) {
      sound.play((this._config as WeaponConfig).hittedSEName!);
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
      sprite.width = 192;
      sprite.height = 192;
      sprite.position.x = this._me!.position.x;
      sprite.position.y = this._me!.position.y;
      sprite.animationSpeed = 0.5;
      sprite.loop = false;
      sprite.onComplete = () => {
        GameScene.requestRemoveChild(sprite);
        sprite.destroy();
      };
      GameScene.requestAddChild(sprite);
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
      sound.play((this._config as WeaponConfig).startSEName!);
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
    GameScene.requestAddChild(this._me);
    this._restTime = (this._config as WeaponConfig).limitTime;
  }

  reverse(): void {
    this._me!.scale = { x: -1, y: 1 };
  }
}

export class SwordModel extends WeaponModel {
  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    (this._me as AnimatedSprite).loop = false;
    this._me!.width = 128;
    this._me!.height = 128;
    this._me!.position.x = this._parentWidth / 2 - 40;
    this._me!.position.y = this._parentHeight / 2;
    (this._me as AnimatedSprite).animationSpeed = 0.8;
    (this._me as AnimatedSprite).play();
  }
}

export class FireModel extends WeaponModel {
  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    (this._me as AnimatedSprite).loop = true;
    this._me!.width = 64;
    this._me!.height = 64;
    this._me!.rotation = -Math.PI / 2;
    this._me!.position.x = this._parentWidth / 2 - 40;
    this._me!.position.y = this._parentHeight / 2;
    (this._me as AnimatedSprite).animationSpeed = 0.8;
    (this._me as AnimatedSprite).play();
  }

  update(framesPassed: number): void {
    this._me!.x += framesPassed * 2;
    this._restTime -= framesPassed;
    if (this._restTime <= 0) {
      this.destroy();
    }
  }
}

export interface AuxiliaryModel extends WeaponModel {
  powerUp(team: Array<HeroModel>): void;
}
