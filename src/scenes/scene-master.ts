import { EnemyType } from "../model/model-types";

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

export type StageName = "草原" | "砂漠";

export const Stages: Array<StageInfo> = [
  {
    name: "草原",
    nextEnemyCount: 60,
    endCount: 3000,
    enemy: [
      {
        type: "ゴブリン",
        rate: 2,
      },
      {
        type: "スライム",
        rate: 4,
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
        height: 500,
        offsetY: -300,
        fromTop: true,
      },
      {
        resourceName: "background_3",
        movePower: 0.3,
        height: 150,
        offsetY: 330,
        fromTop: false,
      },
      {
        resourceName: "ground_1",
        movePower: 1,
        height: 180,
        offsetY: 220,
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
        type: "スライム",
        rate: 2,
      },
      {
        type: "ゾンビ",
        rate: 4,
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
