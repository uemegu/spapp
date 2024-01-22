import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { AuxiliaryModel, WeaponModel } from "./wepon-common";
import { HeroModel } from "../hero/hero-common";
import { WeaponConfig } from "../model-types";
import { getRandom } from "../../util";

export class HealModel extends WeaponModel implements AuxiliaryModel {
  private _mes: Array<AnimatedSprite> = [];
  powerUp(team: HeroModel[]): void {
    team.forEach((t, index) => {
      if (!t.isDead()) {
        t.heal((this._config as WeaponConfig).power);
        for (let i = index; i < this._mes.length; i += team.length) {
          this._mes[i].x =
            this._parentWidth / 2 - 120 - 100 * index + getRandom(120) - 60;
          this._mes[i].y = this._parentHeight / 2 - getRandom(120) + 40;
        }
      }
    });
  }

  load(onLoad: (me: Sprite) => void, onDestroy: (me: Sprite) => void): void {
    super.load(onLoad, onDestroy);
    const frames = [];
    for (let i = 1; i <= this._config.sequenceCount; i++) {
      const name = `${this._config.resourceName}${i}`;
      frames.push(Texture.from(name));
    }
    for (let i = 0; i < 15; i++) {
      const m = new AnimatedSprite(frames);
      this._mes.push(m);
      this.onLoad!(m);
      m.play();
    }
    this._mes.push(this._me!);
    for (let i = 0; i < this._mes.length; i++) {
      const m = this._mes[i];
      m.anchor.set(0.5);
      m.onComplete = () => {
        this.onDestroy!(m);
        m.destroy();
      };
      m.loop = true;
      const sizeTmp = getRandom(20);
      m.width = 12 + sizeTmp;
      m.height = 12 + sizeTmp;
      m.alpha = getRandom(5) / 10 + 0.5;
    }
    this._restTime = (this._config as WeaponConfig).limitTime;
  }

  update(framesPassed: number): void {
    this._mes.forEach((m) => {
      m.y -= framesPassed * 3 * m.alpha;
    });
    this._restTime -= framesPassed;
    if (this._restTime <= 0) {
      this._mes.forEach((m) => {
        this.onDestroy!(m);
        m.destroy();
      });
      this._mes = [];
    }
  }
}
