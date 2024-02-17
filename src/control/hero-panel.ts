import {
  TextStyle,
  Text,
  Graphics,
  Container,
  ColorSource,
  Sprite,
  AnimatedSprite,
  Texture,
} from "pixi.js";
import { IUpdate, SceneManager } from "../shared/scene-manager";
import { HeroConfig, HeroType, WeaponConfig } from "../model/model-types";
import { strings } from "../strings";

export interface HeroPanelOption {
  lineColor: ColorSource;
  textColor: string;
  textSize: number;
}

export class HeroPanel extends Container implements IUpdate {
  private _graphics: Graphics;
  private _gage: Graphics;
  private _heroType: HeroType;
  private _options?: Partial<HeroPanelOption>;
  private _x: number;
  private _y: number;
  private _mywidth: number;
  private _myheight: number;

  constructor(
    heroConfig: HeroConfig,
    x: number,
    y: number,
    width: number,
    height: number,
    options?: Partial<HeroPanelOption>
  ) {
    super();
    this._x = x;
    this._y = y;
    this._mywidth = width;
    this._myheight = height;
    this._heroType = heroConfig.type;
    this._options = options;

    this._graphics = new Graphics();
    this._graphics.lineStyle(5, this._options?.lineColor ?? 0x000000, 1);
    this._graphics.beginFill(0xffffff);
    this._graphics.drawRect(this._x, this._y, this._mywidth, this._myheight);
    this._graphics.endFill();

    const style = new TextStyle({
      fontSize: options?.textSize ?? 14 * SceneManager.scale,
      fontWeight: "bold",
      fill: [options?.textColor ?? "000000"],
      wordWrap: true,
      wordWrapWidth: width - 24,
    });
    const text = new Text(
      `Lv.${heroConfig.level} ${strings.getString(heroConfig.type)}`,
      style
    );
    text.x = x + 44 * SceneManager.scale;
    text.y = y + 10 * SceneManager.scale;
    this._graphics.addChild(text);

    this._gage = new Graphics();
    this._gage.lineStyle(1, 0x000000, 1);
    this._gage.beginFill(0x67e8f9);
    this._gage.drawRect(
      x + 44 * SceneManager.scale,
      y + height - 14 * SceneManager.scale,
      width / 2,
      6 * SceneManager.scale
    );
    this._gage.endFill();

    const name2 = `${heroConfig.resourceName}${heroConfig.sequenceCount}`;
    const heroSymbol = new AnimatedSprite([Texture.from(name2)]);
    heroSymbol.width = 32 * SceneManager.scale;
    heroSymbol.height = 32 * SceneManager.scale;
    heroSymbol.x = x + 6 * SceneManager.scale;
    heroSymbol.y = y + 6 * SceneManager.scale;

    const graphics2 = new Graphics();
    graphics2.beginFill(0x00);
    graphics2.drawRect(x + 5, y + 5, width - 5, height - 15);
    graphics2.endFill();
    heroSymbol.mask = graphics2;

    this.addChild(this._graphics);
    this.addChild(heroSymbol);
    this.addChild(this._gage);
  }

  getHeroType(): HeroType {
    return this._heroType;
  }

  disable(): void {
    this._gage.clear();
    this._graphics.lineStyle(5, this._options?.lineColor ?? 0x000000, 1);
    this._graphics.beginFill(0x888888);
    this._graphics.drawRect(this._x, this._y, this._mywidth, this._myheight);
    this._graphics.endFill();
  }

  update(restLife: number): void {
    if (restLife <= 0) {
      this.disable();
    } else {
      this._gage.clear();
      this._gage.lineStyle(1, 0x000000, 1);
      this._gage.beginFill(0x67e8f9);
      this._gage.drawRect(
        this._x + 44 * SceneManager.scale,
        this._y + this._myheight - 14 * SceneManager.scale,
        ((this._mywidth / 2) * restLife) / 100,
        6 * SceneManager.scale
      );
      this._gage.endFill();

      const r = 0xfd - ((0xfd - 0xff) * restLife) / 100;
      const g = 0xa4 - ((0xa4 - 0xff) * restLife) / 100;
      const b = 0xaf - ((0xaf - 0xff) * restLife) / 100;
      this._graphics.lineStyle(5, this._options?.lineColor ?? 0x000000, 1);
      this._graphics.beginFill((r << 16) + (g << 8) + b);
      this._graphics.drawRect(this._x, this._y, this._mywidth, this._myheight);
      this._graphics.endFill();
    }
  }
}
