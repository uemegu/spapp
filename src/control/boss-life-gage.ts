import { TextStyle, Text, Graphics, Container, Sprite } from "pixi.js";
import { EnemyType } from "../model/model-types";

export class BossLifeGage extends Container {
  private _x: number;
  private _y: number;
  private _mywidth: number;
  private _myheight: number;
  private _graphics: Graphics;
  private _gage: Sprite;
  private _gagemask: Sprite;

  constructor(
    type: EnemyType,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super();
    this._x = x;
    this._y = y;
    this._mywidth = width;
    this._myheight = height;

    this._graphics = new Graphics();
    this._graphics.beginFill(0x000000);
    this._graphics.drawRect(this._x, this._y, this._mywidth, this._myheight);
    this._graphics.endFill();
    this._graphics.alpha = 0.5;

    const fontSize = 22;
    const style = new TextStyle({
      fontSize: fontSize,
      fontWeight: "bold",
      fill: ["ffffff"],
      wordWrap: true,
      wordWrapWidth: width - 24,
    });
    const text = new Text(type, style);
    text.x = x + width / 2 - (type.length * fontSize) / 2;
    text.y = y + 6;

    this._gage = Sprite.from("bar_2");
    this._gage.width = width;
    this._gage.height = 16;
    this._gage.x = x + 12;
    this._gage.y = y + 28;

    this._gagemask = Sprite.from("bar_2");
    this._gagemask.width = width;
    this._gagemask.height = 16;
    this._gagemask.x = x + 12;
    this._gagemask.y = y + 28;
    this._gage.mask = this._gagemask;

    this.addChild(this._graphics);
    this.addChild(this._gage);
    this.addChild(this._gagemask);
    this.addChild(text);
  }

  update(restLife: number) {
    this._gagemask.width = (this._gage.width * restLife) / 100;
  }
}
