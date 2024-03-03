import { sound } from "@pixi/sound";
import {
  HeroConfig,
  HeroType,
  ModelConfig,
  WeaponConfig,
  WeaponType,
} from "./model/model-types";

export function getRandom(max: number): number {
  return Math.floor(Math.random() * max);
}

export function replaceAll(str: string, search: string, replace: string) {
  return str.split(search).join(replace);
}

export function bind(
  str: string,
  values: {
    [key: string]: string;
  }
) {
  let result = str;
  for (const key in values) {
    if (values.hasOwnProperty(key)) {
      const value = values[key];
      result = replaceAll(result, "${" + key + "}", value);
    }
  }
  return result;
}

export function WeaponSpec(type: WeaponType): WeaponConfig {
  return ModelConfig.find((m) => m.type == type) as WeaponConfig;
}

export function HeroSpec(type: HeroType): HeroConfig {
  return ModelConfig.find((m) => m.type == type) as HeroConfig;
}

export function BGM(name: string, loop: boolean = true) {
  sound.stopAll();
  sound.play(name, { loop: loop });
}

export function swapElements<T>(array: T[], t1: T, t2: T): T[] {
  const index1 = array.indexOf(t1);
  const index2 = array.indexOf(t2);
  let temp: T = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
  return array;
}

export function showDialog(html: string, closeHTMLID: string) {
  sound.play("se_tap");
  document.getElementById("dialog")!.innerHTML = html;
  document.getElementById("overlay")?.classList.remove("hidden");
  document.getElementById(closeHTMLID)?.addEventListener("click", () => {
    closeDialog();
  });
}
export function closeDialog() {
  sound.play("se_tap");
  document.getElementById("dialog")!.innerHTML = "";
  document.getElementById("overlay")?.classList.add("hidden");
}
