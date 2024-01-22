import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { SpriteModel } from "../model-share";
import { WeaponConfig } from "../model-types";
import { HeroModel } from "../hero/hero-common";

export abstract class WeaponModel extends SpriteModel {
  protected _restTime: number = 0;

  getAttackPower(): number {
    return (this._config as WeaponConfig).power;
  }

  hitted(): void {
    if ((this._config as WeaponConfig).onetime) {
      this.destroy();
    }
  }

  load(onLoad: (me: Sprite) => void, onDestroy: (me: Sprite) => void): void {
    super.load(onLoad, onDestroy);
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
    this.onLoad!(this._me);
    this._restTime = (this._config as WeaponConfig).limitTime;
  }
}

export class SwordModel extends WeaponModel {
  load(onLoad: (me: Sprite) => void, onDestroy: (me: Sprite) => void): void {
    super.load(onLoad, onDestroy);
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
  load(onLoad: (me: Sprite) => void, onDestroy: (me: Sprite) => void): void {
    super.load(onLoad, onDestroy);
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
