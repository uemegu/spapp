import { Application, Container, DisplayObject } from "pixi.js";
import { Stage, Layer } from "@pixi/layers";
import { diffuseGroup, normalGroup, lightGroup } from "@pixi/lights";
import { sound } from "@pixi/sound";
import { StageName } from "../scenes/map-master";

export class SceneManager {
  public static suspend: boolean = false;
  private constructor() {}
  private static _app: Application;
  private static _currentScene: IScene;
  private static _tickLisnters: Array<IUpdate> = [];
  private static _currentStageName: StageName = "森林";

  public static get scale() {
    let x = this.width / 667;
    let y = this.height / 375;
    return Math.min(x, y);
  }

  public static get CurrentStageName(): StageName {
    return this._currentStageName;
  }

  public static get width() {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }

  public static get height() {
    return Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
  }

  public static init(): void {
    SceneManager._app = new Application({
      view: document.getElementById("pixi-screen") as HTMLCanvasElement,
      resizeTo: window,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: "0x000",
    });

    SceneManager._app.stage = new Stage();
    SceneManager._app.stage.addChild(
      new Layer(diffuseGroup),
      new Layer(normalGroup),
      new Layer(lightGroup)
    );
    SceneManager._app.ticker.add(SceneManager.update);
    window.addEventListener("resize", SceneManager.resize);
  }

  public static changeScene(newScene: IScene, stageName?: StageName): void {
    sound.stopAll();
    if (SceneManager._currentScene) {
      SceneManager._app.stage.removeChild(SceneManager._currentScene);
      SceneManager._currentScene.destroy();
    }
    if (stageName) {
      this._currentStageName = stageName;
    }

    // Add the new one
    SceneManager._currentScene = newScene;
    SceneManager._app.stage.addChild(SceneManager._currentScene);
    newScene.load();
  }

  private static update(framesPassed: number): void {
    if (SceneManager.suspend) return;
    try {
      if (SceneManager._currentScene) {
        SceneManager._currentScene.update(framesPassed);
      }
      SceneManager._tickLisnters.forEach((l) => {
        l.update(framesPassed);
      });
    } catch (e) {
      console.log(e);
    }
  }

  public static resize(): void {
    // if we have a scene, we let it know that a resize happened!
    if (SceneManager._currentScene) {
      SceneManager._currentScene.resize(
        SceneManager.width,
        SceneManager.height
      );
    }
  }

  public static requestAddChild(obj: Container): void {
    SceneManager._currentScene.requestAddChild(obj);
  }

  public static requestRemoveChild(obj: Container): void {
    SceneManager._currentScene.requestRemoveChild(obj);
  }

  public static addTickListener(listner: IUpdate) {
    SceneManager._tickLisnters.push(listner);
  }

  public static removeTickListener(listner: IUpdate) {
    SceneManager._tickLisnters.splice(
      SceneManager._tickLisnters.indexOf(listner),
      1
    );
  }
}

export interface IScene extends DisplayObject {
  load(): void;
  update(framesPassed: number): void;
  resize(screenWidth: number, screenHeight: number): void;
  requestAddChild(obj: Container): void;
  requestRemoveChild(obj: Container): void;
}

export interface IUpdate {
  update(framesPassed: number): void;
}
