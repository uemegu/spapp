import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { SpriteModel } from "../model-share";
import { getRandom } from "../../util";
import { EnemyConfig, EnemyType, HeroType, WeaponType } from "../model-types";

export class EnemyModel extends SpriteModel {
  constructor(
    type: HeroType | EnemyType | WeaponType,
    parentWidth: number,
    parentHeight: number
  ) {
    super(type, parentWidth, parentHeight);
    this._hp = (this._config as EnemyConfig).maxHp;
  }

  getAttackPower(): number {
    return (this._config as EnemyConfig).power;
  }

  load(onLoad: (me: Sprite) => void, onDestroy: (me: Sprite) => void): void {
    super.load(onLoad, onDestroy);
    const frames = [];
    for (let i = 1; i <= this._config.sequenceCount; i++) {
      frames.push(Texture.from(`${this._config.resourceName}${i}`));
    }
    const offset = getRandom(30);
    this._me = new AnimatedSprite(frames);
    this._me.anchor.set(0.5);
    this._me.width = 128;
    this._me.height = 128;
    this._me.position.x = this._parentWidth;
    this._me.position.y = this._parentHeight / 2 + offset - 15;
    this._me.animationSpeed = 0.1;
    this._me.play();
    this.onLoad!(this._me);
  }

  update(framesPassed: number): void {
    this.move(-(this._config as EnemyConfig).speed, 0);
  }
}
