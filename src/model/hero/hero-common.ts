import { AnimatedSprite, IPointData, Sprite, Texture } from "pixi.js";
import { SpriteModel } from "../model-share";
import {
  EnemyType,
  HeroConfig,
  HeroType,
  ModelConfig,
  WeaponConfig,
  WeaponType,
} from "../model-types";
import {
  AuxiliaryModel,
  AuxiliarySelfModel,
  WeaponModel,
} from "../wepon/wepon-common";
import { EnemyModel } from "../enemy/enemy-common";
import { WeaponFactory } from "../wepon/wepon-factory";
import { SceneManager } from "../../shared/scene-manager";
import { GameScene } from "../../scenes/game-scene";
import { UpText } from "../../control/game-scene/up-text";

export interface BuffModel {
  attackPower: number;
  defencePower: number;
  dex: number;
  restTime: number;
}

export class HeroModel extends SpriteModel {
  private _currentWeapons: Array<WeaponModel> = [];
  private _team: Array<HeroModel> = [];
  private _maxHP: number = 0;
  private _defencePower: number = 0;
  private _buff: Array<BuffModel> = [];

  constructor(
    type: HeroType | EnemyType | WeaponType,
    parentWidth: number,
    parentHeight: number
  ) {
    super(type, parentWidth, parentHeight);
    this.setStatus();
  }

  private setStatus() {
    this._maxHP =
      (this._config as HeroConfig).maxHp +
      (this._config as HeroConfig).maxHp *
        (GameScene.getLevel(this._config.type as HeroType) - 1) *
        0.1;
    this._hp =
      (this._config as HeroConfig).maxHp +
      (this._config as HeroConfig).maxHp *
        (GameScene.getLevel(this._config.type as HeroType) - 1) *
        0.1;
    this._defencePower =
      (this._config as HeroConfig).defencePower +
      (this._config as HeroConfig).defencePower *
        (GameScene.getLevel(this._config.type as HeroType) - 1) *
        0.1;
  }

  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    const frames = [];
    for (let i = 1; i <= this._config.sequenceCount; i++) {
      frames.push(Texture.from(`${this._config.resourceName}walk_${i}`));
    }
    this._me = new AnimatedSprite(frames);
    this._me.anchor.set(0.5);
    this._me.width = 250 * 0.25 * SceneManager.scale;
    this._me.height = 512 * 0.25 * SceneManager.scale;
    (this._me as AnimatedSprite).animationSpeed = 0.1;
    (this._me as AnimatedSprite).play();

    SceneManager.requestAddChild(this._me);
  }

  getWeaponConfig(type: WeaponType) {
    return ModelConfig.find((m) => m.type === type) as WeaponConfig;
  }

  setTeam(team: Array<HeroModel>) {
    this._team = team;
  }

  destroy() {
    if (this._me) {
      this._currentWeapons.forEach((a) => {
        a.destroy();
      });
      this._currentWeapons = [];
    }
    super.destroy();
  }

  move(x: number, y: number): void {
    super.move(x, y);
  }

  update(framesPassed: number) {
    this._currentWeapons.forEach((w) => {
      w.update(framesPassed);
    });
    this._buff.forEach((b) => {
      b.restTime -= framesPassed;
    });
    this._buff = this._buff.filter((b) => b.restTime > 0);
    if (this.isDead()) {
      return;
    }
    super.update(framesPassed);
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
    if (this.getWeaponConfig(type).targetType === "自分") {
      attack.moveAt(
        this._me!.x + this._me!.width / 2,
        attack.getCoordinate().y!
      );
    } else {
      attack.moveAt(this._me!.x + this._me!.width, attack.getCoordinate().y!);
    }
    this._currentWeapons.push(attack);
    if (this.getWeaponConfig(type).targetType === "味方") {
      (attack as AuxiliaryModel).powerUp(this._team);
    } else if (this.getWeaponConfig(type).targetType === "自分") {
      (attack as AuxiliarySelfModel).powerUp(this);
    }
  }

  attackHitTest(enemy: Array<EnemyModel>): {
    exp: number;
    money: number;
    count: number;
  } {
    let exp = 0;
    let money = 0;
    let count = 0;
    if (this._currentWeapons.length > 0) {
      enemy.forEach((e) => {
        this._currentWeapons.forEach((w) => {
          if (
            this.getWeaponConfig(w.type as WeaponType).targetType === "敵" &&
            w.isHit(e)
          ) {
            const attackPower =
              w.attackPower + this._buff.reduce((a, b) => a + b.attackPower, 0);
            const damage = Math.ceil(
              attackPower +
                attackPower *
                  (GameScene.getLevel(this._config.type as HeroType) - 1) *
                  0.1
            );
            const point = e.getCoordinate();
            if (e.damaged(damage)) {
              UpText.ShowText(damage.toString(), point.x!, point.y!);
              if (!e.isDead() && w.knockback) {
                e.move(w.knockback, 0);
              }
              w.hitted();
              if (e.isDead()) {
                exp += e.exp;
                money += e.money;
                count++;
              }
            }
          }
        });
      });
    }
    return { exp: exp, money: money, count: count };
  }

  heal(num: number): void {
    this._hp += num;
    if (this._hp > this._maxHP) {
      this._hp = this._maxHP;
    }
  }

  restLife(): number {
    return Math.ceil((this._hp / this._maxHP) * 100);
  }

  static judgeLevel(exp: number) {
    let th = 50;
    let level = 1;
    while (exp > th) {
      th *= 1.5;
      level++;
    }
    return level;
  }

  get defencePower(): number {
    return (
      this._defencePower + this._buff.reduce((a, b) => a + b.defencePower, 0)
    );
  }

  levelUp() {
    this.setStatus();
  }

  addBuff(buf: BuffModel) {
    this._buff.push(buf);
  }
}
