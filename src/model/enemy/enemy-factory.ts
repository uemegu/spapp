import { EnemyType } from "../model-types";
import { Boss_1 } from "./boss_1";
import { EnemyModel } from "./ememy-common";

export class EnemyFactory {
  protected _restTime: number = 0;
  static CreateEnemy(
    type: EnemyType,
    parentWidth: number,
    parentHeight: number
  ): EnemyModel {
    switch (type) {
      case "ボブゴブリン":
        return new Boss_1(type, parentWidth, parentHeight);
      default:
        return new EnemyModel(type, parentWidth, parentHeight);
    }
  }
}
