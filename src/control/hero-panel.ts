import {
  TextStyle,
  Text,
  Graphics,
  Container,
  ColorSource,
  Sprite,
  AnimatedSprite,
  Texture,
  IPointData,
} from "pixi.js";
import { IUpdate, SceneManager } from "../shared/scene-manager";
import {
  HeroConfig,
  HeroType,
  ModelConfig,
  WeaponConfig,
} from "../model/model-types";
import { strings } from "../strings";
import { UnitInfo } from "../scenes/game-scene";

export interface HeroPanelOption {
  lineColor: ColorSource;
  textColor: string;
  textSize: number;
}

export class HeroPanel extends Container implements IUpdate {
  private _text: Text;
  private _graphics: Sprite;
  private _disableGraphics: Graphics;
  private _gage: Graphics;
  private _unitInfo: UnitInfo;
  private _options?: Partial<HeroPanelOption>;
  private _x: number;
  private _y: number;
  private _mywidth: number;
  private _myheight: number;

  constructor(
    info: UnitInfo,
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
    this._unitInfo = info;
    this._options = options;

    this._graphics = Sprite.from("panel_background2");
    this._graphics.x = this._x;
    this._graphics.y = this._y;
    this._graphics.width = this._mywidth;
    this._graphics.height = this._myheight;

    this._disableGraphics = new Graphics();
    this._disableGraphics.beginFill(0x888888);
    this._disableGraphics.drawRect(
      this._x,
      this._y,
      this._mywidth,
      this._myheight
    );
    this._disableGraphics.endFill();
    this._disableGraphics.alpha = 0;

    const style = new TextStyle({
      fontSize: options?.textSize ?? 12 * SceneManager.scale,
      fontWeight: "bold",
      fill: [options?.textColor ?? "000000"],
      wordWrap: true,
      wordWrapWidth: width - 24,
    });
    this._text = new Text(
      `Lv.${this._unitInfo.level} ${strings.getString(this._unitInfo.type)}`,
      style
    );
    this._text.x = x + 48 * SceneManager.scale;
    this._text.y = y + 10 * SceneManager.scale;

    this._gage = new Graphics();
    this._gage.lineStyle(1, 0x000000, 1);
    this._gage.beginFill(0x67e8f9);
    this._gage.drawRect(
      x + 48 * SceneManager.scale,
      y + height - 14 * SceneManager.scale,
      width / 2,
      6 * SceneManager.scale
    );
    this._gage.endFill();

    const heroConfig = ModelConfig.find((c) => c.type === this._unitInfo.type)!;
    const name2 = `${heroConfig.resourceName}${heroConfig.sequenceCount}`;
    const heroSymbol = new AnimatedSprite([Texture.from(name2)]);
    heroSymbol.width = 32 * SceneManager.scale;
    heroSymbol.height = 32 * SceneManager.scale;
    heroSymbol.x = x + 16 * SceneManager.scale;
    heroSymbol.y = y + 6 * SceneManager.scale;

    const graphics2 = new Graphics();
    graphics2.beginFill(0x00);
    graphics2.drawRect(x + 5, y + 5, width - 5, height - 15);
    graphics2.endFill();
    heroSymbol.mask = graphics2;

    this.addChild(this._graphics);
    this.addChild(heroSymbol);
    this.addChild(this._gage);
    this.addChild(this._text);
    this.addChild(this._disableGraphics);
  }

  getHeroType(): HeroType {
    return ModelConfig.find((c) => c.type === this._unitInfo.type)!
      .type as HeroType;
  }

  disable(): void {
    this._gage.clear();
    this._disableGraphics.alpha = 0.5;
  }

  update(restLife: number): void {
    if (restLife <= 0) {
      this.disable();
    } else {
      const r = 0xfd - ((0xfd - 0x67) * restLife) / 100;
      const g = 0xa4 - ((0xa4 - 0xe8) * restLife) / 100;
      const b = 0xaf - ((0xaf - 0xf9) * restLife) / 100;
      this._gage.clear();
      this._gage.lineStyle(1, 0x000000, 1);
      this._gage.beginFill((r << 16) + (g << 8) + b);
      this._gage.drawRect(
        this._x + 48 * SceneManager.scale,
        this._y + this._myheight - 14 * SceneManager.scale,
        ((this._mywidth / 2) * restLife) / 100,
        6 * SceneManager.scale
      );
      this._gage.endFill();
    }
  }
  updateText() {
    this._text.text = `Lv.${this._unitInfo.level} ${strings.getString(
      this._unitInfo.type
    )}`;
  }
  get Coordinate(): IPointData {
    return { x: this._x, y: this._y };
  }
}
