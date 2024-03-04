import { bind } from "../../util";
import html from "./loading-animation.html?raw";

export class LoadingAnimation {
  static show(callback?: () => void) {
    document.getElementById("loadingAnimation")!.innerHTML = html.toString();
    setTimeout(() => {
      callback?.();
    }, 1000);
  }
}
