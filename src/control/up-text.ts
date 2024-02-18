import { Sprite, TextStyle, Text, Container, TextStyleFill } from "pixi.js";
import { IUpdate, SceneManager } from "../shared/scene-manager";

export interface UpTextOptions {
  fontSize?: number;
  fill?: TextStyleFill;
  stroke?: string | number | undefined;
  count?: number;
  speed?: number;
}

export class UpText extends Container implements IUpdate {
  private _graphics: Text;
  private _count: number = 0;
  private _options?: Partial<UpTextOptions>;

  static ShowText(
    text: string,
    x: number,
    y: number,
    options?: Partial<UpTextOptions>
  ) {
    new UpText(text, x, y, options);
  }

  constructor(
    text: string,
    x: number,
    y: number,
    options?: Partial<UpTextOptions>
  ) {
    super();
    this._options = options;
    const style = new TextStyle({
      fontFamily: "Arial",
      fontSize: options?.fontSize ?? 24,
      fontStyle: "italic",
      fontWeight: "bold",
      fill: options?.fill ?? ["#ffffff", "#ff0099"],
      stroke: options?.stroke ?? "#4a1850",
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round",
    });
    this._graphics = new Text(text, style);
    this.addChild(this._graphics);
    this._graphics.x = x;
    this._graphics.y = y;
    SceneManager.requestAddChild(this);
    SceneManager.addTickListener(this);
  }

  update(framesPassed: number): void {
    this._count += framesPassed;
    const th = this._options?.count ?? 30;
    if (this._count > th) {
      this.destroy();
      SceneManager.requestRemoveChild(this);
      SceneManager.removeTickListener(this);
    } else {
      const speed = this._options?.count ?? 5;
      this._graphics.y -= framesPassed * speed;
    }
  }
}
