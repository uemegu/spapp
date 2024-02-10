import { SceneManager } from "./shared/scene-manager";
import { LoaderScene } from "./scenes/loader-scene";

SceneManager.init();

const loady: LoaderScene = new LoaderScene();
SceneManager.changeScene(loady);
