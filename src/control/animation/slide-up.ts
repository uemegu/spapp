import { Container } from "pixi.js";
import { IUpdate, SceneManager } from "../../shared/scene-manager";

export class SlideUp implements IUpdate {
  private _count: number = 0;
  private _target!: Container;
  private _y: number;

  static Show(target: Container) {
    new SlideUp(target);
  }

  private constructor(target: Container) {
    this._target = target;
    this._y = target.y;
    this._target.y += SceneManager.height;
    SceneManager.addTickListener(this);
  }

  update(framesPassed: number): void {
    const MAX = 20;
    if (this._count < MAX) {
      this._target.y -= SceneManager.height / MAX;
      this._count++;
    } else {
      this._target.y = this._y;
      SceneManager.removeTickListener(this);
    }
  }
}
