import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { IScene, SceneManager } from "../shared/scene-manager";
import { GameScene } from "./game-scene";
import { Button } from "../control/game-scene/button";
import { strings } from "../strings";
import { EditScene } from "./edit-scene/edit-scene";
import { sound } from "@pixi/sound";
import { BGM } from "../util";

export class StartScene extends Container implements IScene {
  constructor(parentWidth: number, parentHeight: number) {
    super();
  }

  load(): void {
    const graphics = Sprite.from("opening");
    BGM("title");

    graphics.width = SceneManager.width;
    graphics.height = SceneManager.height;
    this.addChild(graphics);

    const style = new TextStyle({
      fontSize: 24,
      fontWeight: "bold",
      fill: ["#fff"],
    });
    const text = new Text(strings.getString("画面をタップしてください"), style);
    text.x =
      SceneManager.width -
      24 * strings.getString("画面をタップしてください").length -
      16;
    text.y = SceneManager.height * 0.7;
    this.addChild(text);

    this.eventMode = "dynamic";
    this.on("pointerdown", () => {
      this.removeChild(text);
      this.off("pointerdown");
      const button = new Button(
        strings.getString("スタート"),
        SceneManager.width * 0.8,
        SceneManager.height * 0.7,
        {
          textSize: 24 * SceneManager.scale,
        }
      );
      button.setCallback(() => {
        SceneManager.changeScene(
          new EditScene(SceneManager.width, SceneManager.height)
        );
      });
      this.addChild(button);
    });
  }

  resize(screenWidth: number, screenHeight: number): void {}

  update(framesPassed: number): void {}

  public requestAddChild(obj: Container): void {
    this.addChild(obj);
  }

  public requestRemoveChild(obj: Container): void {
    this.removeChild(obj);
  }
}
