import { Container, Sprite, TextStyle, Text, Graphics } from "pixi.js";
import { IUpdate, SceneManager } from "../../shared/scene-manager";
import { strings } from "../../strings";
import { Button } from "./button";
import { EditScene } from "../../scenes/edit-scene/edit-scene";
import { LoadingAnimation } from "../loading-animation/loading-animation";
export interface GameSceneStatusBarOption {}

export class GameSceneStatusBar extends Container implements IUpdate {
  private _graphics: Sprite;
  private _money: Text;
  private _upText: Array<{ count: number; money: Text }> = [];
  private _gage2: Graphics;
  private _endCount: number;
  private _count: number = 0;

  constructor(endCount: number) {
    super();

    this._endCount = endCount;

    this._graphics = Sprite.from("panel_background3");
    this._graphics.x = SceneManager.width - 150 * SceneManager.scale + 20;
    this._graphics.y = -20;
    this._graphics.width = 150 * SceneManager.scale;
    this._graphics.height = 100 * SceneManager.scale;

    const money = Sprite.from("money");
    money.x = 90 * SceneManager.scale;
    money.y = 13 * SceneManager.scale;
    money.width = 32 * SceneManager.scale;
    money.height = 32 * SceneManager.scale;

    const style = new TextStyle({
      fontSize: 22 * SceneManager.scale,
      fontWeight: "bold",
      fill: ["ffffff"],
      stroke: "0x000000",
      strokeThickness: 5,
      wordWrap: false,
    });
    this._money = new Text("0", style);
    this._money.x = money.x + money.width + 12;
    this._money.y = 12 * SceneManager.scale;

    const button = new Button(
      strings.getString("もどる"),
      5 * SceneManager.scale,
      16 * SceneManager.scale,
      {
        textSize: 12 * SceneManager.scale,
        lineWidth: 1,
        backgroundColor: 0x37474f,
        lineColor: 0x000000,
        width:
          strings.getString("さいかい").length * 12 * SceneManager.scale +
          12 * SceneManager.scale,
      }
    );
    button.setCallback(() => {
      SceneManager.suspend = true;
      LoadingAnimation.show(() => {
        SceneManager.suspend = false;
        SceneManager.changeScene(
          new EditScene(SceneManager.width, SceneManager.height)
        );
      });
    });

    this._gage2 = new Graphics();
    this._gage2.beginFill(0xf604b1);
    this._gage2.drawRect(0, 0, 0, 5 * SceneManager.scale);
    this._gage2.endFill();

    const fieldName = new Text(
      strings.getString(SceneManager.CurrentStageName),
      new TextStyle({
        fontSize: 22 * SceneManager.scale,
        fontWeight: "bold",
        fill: ["ffffff"],
        stroke: "8888ee",
        strokeThickness: 5,
        wordWrap: false,
      })
    );
    fieldName.x =
      SceneManager.width -
      (150 * SceneManager.scale) / 2 -
      (strings.getString(SceneManager.CurrentStageName).length / 2) *
        24 *
        SceneManager.scale;
    fieldName.y = 20 * SceneManager.scale;

    this.addChild(this._gage2);
    this.addChild(this._graphics);
    this.addChild(this._money);
    this.addChild(money);
    this.addChild(button);
    this.addChild(fieldName);
  }

  updateMoney(money: number) {
    const current = Number(this._money.text);
    const diff = money - current;
    this._money.text = money.toString();
    if (diff) {
      const style = new TextStyle({
        fontSize: 22 * SceneManager.scale,
        fontWeight: "bold",
        fill: ["#ffffff", "#00ff99"],
        stroke: "0x000000",
        strokeThickness: 5,
        wordWrap: false,
      });
      const upText = new Text(`+${diff}`, style);
      upText.x = this._money.x;
      upText.x += this._money.width - upText.width;
      upText.y = 12 * SceneManager.scale;
      this.addChild(upText);
      this._upText.push({
        count: 0,
        money: upText,
      });
    }
  }

  update(framesPassed: number): void {
    this._count += framesPassed;
    if (this._upText.length) {
      const removes: Array<any> = [];
      this._upText.forEach((t) => {
        t.money.y -= framesPassed;
        t.count += framesPassed;
        if (t.count > 10) {
          removes.push(t);
          this.removeChild(t.money);
        }
      });
      removes.forEach((r) => {
        this._upText.splice(this._upText.indexOf(r), 1);
      });
    }

    this._gage2.clear();
    this._gage2.beginFill(0xf604b1);
    this._gage2.drawRect(
      0,
      0,
      SceneManager.width * (this._count / this._endCount),
      5 * SceneManager.scale
    );
    this._gage2.endFill();
  }

  get progress(): number {
    return this._count / this._endCount;
  }
}
