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
  private _graphics: Graphics;
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

    this._graphics = new Graphics();
    this._graphics.lineStyle(5, this._options?.lineColor ?? 0x000000, 1);
    this._graphics.beginFill(this._options?.backgroundColor ?? 0xffffff);
    this._graphics.drawRect(this._x, this._y, this._mywidth, this._myheight);
    this._graphics.endFill();

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
    attakSymbol.width = width - 18;
    attakSymbol.height = width - 18;
    attakSymbol.x = x + 6;
    attakSymbol.y = y + 18;

    const name2 = `${heroConfig.resourceName}${heroConfig.sequenceCount}`;
    const heroSymbol = new AnimatedSprite([Texture.from(name2)]);
    heroSymbol.width = width;
    heroSymbol.height = height;
    heroSymbol.x = x - 32;
    heroSymbol.y = y + 32;
    heroSymbol.alpha = 0.3;
    const graphics2 = new Graphics();
    graphics2.beginFill(options?.backgroundColor ?? 0x00);
    graphics2.drawRect(x + 5, y + 5, width - 5, height - 15);
    graphics2.endFill();
    heroSymbol.mask = graphics2;

    this.addChild(this._graphics);
    this.addChild(heroSymbol);
    this.addChild(this._gage);
    this.addChild(this._gagemask);
    this.addChild(attakSymbol);
    SceneManager.addTickListener(this);
  }

  getHeroType(): HeroType {
    return this._heroType;
  }

  disable(): void {
    this._isDisable = true;
    this._coolTime = this._maxCoolTime;
    this._graphics.lineStyle(5, this._options?.lineColor ?? 0x000000, 1);
    this._graphics.beginFill(this._options?.backgroundColor ?? 0x888888);
    this._graphics.drawRect(this._x, this._y, this._mywidth, this._myheight);
    this._graphics.endFill();
  }

  update(framesPassed: number): void {
    this._gagemask.width =
      this._gage.width *
      ((this._maxCoolTime - this._coolTime) / this._maxCoolTime);
    if (this._coolTime > 0 && !this._isDisable) {
      this._coolTime--;
      if (this._coolTime <= 0) {
        this._graphics.lineStyle(5, this._options?.lineColor ?? 0x000000, 1);
        this._graphics.beginFill(this._options?.backgroundColor ?? 0xffffff);
        this._graphics.drawRect(
          this._x,
          this._y,
          this._mywidth,
          this._myheight
        );
        this._graphics.endFill();
      }
    }
  }

  setCallback(callback: () => boolean): void {
    this.eventMode = "dynamic";
    this.on("pointerdown", () => {
      if (this._coolTime === 0) {
        if (callback()) {
          this._coolTime = this._maxCoolTime;
          this._graphics.lineStyle(5, this._options?.lineColor ?? 0x000000, 1);
          this._graphics.beginFill(this._options?.backgroundColor ?? 0x888888);
          this._graphics.drawRect(
            this._x,
            this._y,
            this._mywidth,
            this._myheight
          );
          this._graphics.endFill();
        }
      }
    });
  }
}
