import { Container } from "pixi.js";
import { IScene, SceneManager } from "../../shared/scene-manager";
import { CurrentUnitInfo } from "../scene-master";
import { CharactorCard } from "../../control/charactor-card/charactor-card";
import { GameScene } from "../game-scene";
import { BGM, HeroSpec, bind, swapElements } from "../../util";
import { HeroType } from "../../model/model-types";
import { CharactorEditCard } from "../../control/charactor-edit/charactor-edit-card";
import { sound } from "@pixi/sound";
import html from "./edit-scene.html?raw";
import { MapSelector } from "../../control/map-selector/map-selector";
import { strings } from "../../strings";
import { LoadingAnimation } from "../../control/loading-animation/loading-animation";

export class EditScene extends Container implements IScene {
  constructor(parentWidth: number, parentHeight: number) {
    super();

    document.getElementById("editScreen")!.innerHTML = bind(html.toString(), {
      しゅっぱつ: strings.getString("しゅっぱつ"),
      へんせい: strings.getString("へんせい"),
    });
    document.getElementById("app")?.classList.add("hidden");
    document.getElementById("editScreen")?.classList.remove("hidden");
  }

  load(): void {
    BGM("town");
    setTimeout(() => {
      this.setUpClickEvent();
    }, 1000);

    this.writeCharctorCardList();
    this.writeSelectedChartors();
  }

  setUpClickEvent() {
    document.getElementById("startButton")?.addEventListener("click", () => {
      sound.play("se_menu");
      document.getElementById("currentSelectedMenuName")!.innerHTML =
        strings.getString("しゅっぱつ");
      document.getElementById("editMainContainer")!.innerHTML =
        MapSelector.write();
      MapSelector.setup((info) => {
        LoadingAnimation.show(() => {
          document.getElementById("app")?.classList.remove("hidden");
          document.getElementById("editScreen")?.classList.add("hidden");
          SceneManager.changeScene(
            new GameScene(SceneManager.width, SceneManager.height),
            info.ereaName
          );
        });
      });
    });

    document.getElementById("partyEdit")?.addEventListener("click", () => {
      this.writeCharctorCardList();
      document.getElementById("currentSelectedMenuName")!.innerHTML =
        strings.getString("へんせい");
      sound.play("se_menu");
    });
  }

  writeCharctorCardList() {
    let html = "";
    CurrentUnitInfo.forEach((u, index) => {
      if (index > 3) return;
      html += CharactorCard.write(u);
    });
    document.getElementById("editMainContainer")!.innerHTML = html;

    setTimeout(() => {
      CharactorCard.tapCallback((type) => {
        sound.play("se_tap");
        this.writeCharactorEditCard(type);
      });
    }, 1000);
  }

  writeCharactorEditCard(type: HeroType) {
    const unitInfo = CurrentUnitInfo.find((c) => c.type === type)!;
    document.getElementById("editMainContainer")!.innerHTML =
      CharactorEditCard.write(unitInfo);
    CharactorEditCard.setup(
      (info) => {
        sound.play("se_tap");
        const unitInfo2 = CurrentUnitInfo.find((c) => c.type === info)!;
        swapElements(CurrentUnitInfo, unitInfo, unitInfo2);
        this.writeCharactorEditCard(info);
      },
      () => {
        sound.play("se_tap");
        this.writeCharctorCardList();
      }
    );
    this.writeSelectedChartors();
  }

  writeSelectedChartors() {
    let charctorsHTML = "";
    CurrentUnitInfo.forEach((u, index) => {
      if (index > 3) return;
      charctorsHTML += `<img src="./resources/images/hero/${
        HeroSpec(u.type).resourceName
      }walk_1.png" class="h-16 mr-4">`;
    });
    document.getElementById("selectedCharactors")!.innerHTML = charctorsHTML;
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
