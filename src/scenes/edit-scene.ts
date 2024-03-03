import { Container } from "pixi.js";
import { IScene, SceneManager } from "../shared/scene-manager";
import { CurrentUnitInfo } from "./scene-master";
import { CharactorCard } from "../control/charactor-card/charactor-card";
import { GameScene } from "./game-scene";
import { BGM, swapElements } from "../util";
import { HeroType } from "../model/model-types";
import { CharactorEditCard } from "../control/charactor-edit/charactor-edit-card";

export class EditScene extends Container implements IScene {
  constructor(parentWidth: number, parentHeight: number) {
    super();

    document.getElementById("app")?.classList.add("hidden");
    document.getElementById("editScreen")?.classList.remove("hidden");
  }

  writeCharctorCardList() {
    let html = "";
    CurrentUnitInfo.forEach((u, index) => {
      if (index > 3) return;
      html += CharactorCard.write(u);
    });
    document.getElementById("editMainContainer")!.innerHTML = html;
    CharactorCard.tapCallback((type) => {
      this.writeCharactorEditCard(type);
    });
  }

  writeCharactorEditCard(type: HeroType) {
    const unitInfo = CurrentUnitInfo.find((c) => c.type === type)!;
    document.getElementById("editMainContainer")!.innerHTML =
      CharactorEditCard.write(unitInfo);
    CharactorEditCard.changeHeroEvent((info) => {
      const unitInfo2 = CurrentUnitInfo.find((c) => c.type === info)!;
      swapElements(CurrentUnitInfo, unitInfo, unitInfo2);
      this.writeCharactorEditCard(info);
    });
  }

  load(): void {
    BGM("town");

    document.getElementById("startButton")?.addEventListener("click", () => {
      document.getElementById("app")?.classList.remove("hidden");
      document.getElementById("editScreen")?.classList.add("hidden");
      SceneManager.changeScene(
        new GameScene(SceneManager.width, SceneManager.height)
      );
    });

    document.getElementById("partyEdit")?.addEventListener("click", () => {
      this.writeCharctorCardList();
    });

    this.writeCharctorCardList();
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
