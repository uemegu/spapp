import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { SpriteModel } from "../model-share";
import { getRandom } from "../../util";
import { EnemyConfig, EnemyType, HeroType, WeaponType } from "../model-types";
import { WeaponFactory } from "../wepon/wepon-factory";
import { WeaponModel } from "../wepon/wepon-common";
import { HeroModel } from "../hero/hero-common";
import { SceneManager } from "../../shared/scene-manager";
import { sound } from "@pixi/sound";

export class EnemyModel extends SpriteModel {
  private _currentWeapons: Array<WeaponModel> = [];

  constructor(
    type: HeroType | EnemyType | WeaponType,
    parentWidth: number,
    parentHeight: number
  ) {
    super(type, parentWidth, parentHeight);
    this._hp = (this._config as EnemyConfig).maxHp;
  }

  get exp() {
    return (this._config as EnemyConfig).exp;
  }

  get money() {
    return (this._config as EnemyConfig).money;
  }

  get attackPower(): number {
    return (this._config as EnemyConfig).power;
  }

  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    const frames = [];
    for (let i = 1; i <= this._config.sequenceCount; i++) {
      frames.push(Texture.from(`${this._config.resourceName}${i}`));
    }
    this._me = new AnimatedSprite(frames);
    this._me.anchor.set(0.5);
    this._me.width = 128 * SceneManager.scale;
    this._me.height = 128 * SceneManager.scale;
    this._me.position.x = this._parentWidth;
    this._me.position.y =
      this._parentHeight -
      175 * SceneManager.scale -
      (this._config as EnemyConfig).offsetY * SceneManager.scale;
    (this._me as AnimatedSprite).animationSpeed = 0.1;
    (this._me as AnimatedSprite).play();
    SceneManager.requestAddChild(this._me);
  }

  update(framesPassed: number): void {
    super.update(framesPassed);
    if (!this._isStopMoving) {
      this.move(-(this._config as EnemyConfig).speed, 0);
    }
  }

  loadAttack(type: WeaponType): void {
    const attack = WeaponFactory.CreateWeapon(
      type,
      this._parentWidth,
      this._parentHeight
    );
    attack.load((_) => {
      this._currentWeapons.splice(this._currentWeapons.indexOf(attack), 1);
    });
    attack.reverse();
    attack.moveAt(this._me!.x - 100, this._me!.y);
    this._currentWeapons.push(attack);
  }

  attackHitTest(hero: Array<HeroModel>): void {
    if (this._currentWeapons.length > 0) {
      hero.forEach((e) => {
        this._currentWeapons.forEach((w) => {
          if (!w.isDead() && w.isHit(e)) {
            const damage = w.attackPower - e.defencePower;
            if (e.damaged(damage)) {
              w.hitted();
            }
          }
        });
      });
    }
  }

  restLife(): number {
    const maxHP = (this._config as EnemyConfig).maxHp;
    return Math.ceil((this._hp / maxHP) * 100);
  }
}
