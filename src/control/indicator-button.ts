import {
  TextStyle,
  Text,
  Graphics,
  Container,
  ColorSource,
  Sprite,
} from "pixi.js";
import { IUpdate, SceneManager } from "../shared/scene-manager";

export interface IndicatorButtonOption {
  backgroundColor: ColorSource;
  lineColor: ColorSource;
  textColor: string;
  textSize: number;
}

export class IndicatorButton extends Container implements IUpdate {
  private _coolTime: number = 0;
  private _maxCoolTime: number;
  private _gage: Sprite;
  private _gagemask: Sprite;

  constructor(
    caption: string,
    x: number,
    y: number,
    width: number,
    height: number,
    coolTime: number,
    options?: Partial<IndicatorButtonOption>
  ) {
    super();
    this._maxCoolTime = coolTime;

    const graphics = new Graphics();
    graphics.lineStyle(5, options?.lineColor ?? 0xffffff, 1);
    graphics.beginFill(options?.backgroundColor ?? 0x00);
    graphics.drawRect(x, y, width, height);
    graphics.endFill();

    const style = new TextStyle({
      fontSize: options?.textSize ?? 18,
      fontWeight: "bold",
      fill: [options?.textColor ?? "#fff"],
      wordWrap: true,
    });
    const text = new Text(caption, style);
    text.x = x + 12;
    text.y = y + 12;
    graphics.addChild(text);

    this._gage = Sprite.from("bar_2");
    this._gage.width = 48;
    this._gage.height = 16;
    this._gage.x = x + 12;
    this._gage.y = y + 36;

    this._gagemask = Sprite.from("bar_2");
    this._gagemask.width = 48;
    this._gagemask.height = 16;
    this._gagemask.x = x + 12;
    this._gagemask.y = y + 36;
    this._gage.mask = this._gagemask;

    this.addChild(graphics);
    this.addChild(this._gage);
    this.addChild(this._gagemask);
    SceneManager.addTickListener(this);
  }

  update(framesPassed: number): void {
    this._gagemask.width =
      this._gage.width *
      ((this._maxCoolTime - this._coolTime) / this._maxCoolTime);
    if (this._coolTime > 0) {
      this._coolTime--;
    }
  }

  setCallback(callback: () => boolean): void {
    this.eventMode = "dynamic";
    this.on("pointerdown", () => {
      if (this._coolTime === 0) {
        if (callback()) {
          this._coolTime = this._maxCoolTime;
        }
      }
    });
  }
}
