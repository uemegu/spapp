import { Sprite, TextStyle, Text } from "pixi.js";
import { SpriteModel } from "../model-share";

export class DamageText extends SpriteModel {
  private _text?: string;
  private _count: number = 0;

  setText(text: string): void {
    this._text = text;
  }

  load(onLoad: (me: Sprite) => void, onDestroy: (me: Sprite) => void): void {
    super.load(onLoad, onDestroy);
    const style = new TextStyle({
      fontFamily: "Arial",
      fontSize: 24,
      fontStyle: "italic",
      fontWeight: "bold",
      fill: ["#ffffff", "#ff0099"], // gradient
      stroke: "#4a1850",
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
    this._me = new Text(this._text!, style);
    this.onLoad!(this._me);
  }

  update(framesPassed: number): void {
    this._count += framesPassed;
    if (this._count > 10) {
      this.destroy();
    } else {
      this._me!.y -= framesPassed * 2;
    }
  }
}
