export interface HeroConfig {
  type: HeroType;
  resourceName: string;
  sequenceCount: number;
  maxHp: number;
  defaultAttackRange: number;
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
  sequenceCount2?: number;
  startSEName?: string;
  hittedSEName?: string;
  power: number;
  coolTime: number;
  limitTime: number;
  onetime: boolean;
  attenuationRate: number;
  criticalRate?: number;
  knockback?: number;
  targetType: "味方" | "敵";
}

export interface UIConfig {
  type: UIType;
  resourceName: string;
  sequenceCount: number;
  limitTime: number;
}

export const ModelConfig: Array<
  HeroConfig | EnemyConfig | WeaponConfig | UIConfig
> = [
  {
    type: "UI",
    resourceName: "",
    sequenceCount: 1,
    limitTime: 10,
  },
  {
    type: "勇者",
    resourceName: "hero_walk_",
    sequenceCount: 1,
    maxHp: 100,
    defaultAttackRange: 1,
  },
  {
    type: "魔法使い",
    resourceName: "wizard_walk_",
    sequenceCount: 1,
    maxHp: 80,
    defaultAttackRange: 1,
  },
  {
    type: "僧侶",
    resourceName: "priest_walk_",
    sequenceCount: 1,
    maxHp: 80,
    defaultAttackRange: 1,
  },
  {
    type: "アーチャー",
    resourceName: "archer_walk_",
    sequenceCount: 1,
    maxHp: 80,
    defaultAttackRange: 4,
  },
  {
    type: "ゾンビ",
    resourceName: "zombi_",
    sequenceCount: 2,
    maxHp: 30,
    power: 5,
    speed: 1,
  },
  {
    type: "ゴブリン",
    resourceName: "gobrin_",
    sequenceCount: 2,
    maxHp: 30,
    power: 10,
    speed: 3,
  },
  {
    type: "ボブゴブリン",
    resourceName: "boss_",
    sequenceCount: 2,
    maxHp: 800,
    power: 30,
    speed: 1,
  },
  {
    type: "スライム",
    resourceName: "slime_",
    sequenceCount: 4,
    maxHp: 100,
    power: 5,
    speed: 0.5,
  },
  {
    type: "スマッシュ",
    resourceName: "sword_",
    startSEName: "sword_1",
    hittedSEName: "sword_2",
    sequenceCount: 4,
    power: 30,
    coolTime: 20,
    limitTime: 4,
    onetime: false,
    targetType: "敵",
    attenuationRate: 1,
    criticalRate: 1,
  },
  {
    type: "ソニックブーム",
    resourceName: "sword_",
    startSEName: "sword_1",
    hittedSEName: "sword_2",
    sequenceCount: 4,
    power: 30,
    coolTime: 300,
    limitTime: 40,
    onetime: false,
    targetType: "敵",
    attenuationRate: 0.8,
    criticalRate: 1,
  },
  {
    type: "ファイア",
    resourceName: "fire_",
    startSEName: "fire",
    hittedSEName: "fire",
    sequenceCount: 1,
    sequenceCount2: 3,
    power: 20,
    coolTime: 100,
    limitTime: 80,
    onetime: false,
    targetType: "敵",
    attenuationRate: 0.5,
    criticalRate: 0.2,
  },
  {
    type: "サンダー",
    resourceName: "thander_",
    startSEName: "thander",
    sequenceCount: 4,
    power: 20,
    coolTime: 300,
    limitTime: 4,
    onetime: false,
    targetType: "敵",
    attenuationRate: 1,
    criticalRate: 0.5,
  },
  {
    type: "ヒール",
    resourceName: "heal_",
    startSEName: "heal",
    sequenceCount: 1,
    power: 20,
    coolTime: 200,
    limitTime: 30,
    onetime: false,
    targetType: "味方",
    attenuationRate: 1,
  },
  {
    type: "エアロ",
    resourceName: "aero_",
    startSEName: "aero",
    sequenceCount: 5,
    power: 2,
    coolTime: 400,
    limitTime: 80,
    onetime: false,
    targetType: "敵",
    attenuationRate: 1,
    criticalRate: 1,
    knockback: 80,
  },
  {
    type: "ショット",
    resourceName: "arrow_",
    startSEName: "sword_1",
    hittedSEName: "sword_2",
    sequenceCount: 1,
    power: 20,
    coolTime: 50,
    limitTime: 80,
    onetime: true,
    targetType: "敵",
    attenuationRate: 1,
    criticalRate: 0.5,
  },
  {
    type: "ロングショット",
    resourceName: "arrow_",
    startSEName: "sword_1",
    hittedSEName: "sword_2",
    sequenceCount: 1,
    power: 5,
    coolTime: 200,
    limitTime: 80,
    onetime: false,
    targetType: "敵",
    attenuationRate: 1,
    criticalRate: 0.5,
  },
];

export type HeroType = "勇者" | "魔法使い" | "僧侶" | "アーチャー";
export type EnemyType = "ゾンビ" | "ゴブリン" | "スライム" | "ボブゴブリン";
export type WeaponType =
  | "スマッシュ"
  | "ソニックブーム"
  | "ファイア"
  | "サンダー"
  | "ヒール"
  | "エアロ"
  | "ロングショット"
  | "ショット";
export type UIType = "UI";
