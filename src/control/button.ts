import { TextStyle, Text, Graphics, Container, ColorSource } from "pixi.js";

export interface ButtonOption {
  backgroundColor: ColorSource;
  lineColor: ColorSource;
  textColor: string;
  textSize: number;
}

export class Button extends Container {
  constructor(
    caption: string,
    x: number,
    y: number,
    options?: Partial<ButtonOption>
  ) {
    super();

    const textWidth = caption.length * 24;
    const graphics = new Graphics();
    graphics.lineStyle(5, options?.lineColor ?? 0xffffff, 1);
    graphics.beginFill(options?.backgroundColor ?? 0x00);
    graphics.drawRect(x, y, textWidth + 24, 48);
    graphics.endFill();

    const style = new TextStyle({
      fontSize: options?.textSize ?? 24,
      fontWeight: "bold",
      fill: [options?.textColor ?? "#fff"],
    });
    const text = new Text(caption, style);
    text.x = x + 12;
    text.y = y + 12;
    graphics.addChild(text);

    this.addChild(graphics);
  }

  setCallback(callback: () => void): void {
    this.eventMode = "dynamic";
    this.on("pointerdown", callback);
  }
}
