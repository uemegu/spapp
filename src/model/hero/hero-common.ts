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

export class HeroModel extends SpriteModel {
  private _life?: Sprite;
  private _lifeScale?: IPointData;
  private _currentWeapons: Array<WeaponModel> = [];
  private _UI: Array<SpriteModel> = [];
  private _team: Array<HeroModel> = [];

  constructor(
    type: HeroType | EnemyType | WeaponType,
    parentWidth: number,
    parentHeight: number
  ) {
    super(type, parentWidth, parentHeight);
    this._hp = (this._config as HeroConfig).maxHp;
  }

  load(onDestroy: (me: Sprite) => void): void {
    super.load(onDestroy);
    const frames = [];
    for (let i = 1; i <= this._config.sequenceCount; i++) {
      frames.push(Texture.from(`${this._config.resourceName}${i}`));
    }
    this._me = new AnimatedSprite(frames);
    this._me.anchor.set(0.5);
    this._me.width = 300 * 0.25 * SceneManager.scale;
    this._me.height = 512 * 0.25 * SceneManager.scale;
    (this._me as AnimatedSprite).animationSpeed = 0.1;
    (this._me as AnimatedSprite).play();

    this._life = Sprite.from("bar_1");
    this._life.anchor.set(0);
    this._life.width = 60 * SceneManager.scale;
    this._life.height = 20 * SceneManager.scale;
    this._lifeScale = this._life.scale;

    SceneManager.requestAddChild(this._me);
    SceneManager.requestAddChild(this._life);
    //SceneManager.requestAddChild(this._lifeMask);
  }

  getWeaponConfig(type: WeaponType) {
    return ModelConfig.find((m) => m.type === type) as WeaponConfig;
  }

  setTeam(team: Array<HeroModel>) {
    this._team = team;
  }

  destroy() {
    if (this._me) {
      this._life!.destroy();
      this.onDestroy?.(this._life!);
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
    this._life!.x += x - this._life!.width / 2;
    this._life!.y += y + this._me!.height / 3;
  }

  update(framesPassed: number) {
    this._currentWeapons.forEach((w) => {
      w.update(framesPassed);
    });
    this._UI.forEach((u) => u.update(framesPassed));
    if (this.isDead()) {
      return;
    }
    super.update(framesPassed);
    this._life!.scale = {
      x: (this._lifeScale!.x * this._hp) / (this._config as HeroConfig).maxHp,
      y: this._lifeScale!.y,
    };
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

  attackHitTest(enemy: Array<EnemyModel>): void {
    if (this._currentWeapons.length > 0) {
      enemy.forEach((e) => {
        this._currentWeapons.forEach((w) => {
          if (w.isHit(e)) {
            const damage = w.getAttackPower();
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
              if (!e.isDead() && w.getKnockback()) {
                e.move(w.getKnockback(), 0);
              }
              w.hitted();
            }
          }
        });
      });
    }
  }

  heal(num: number): void {
    this._hp += num;
    if (this._hp > (this._config as HeroConfig).maxHp) {
      this._hp = (this._config as HeroConfig).maxHp;
    }
  }
}
