import { HeroConfig, HeroType, ModelConfig, WeaponConfig, WeaponType } from "./model/model-types";

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
