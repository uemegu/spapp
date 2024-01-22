import { WeaponType } from "../model-types";
import { HealModel } from "./heal";
import { WeaponModel, SwordModel, FireModel } from "./wepon-common";

export class WeaponFactory {
  protected _restTime: number = 0;
  static CreateWeapon(
    type: WeaponType,
    parentWidth: number,
    parentHeight: number
  ): WeaponModel {
    switch (type) {
      case "剣":
        return new SwordModel(type, parentWidth, parentHeight);
      case "ファイア":
        return new FireModel(type, parentWidth, parentHeight);
      case "ヒール":
        return new HealModel(type, parentWidth, parentHeight);
    }
  }
}
