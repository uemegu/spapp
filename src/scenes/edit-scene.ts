import { Container } from "pixi.js";
import { IScene, SceneManager } from "../shared/scene-manager";
import { CurrentUnitInfo } from "./scene-master";
import { CharactorCard } from "../control/charactor-card/charactor-card";
import { GameScene } from "./game-scene";
import { BGM } from "../util";

export class EditScene extends Container implements IScene {
  constructor(parentWidth: number, parentHeight: number) {
    super();

    document.getElementById("app")?.classList.add("hidden");
    document.getElementById("editScreen")?.classList.remove("hidden");

    document.getElementById("startButton")?.addEventListener("click", () => {
      document.getElementById("app")?.classList.remove("hidden");
      document.getElementById("editScreen")?.classList.add("hidden");
      SceneManager.changeScene(new GameScene(SceneManager.width, SceneManager.height));
    });

    this.writeCharctorCardList();
  }

  writeCharctorCardList() {
    let html = "";
    CurrentUnitInfo.forEach((u) => {
      html += CharactorCard.write(u);
    });
    document.getElementById("charactorList")!.innerHTML = html;
  }

  load(): void {
    BGM("town");
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
