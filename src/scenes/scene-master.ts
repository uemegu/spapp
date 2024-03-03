import { EnemyType, HeroType, WeaponType } from "../model/model-types";

export interface EnemyInfo {
  type: EnemyType;
  rate: number;
}

export interface BossEnemyInfo {
  type: EnemyType;
  count: number;
}

export interface BackgroundInfo {
  resourceName: string;
  height: number;
  offsetY: number;
  movePower: number;
  fromTop: boolean;
}

export interface SoundInfo {
  resourceName: string;
}

export interface StageInfo {
  name: StageName;
  enemy: Array<EnemyInfo>;
  boss: BossEnemyInfo;
  background: Array<BackgroundInfo>;
  sound: SoundInfo;
  nextEnemyCount: number;
  endCount: number;
}

export type StageName = "森林" | "砂漠";

export const Stages: Array<StageInfo> = [
  {
    name: "森林",
    nextEnemyCount: 60,
    endCount: 3000,
    enemy: [
      {
        type: "ゴブリン",
        rate: 2,
      },
      {
        type: "ゴブリンアーチャー",
        rate: 1,
      },
      {
        type: "ゾンビ",
        rate: 4,
      },
    ],
    boss: {
      type: "ホブゴブリン",
      count: 2000,
    },
    background: [
      {
        resourceName: "sky_1",
        movePower: 0.1,
        height: 400,
        offsetY: -200,
        fromTop: true,
      },
      {
        resourceName: "background_3",
        movePower: 0.3,
        height: 512,
        offsetY: 670,
        fromTop: false,
      },
      {
        resourceName: "ground_1",
        movePower: 1,
        height: 82,
        offsetY: 160,
        fromTop: false,
      },
    ],
    sound: {
      resourceName: "field1",
    },
  },
  {
    name: "砂漠",
    nextEnemyCount: 30,
    endCount: 3000,
    enemy: [
      {
        type: "ミイラ",
        rate: 4,
      },
      {
        type: "ブラッドスライム",
        rate: 2,
      },
      {
        type: "ゴブリンアーチャー",
        rate: 1,
      },
      {
        type: "ゾンビ",
        rate: 3,
      },
    ],
    boss: {
      type: "キマイラ",
      count: 2000,
    },
    background: [
      {
        resourceName: "sky_1",
        movePower: 0.1,
        height: 400,
        offsetY: -200,
        fromTop: true,
      },
      {
        resourceName: "background_4",
        movePower: 0.3,
        height: 300,
        offsetY: 400,
        fromTop: false,
      },
      {
        resourceName: "ground_2",
        movePower: 1,
        height: 230,
        offsetY: 300,
        fromTop: false,
      },
    ],
    sound: {
      resourceName: "desert",
    },
  },
];

export interface UnitInfo {
  type: HeroType;
  weapons: Array<WeaponType>;
  exp: number;
  level: number;
}

export const CurrentUnitInfo: Array<UnitInfo> = [
  {
    type: "勇者",
    weapons: ["スマッシュ", "ガード"],
    exp: 0,
    level: 1,
  },
  {
    type: "アーチャー",
    weapons: ["ショット", "ロングショット"],
    exp: 0,
    level: 1,
  },
  {
    type: "魔法使い",
    weapons: ["ファイア", "サンダー"],
    exp: 0,
    level: 1,
  },
  {
    type: "僧侶",
    weapons: ["ヒール", "エアロ"],
    exp: 0,
    level: 1,
  },
  {
    type: "戦士",
    weapons: ["スマッシュ", "ガード"],
    exp: 0,
    level: 1,
  },
  {
    type: "ダンサー",
    weapons: ["スマッシュ", "エアロ"],
    exp: 0,
    level: 1,
  },
  {
    type: "テイマー",
    weapons: ["スマッシュ", "魔狼"],
    exp: 0,
    level: 1,
  },
];
