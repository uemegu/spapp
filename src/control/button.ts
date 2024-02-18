import {
  TextStyle,
  Text,
  Graphics,
  Container,
  ColorSource,
  IPointData,
} from "pixi.js";
import { SceneManager } from "../shared/scene-manager";

export interface ButtonOption {
  backgroundColor: ColorSource;
  lineColor: ColorSource;
  lineWidth: number;
  textColor: string;
  textSize: number;
  noLine: boolean;
  height: number;
  width: number;
}

export class Button extends Container {
  private _text: Text;
  private _graphics: Graphics;
  private _options?: Partial<ButtonOption>;
  private _point: IPointData;

  constructor(
    caption: string,
    x: number,
    y: number,
    options?: Partial<ButtonOption>
  ) {
    super();

    this._options = options;
    this._point = { x: x, y: y };

    const style = new TextStyle({
      fontSize: options?.textSize ?? 24,
      fontWeight: "bold",
      fill: [options?.textColor ?? "#fff"],
    });
    this._text = new Text(caption, style);
    this._text.x = x + ((options?.textSize ?? 24) * SceneManager.scale) / 2;
    this._text.y = y + ((options?.textSize ?? 24) * SceneManager.scale) / 2;

    this._graphics = new Graphics();
    this.draw(caption);

    this.addChild(this._graphics);
    this.addChild(this._text);
  }

  draw(caption: string) {
    const textWidth = caption.length * (this._options?.textSize ?? 24);
    if (!this._options || !this._options?.noLine) {
      this._graphics.lineStyle(
        this._options?.lineWidth ?? 5,
        this._options?.lineColor ?? 0xffffff,
        1
      );
    }
    this._graphics.beginFill(this._options?.backgroundColor ?? 0x00);
    this._graphics.drawRect(
      this._point.x,
      this._point.y,
      this._options?.width ?? textWidth + (this._options?.textSize ?? 24),
      this._options?.height ??
        (this._options?.textSize ?? 24) * 2 * SceneManager.scale
    );
    this._graphics.endFill();
    if (this._options?.width) {
      this._text.x = this._options?.width / 2 - textWidth / 2 + this._point.x;
    }
  }

  setCallback(callback: () => void): void {
    this.eventMode = "dynamic";
    this.on("pointerdown", callback);
  }

  get text(): string {
    return this._text.text;
  }
  set text(str: string) {
    this._text.text = str;
    this.draw(str);
  }
}
