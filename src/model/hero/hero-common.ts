import { AnimatedSprite, Container, Sprite, Texture } from "pixi.js";
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

export class HeroModel extends SpriteModel {
  private _life?: Sprite;
  private _lifeMask?: Sprite;
  private _attackGage: Array<Sprite> = [];
  private _attackGageMask: Array<Sprite> = [];
  private _weapons?: Array<WeaponType>;
  private _currentWeapons: Array<WeaponModel> = [];
  private _UI: Array<SpriteModel> = [];
  private _attackCount: Array<number> = [];
  private _team: Array<HeroModel> = [];

  constructor(
    type: HeroType | EnemyType | WeaponType,
    parentWidth: number,
    parentHeight: number
  ) {
    super(type, parentWidth, parentHeight);
    this._hp = (this._config as HeroConfig).maxHp;
  }

  load(onLoad: (me: Sprite) => void, onDestroy: (me: Sprite) => void): void {
    super.load(onLoad, onDestroy);
    const frames = [];
    for (let i = 1; i <= this._config.sequenceCount; i++) {
      frames.push(Texture.from(`${this._config.resourceName}${i}`));
    }
    this._me = new AnimatedSprite(frames);
    this._me.anchor.set(0.5);
    this._me.width = 300 * 0.25;
    this._me.height = 512 * 0.25;
    (this._me as AnimatedSprite).animationSpeed = 0.1;
    (this._me as AnimatedSprite).play();

    this._life = Sprite.from("bar_1");
    this._life.anchor.set(0);
    this._life.width = 60;
    this._life.height = 20;

    this._lifeMask = Sprite.from("bar_1");
    this._lifeMask.anchor.set(0);
    this._lifeMask.width = this._life!.width;
    this._lifeMask.height = this._life!.height;
    this._life.mask = this._lifeMask;

    this.onLoad!(this._me);
    this.onLoad!(this._life);
    this.onLoad!(this._lifeMask);

    this._weapons?.forEach((_) => {
      const gage = Sprite.from("bar_2");
      gage.anchor.set(0);
      gage.width = this._life!.width;
      gage.height = this._life!.height;

      const gagemask = Sprite.from("bar_2");
      gagemask.anchor.set(0);
      gagemask.width = gage.width;
      gagemask.height = gage.height;
      gage.mask = gagemask;
      this._attackGage?.push(gage);
      this._attackGageMask?.push(gagemask);
      this.onLoad!(gage);
      this.onLoad!(gagemask);
    });
  }

  getWeaponConfig(type: WeaponType) {
    return ModelConfig.find((m) => m.type === type) as WeaponConfig;
  }

  setWeapon(weapons: Array<WeaponType>) {
    this._weapons = weapons;
    this._weapons?.forEach((w) => {
      this._attackCount?.push(this.getWeaponConfig(w).coolTime);
    });
  }

  setTeam(team: Array<HeroModel>) {
    this._team = team;
  }

  destroy() {
    if (this._me) {
      this._life!.destroy();
      this._lifeMask!.destroy();
      this.onDestroy?.(this._life!);
      this.onDestroy?.(this._lifeMask!);
      this._attackGage.forEach((a) => {
        this.onDestroy?.(a);
        a.destroy();
      });
      this._attackGageMask.forEach((a) => {
        this.onDestroy?.(a);
        a.destroy();
      });
      this._currentWeapons.forEach((a) => {
        a.destroy();
      });
    }
    super.destroy();
  }

  move(x: number, y: number): void {
    super.move(x, y);
    this._life!.x += x - this._life!.width / 2;
    this._life!.y += y + this._me!.height / 3;
    this._lifeMask!.x += x - this._life!.width / 2;
    this._lifeMask!.y += y + this._me!.height / 3;
    this._attackGage.forEach((a) => {
      a.x += x - this._life!.width / 2;
      a.y += y + this._me!.height / 3 + 15;
    });
    this._attackGageMask.forEach((a) => {
      a.x += x - this._life!.width / 2;
      a.y += y + this._me!.height / 3 + 15;
    });
  }

  update(framesPassed: number) {
    if (this.isDead()) return;
    super.update(framesPassed);
    this._lifeMask!.width =
      60 * (this._hp / (this._config as HeroConfig).maxHp);
    this._attackCount.forEach((a, index) => {
      if (a - framesPassed <= 0) {
        this._attackCount[index] = this.getWeaponConfig(
          this._weapons![index]
        ).coolTime;
        this.loadAttack(this._weapons![index]);
      } else {
        this._attackCount[index] -= framesPassed;
      }
      this._attackGageMask[index].width =
        (this._life!.width * this._attackCount[index]) /
        this.getWeaponConfig(this._weapons![index]).coolTime;
    });
    this._currentWeapons.forEach((w) => {
      w.update(framesPassed);
    });
    this._UI.forEach((u) => u.update(framesPassed));
  }

  loadAttack(type: WeaponType): void {
    const attack = WeaponFactory.CreateWeapon(
      type,
      this._parentWidth,
      this._parentHeight
    );
    attack.load(
      (obj) => {
        this.onLoad?.(obj);
      },
      (obj) => {
        this._currentWeapons.splice(this._currentWeapons.indexOf(attack), 1);
        this.onDestroy!(obj);
      }
    );
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
            const ui = new DamageText(
              "UI",
              this._parentWidth,
              this._parentHeight
            );
            ui.setText(w.getAttackPower().toString());
            ui.load(
              (obj) => {
                this._UI.push(ui);
                this.onLoad?.(obj);
              },
              (obj) => {
                this._UI.splice(this._UI.indexOf(ui), 1);
                this.onDestroy!(obj);
              }
            );
            ui.move(e.getCoordinate().x!, e.getCoordinate().y!);
            e.damaged(w.getAttackPower());
            w.hitted();
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
