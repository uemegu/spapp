import { EnemyType } from "../model-types";
import { HitAndAwwayEnemy, SimpleAttackEnemy } from "./enemy-variations";
import { EnemyModel } from "./enemy-common";

export class EnemyFactory {
  protected _restTime: number = 0;
  static CreateEnemy(
    type: EnemyType,
    parentWidth: number,
    parentHeight: number
  ): EnemyModel {
    switch (type) {
      case "ホブゴブリン":
        return new SimpleAttackEnemy(type, parentWidth, parentHeight);
      case "キマイラ":
        return new SimpleAttackEnemy(type, parentWidth, parentHeight);
      case "ゴブリンアーチャー":
        return new HitAndAwwayEnemy(type, parentWidth, parentHeight);
      default:
        return new EnemyModel(type, parentWidth, parentHeight);
    }
  }
}
