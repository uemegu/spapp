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

export interface SkillButtonOption {
  backgroundColor: ColorSource;
  lineColor: ColorSource;
  textColor: string;
  textSize: number;
}

export class SkillButton extends Container implements IUpdate {
  private _coolTime: number = 0;
  private _maxCoolTime: number;
  private _graphics: Sprite;
  private _disableGraphics: Graphics;
  private _gage: Sprite;
  private _gagemask: Sprite;
  private _isDisable: boolean = false;
  private _heroType: HeroType;
  private _options?: Partial<SkillButtonOption>;
  private _x: number;
  private _y: number;
  private _mywidth: number;
  private _myheight: number;

  constructor(
    heroConfig: HeroConfig,
    weaponConfig: WeaponConfig,
    x: number,
    y: number,
    width: number,
    height: number,
    options?: Partial<SkillButtonOption>
  ) {
    super();
    this._x = x;
    this._y = y;
    this._mywidth = width;
    this._myheight = height;
    this._maxCoolTime = weaponConfig.coolTime;
    this._heroType = heroConfig.type;
    this._options = options;

    this._disableGraphics = new Graphics();
    this._disableGraphics.beginFill(this._options?.backgroundColor ?? 0x888888);
    this._disableGraphics.drawRect(
      this._x,
      this._y,
      this._mywidth,
      this._myheight
    );
    this._disableGraphics.endFill();
    this._disableGraphics.alpha = 0;

    this._graphics = Sprite.from("panel_background");
    this._graphics.x = this._x;
    this._graphics.y = this._y;
    this._graphics.width = this._mywidth;
    this._graphics.height = this._myheight;

    const style = new TextStyle({
      fontSize: options?.textSize ?? 8,
      fontWeight: "bold",
      fill: [options?.textColor ?? "000000"],
      wordWrap: true,
      wordWrapWidth: width - 24,
    });
    const text = new Text(strings.getString(weaponConfig.type), style);
    text.x = x + 6;
    text.y = y + 6;
    this._graphics.addChild(text);

    this._gage = Sprite.from("bar_2");
    this._gage.width = width - 18;
    this._gage.height = 16;
    this._gage.x = x + 12;
    this._gage.y = y + height - 18;

    this._gagemask = Sprite.from("bar_2");
    this._gagemask.width = width - 18;
    this._gagemask.height = 16;
    this._gagemask.x = x + 12;
    this._gagemask.y = y + height - 18;
    this._gage.mask = this._gagemask;

    const name = `${weaponConfig.resourceName}${weaponConfig.sequenceCount}`;
    const attakSymbol = new AnimatedSprite([Texture.from(name)]);
    attakSymbol.width = Math.min(width - 18, 40) * SceneManager.scale;
    attakSymbol.height = Math.min(width - 18, 40) * SceneManager.scale;
    attakSymbol.x = x + width / 2 - attakSymbol.width / 2;
    attakSymbol.y = y + 20 * SceneManager.scale;

    this.addChild(this._graphics);
    this.addChild(this._gage);
    this.addChild(this._gagemask);
    this.addChild(attakSymbol);
    this.addChild(this._disableGraphics);
    SceneManager.addTickListener(this);
  }

  getHeroType(): HeroType {
    return this._heroType;
  }

  disable(): void {
    this._isDisable = true;
    this._coolTime = this._maxCoolTime;
    this._disableGraphics.alpha = 0.5;
  }

  update(framesPassed: number): void {
    this._gagemask.width =
      this._gage.width *
      ((this._maxCoolTime - this._coolTime) / this._maxCoolTime);
    if (this._coolTime > 0 && !this._isDisable) {
      this._coolTime--;
      this._disableGraphics.alpha = 0.5;
      if (this._coolTime <= 0) {
        this._disableGraphics.alpha = 0;
      }
    }
  }

  setCallback(callback: () => boolean): void {
    this.eventMode = "dynamic";
    this.on("pointerdown", () => {
      if (this._coolTime === 0) {
        if (callback()) {
          this._disableGraphics.alpha = 0.5;
          this._coolTime = this._maxCoolTime;
        }
      }
    });
  }
}
