import { WeaponType } from "../model-types";
import { HealModel } from "./heal";
import {
  WeaponModel,
  SwordModel,
  ThrowAttakModel,
  FastThrowAttakModel,
  BigAttakModel,
  LineModel,
} from "./wepon-common";

export class WeaponFactory {
  protected _restTime: number = 0;
  static CreateWeapon(
    type: WeaponType,
    parentWidth: number,
    parentHeight: number
  ): WeaponModel {
    switch (type) {
      case "スマッシュ":
        return new SwordModel(type, parentWidth, parentHeight);
      case "ファイア":
        return new ThrowAttakModel(type, parentWidth, parentHeight);
      case "サンダー":
        return new LineModel(type, parentWidth, parentHeight);
      case "ヒール":
        return new HealModel(type, parentWidth, parentHeight);
      case "エアロ":
        return new BigAttakModel(type, parentWidth, parentHeight);
      case "ロングショット":
        return new FastThrowAttakModel(type, parentWidth, parentHeight);
      case "ショット":
        return new ThrowAttakModel(type, parentWidth, parentHeight);
      case "ソニックブーム":
        return new FastThrowAttakModel(type, parentWidth, parentHeight);
    }
  }
}
