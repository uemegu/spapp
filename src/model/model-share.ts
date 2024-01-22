import { AnimatedSprite, Container, Sprite } from "pixi.js";
import {
  EnemyConfig,
  EnemyType,
  HeroConfig,
  HeroType,
  ModelConfig,
  WeaponConfig,
  WeaponType,
} from "./model-types";

export abstract class SpriteModel {
  protected _me?: AnimatedSprite;
  protected _parentWidth: number;
  protected _parentHeight: number;
  protected _damagedCount: number = 0;
  protected _hp: number = 0;
  protected _config: HeroConfig | EnemyConfig | WeaponConfig;

  onDestroy?: (me: Sprite) => void;
  onLoad?: (me: Sprite) => void;

  constructor(
    type: HeroType | EnemyType | WeaponType,
    parentWidth: number,
    parentHeight: number
  ) {
    this._parentWidth = parentWidth;
    this._parentHeight = parentHeight;
    this._config = ModelConfig.find((c) => c.type === type)!;
  }
  load(onLoad: (me: Sprite) => void, onDestroy: (me: Sprite) => void): void {
    this.onLoad = onLoad;
    this.onDestroy = onDestroy;
  }
  getAttackPower(): number {
    throw new Error("Method not implemented.");
  }
  move(x: number, y: number): void {
    this._me!.x += x;
    this._me!.y += y;
  }
  isHit(a: SpriteModel): boolean {
    if (!this._me) return false;
    const w1 = a._me!.width;
    const h1 = a._me!.height;
    const isX =
      this._me!.x - this._me!.width / 2 <= a._me!.x + w1 / 2 &&
      this._me!.x + this._me!.width / 2 >= a._me!.x - w1 / 2;
    const isY =
      this._me!.y - this._me!.height / 2 <= a._me!.y + h1 / 2 &&
      this._me!.y + this._me!.height / 2 >= a._me!.y - h1 / 2;
    return isX && isY;
  }
  destroy() {
    if (this._me) {
      this.onDestroy?.(this._me);
      this._me!.destroy();
      this._me = undefined;
    }
  }
  damaged(damage: number): void {
    if (this._damagedCount > 0) return;
    this._hp -= damage;
    console.log("ダメージ", this._config.type, this._hp);
    if (this._hp <= 0) {
      if (this.onDestroy) {
        this.onDestroy!(this._me!);
      }
    } else {
      this._damagedCount = 50;
    }
  }
  update(framesPassed: number): void {
    if (!this._me) return;
    if (this._damagedCount > 0) {
      this._me!.alpha = 0.5;
      this._damagedCount -= framesPassed;
    } else {
      this._me!.alpha = 1;
    }
  }
  isDead(): boolean {
    return this._hp <= 0;
  }
}
