import { Container, Sprite } from "pixi.js";
import { IScene, SceneManager } from "../shared/scene-manager";
import { GameScene } from "./game-scene";
import { Button } from "../control/button";
import { strings } from "../strings";

export class StartScene extends Container implements IScene {
  constructor(parentWidth: number, parentHeight: number) {
    super();
  }

  load(): void {
    const graphics = Sprite.from("opening");
    graphics.width = SceneManager.width;
    graphics.height = SceneManager.height;
    this.addChild(graphics);

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
        new GameScene(SceneManager.width, SceneManager.height)
      );
    });
    this.addChild(button);
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
