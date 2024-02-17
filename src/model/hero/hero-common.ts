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
import { AuxiliaryModel, WeaponModel } from "../wepon/wepon-common";
import { EnemyModel } from "../enemy/ememy-common";
import { WeaponFactory } from "../wepon/wepon-factory";
import { DamageText } from "../ui/damage";
import { SceneManager } from "../../shared/scene-manager";
import { GameScene } from "../../scenes/game-scene";

export class HeroModel extends SpriteModel {
  private _currentWeapons: Array<WeaponModel> = [];
  private _UI: Array<SpriteModel> = [];
  private _team: Array<HeroModel> = [];
  private _maxHP: number;

  constructor(
    type: HeroType | EnemyType | WeaponType,
    parentWidth: number,
    parentHeight: number
  ) {
    super(type, parentWidth, parentHeight);
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
  }

  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    const frames = [];
    for (let i = 1; i <= this._config.sequenceCount; i++) {
      frames.push(Texture.from(`${this._config.resourceName}${i}`));
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
      this._UI.forEach((a) => {
        a.destroy();
      });
      this._currentWeapons = [];
      this._UI = [];
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
    this._currentWeapons.push(attack);
    if (this.getWeaponConfig(type).targetType === "味方") {
      (attack as AuxiliaryModel).powerUp(this._team);
    }
  }

  attackHitTest(enemy: Array<EnemyModel>): number {
    let exp = 0;
    if (this._currentWeapons.length > 0) {
      enemy.forEach((e) => {
        this._currentWeapons.forEach((w) => {
          if (w.isHit(e)) {
            const damage = Math.ceil(
              w.attackPower +
                w.attackPower *
                  (GameScene.getLevel(this._config.type as HeroType) - 1) *
                  0.1
            );
            if (e.damaged(damage)) {
              const ui = new DamageText(
                "UI",
                this._parentWidth,
                this._parentHeight
              );
              ui.setText(damage.toString());
              ui.load((_) => {
                this._UI.splice(this._UI.indexOf(ui), 1);
              });
              this._UI.push(ui);
              ui.move(e.getCoordinate().x!, e.getCoordinate().y!);
              if (!e.isDead() && w.knockback) {
                e.move(w.knockback, 0);
              }
              w.hitted();
              if (e.isDead()) {
                exp += e.exp;
              }
            }
          }
        });
      });
    }
    return exp;
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

  levelUp(level: number) {
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
  }
}
