import { TextStyle, Text, Container, Sprite, Graphics } from "pixi.js";
import { IUpdate, SceneManager } from "../../shared/scene-manager";
import { strings } from "../../strings";
import { Button } from "./button";
import { SlideUp } from "./animation/slide-up";

export interface StageClearOption {
  type: "ボス撃破" | "踏破" | "失敗";
  enemyCount: number;
  specialBonus: number;
}

export class StageClear extends Container {
  static show(option: StageClearOption, action: () => void) {
    new StageClear(option, action);
  }

  private constructor(option: StageClearOption, action: () => void) {
    super();

    const graphics = new Graphics();
    graphics.lineStyle(5, 0xffffff, 1);
    graphics.beginFill(0x00);
    graphics.drawRect(
      SceneManager.width / 6,
      SceneManager.height / 6,
      (SceneManager.width * 4) / 6,
      (SceneManager.height * 4) / 6
    );
    graphics.endFill();
    graphics.alpha = 0.8;

    const style = new TextStyle({
      fontSize: 36 * SceneManager.scale,
      fontWeight: "bold",
      fill: ["#ffffff"],
    });
    const text = new Text(strings.getString(option.type), style);
    text.x = SceneManager.width / 2 - text.width / 2;
    text.y = SceneManager.height / 6 + 18 * SceneManager.scale;

    const style2 = new TextStyle({
      fontSize: 18 * SceneManager.scale,
      fontWeight: "bold",
      fill: ["ffffff"],
    });

    const text2 = new Text(strings.getString("撃破数"), style2);
    text2.x = SceneManager.width / 6 + 24 * SceneManager.scale;
    text2.y = SceneManager.height / 6 + 84 * SceneManager.scale;
    const text3 = new Text(option.enemyCount, style2);
    text3.x =
      SceneManager.width / 6 +
      graphics.width -
      option.enemyCount.toString().length * 18 * SceneManager.scale -
      24 * SceneManager.scale;
    text3.y = SceneManager.height / 6 + 84 * SceneManager.scale;

    const text4 = new Text(strings.getString("スペシャルボーナス"), style2);
    text4.x = SceneManager.width / 6 + 24 * SceneManager.scale;
    text4.y = SceneManager.height / 6 + 128 * SceneManager.scale;
    const text5 = new Text(option.specialBonus, style2);
    text5.x =
      SceneManager.width / 6 +
      graphics.width -
      option.enemyCount.toString().length * 18 * SceneManager.scale -
      24 * SceneManager.scale;
    text5.y = SceneManager.height / 6 + 128 * SceneManager.scale;

    const button = new Button(
      strings.getString("つぎへ"),
      SceneManager.width / 2 - (strings.getString("つぎへ").length * 24) / 2,
      SceneManager.height / 6 +
        (SceneManager.height * 4) / 6 -
        64 * SceneManager.scale
    );
    button.setCallback(() => {
      SceneManager.requestRemoveChild(this);
      action();
    });

    this.addChild(graphics);
    this.addChild(text);
    this.addChild(text2);
    this.addChild(text3);
    this.addChild(text4);
    this.addChild(text5);
    this.addChild(button);

    SlideUp.Show(this);
    SceneManager.requestAddChild(this);
  }
}
