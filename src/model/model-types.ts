export interface HeroConfig {
  type: HeroType;
  resourceName: string;
  sequenceCount: number;
  maxHp: number;
}

export interface EnemyConfig {
  type: EnemyType;
  resourceName: string;
  sequenceCount: number;
  maxHp: number;
  power: number;
  speed: number;
}

export interface WeaponConfig {
  type: WeaponType;
  resourceName: string;
  sequenceCount: number;
  power: number;
  coolTime: number;
  limitTime: number;
  onetime: boolean;
  targetType: "味方" | "敵";
}

export const ModelConfig: Array<HeroConfig | EnemyConfig | WeaponConfig> = [
  {
    type: "勇者",
    resourceName: "hero_walk_",
    sequenceCount: 1,
    maxHp: 100,
  },
  {
    type: "魔法使い",
    resourceName: "wizard_walk_",
    sequenceCount: 1,
    maxHp: 80,
  },
  {
    type: "僧侶",
    resourceName: "priest_walk_",
    sequenceCount: 1,
    maxHp: 80,
  },
  {
    type: "ゾンビ",
    resourceName: "zombi_",
    sequenceCount: 2,
    maxHp: 10,
    power: 10,
    speed: 1,
  },
  {
    type: "ゴブリン",
    resourceName: "gobrin_",
    sequenceCount: 2,
    maxHp: 10,
    power: 20,
    speed: 2,
  },
  {
    type: "スライム",
    resourceName: "slime_",
    sequenceCount: 4,
    maxHp: 5,
    power: 5,
    speed: 0.5,
  },
  {
    type: "剣",
    resourceName: "sword_",
    sequenceCount: 4,
    power: 10,
    coolTime: 25,
    limitTime: 4,
    onetime: false,
    targetType: "敵",
  },
  {
    type: "ファイア",
    resourceName: "fire_",
    sequenceCount: 1,
    power: 20,
    coolTime: 200,
    limitTime: 80,
    onetime: false,
    targetType: "敵",
  },
  {
    type: "ヒール",
    resourceName: "heal_",
    sequenceCount: 1,
    power: 20,
    coolTime: 300,
    limitTime: 30,
    onetime: false,
    targetType: "味方",
  },
];

export type HeroType = "勇者" | "魔法使い" | "僧侶";
export type EnemyType = "ゾンビ" | "ゴブリン" | "スライム";
export type WeaponType = "剣" | "ファイア" | "ヒール";
