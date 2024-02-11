import { Container, Graphics } from "pixi.js";
import { IScene, SceneManager } from "../shared/scene-manager";
import { GameScene } from "./game-scene";
import { Button } from "../control/button";
import { strings } from "../strings";

export class StartScene extends Container implements IScene {
  constructor(parentWidth: number, parentHeight: number) {
    super();
  }

  load(): void {
    const button = new Button(
      strings.getString("スタート"),
      SceneManager.width / 2 - 60,
      SceneManager.height / 2
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
