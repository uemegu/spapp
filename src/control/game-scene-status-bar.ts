import { Container, Sprite, TextStyle, Text } from "pixi.js";
import { IUpdate, SceneManager } from "../shared/scene-manager";
import { strings } from "../strings";
import { Button } from "./button";
export interface GameSceneStatusBarOption {}

export class GameSceneStatusBar extends Container implements IUpdate {
  private _graphics: Sprite;
  private _money: Text;

  constructor() {
    super();

    this._graphics = Sprite.from("status_bar");
    this._graphics.x = SceneManager.width - 200 * SceneManager.scale - 12;
    this._graphics.y = 0;
    this._graphics.width = 200 * SceneManager.scale;
    this._graphics.height = 62 * SceneManager.scale;

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
      strings.getString("とめる"),
      10 * SceneManager.scale,
      16 * SceneManager.scale,
      {
        //height: 24 * SceneManager.scale,
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
      if (button.text === strings.getString("さいかい")) {
        button.text = strings.getString("とめる");
        SceneManager.suspend = false;
      } else {
        button.text = strings.getString("さいかい");
        SceneManager.suspend = true;
      }
    });

    const fieldName = new Text(
      strings.getString(SceneManager.CurrentStageName),
      style
    );
    fieldName.x =
      SceneManager.width -
      200 * SceneManager.scale -
      12 +
      (200 * SceneManager.scale) / 2 -
      (strings.getString(SceneManager.CurrentStageName).length / 2) *
        24 *
        SceneManager.scale;
    fieldName.y = 13 * SceneManager.scale;

    this.addChild(this._graphics);
    this.addChild(this._money);
    this.addChild(money);
    this.addChild(button);
    this.addChild(fieldName);
  }

  updateMoney(money: number) {
    this._money.text = money.toString();
    console.log(this._money.text, money);
  }

  update(): void {}
}
