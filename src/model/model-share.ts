import { Sprite } from "pixi.js";
import {
  EnemyConfig,
  EnemyType,
  HeroConfig,
  HeroType,
  ModelConfig,
  WeaponConfig,
  WeaponType,
} from "./model-types";
import { sound } from "@pixi/sound";
import { SceneManager } from "../shared/scene-manager";

export abstract class SpriteModel {
  protected _me?: Sprite;
  protected _parentWidth: number;
  protected _parentHeight: number;
  protected _damagedCount: number = 0;
  protected _hp: number = 0;
  protected _config: HeroConfig | EnemyConfig | WeaponConfig;
  protected _isStopMoving = false;
  protected _attackMotionCount = 0;

  onDestroy?: (me: Sprite) => void;

  constructor(
    type: HeroType | EnemyType | WeaponType,
    parentWidth: number,
    parentHeight: number
  ) {
    this._parentWidth = parentWidth;
    this._parentHeight = parentHeight;
    this._config = ModelConfig.find((c) => c.type === type)!;
  }
  load(onDestroy: (me: Sprite) => void): void {
    this.onDestroy = onDestroy;
  }
  move(x: number, y: number): void {
    if (!this._me) return;
    this._me!.x += x;
    this._me!.y += y;
  }
  moveAt(x: number, y: number): void {
    if (!this._me) return;
    this._me!.x = x;
    this._me!.y = y;
  }
  isHit(a: SpriteModel): boolean {
    if (!this._me || !a._me) return false;
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
      SceneManager.requestRemoveChild(this._me);
      this._me!.destroy();
      this._me = undefined;
    }
  }
  attackMotion() {}

  private _defenceSoundWait: number = 0;
  damaged(damage: number, needSound: boolean = false): boolean {
    const MAX_DAMAGE_COUNT = (this._config as EnemyConfig).speed ? 10 : 50;
    if (this._damagedCount > 0 && this._damagedCount != MAX_DAMAGE_COUNT) {
      return false;
    }
    if (damage > 0) {
      this._hp -= damage;
      if (this._hp <= 0) {
        this.destroy();
      } else {
        this._damagedCount = MAX_DAMAGE_COUNT;
      }
    }
    if (needSound) {
      if (damage > 0) {
        sound.play("se_damaged");
      } else if (this._defenceSoundWait <= 0) {
        this._defenceSoundWait = MAX_DAMAGE_COUNT;
        sound.play("se_defense");
      }
    }
    return true;
  }
  update(framesPassed: number): void {
    if (!this._me) return;
    if (this._damagedCount > 0) {
      this._me!.alpha = 0.5;
      this._damagedCount -= framesPassed;
    } else {
      this._me!.alpha = 1;
    }
    if (this._defenceSoundWait > 0) {
      this._defenceSoundWait -= framesPassed;
    }

    this._attackMotionCount -= framesPassed;
  }
  isDead(): boolean {
    return this._hp <= 0;
  }
  getCoordinate(): { x: number | undefined; y: number | undefined } {
    return { x: this._me?.x, y: this._me?.y };
  }
  stop(isStop: boolean) {
    this._isStopMoving = isStop;
  }
  resize(parentWidth: number, parentHeight: number): void {
    this._parentWidth = parentWidth;
    this._parentHeight = parentHeight;
  }
  get type(): HeroType | EnemyType | WeaponType {
    return this._config.type;
  }
}
