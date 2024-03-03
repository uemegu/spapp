export interface HeroConfig {
  type: HeroType;
  resourceName: string;
  sequenceCount: number;
  maxHp: number;
  defaultAttackRange: number;
  defencePower: number;
  dex: number;
}

export interface EnemyConfig {
  type: EnemyType;
  resourceName: string;
  attackType?: WeaponType;
  sequenceCount: number;
  attackSequenceCount?: number;
  attackCounter?: number;
  maxHp: number;
  power: number;
  speed: number;
  exp: number;
  money: number;
  offsetY: number;
  hue?: number;
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
  targetType: "味方" | "敵" | "自分";
}

export const ModelConfig: Array<HeroConfig | EnemyConfig | WeaponConfig> = [
  {
    type: "勇者",
    resourceName: "hero_walk_",
    sequenceCount: 1,
    maxHp: 100,
    defaultAttackRange: 1,
    defencePower: 2,
    dex: 10,
  },
  {
    type: "魔法使い",
    resourceName: "wizard_walk_",
    sequenceCount: 1,
    maxHp: 80,
    defaultAttackRange: 1,
    defencePower: 1,
    dex: 10,
  },
  {
    type: "僧侶",
    resourceName: "priest_walk_",
    sequenceCount: 1,
    maxHp: 80,
    defaultAttackRange: 1,
    defencePower: 1,
    dex: 10,
  },
  {
    type: "アーチャー",
    resourceName: "archer_walk_",
    sequenceCount: 1,
    maxHp: 80,
    defaultAttackRange: 4,
    defencePower: 1,
    dex: 20,
  },
  {
    type: "戦士",
    resourceName: "warrior_walk_",
    sequenceCount: 1,
    maxHp: 200,
    defaultAttackRange: 1,
    defencePower: 5,
    dex: 0,
  },
  {
    type: "ダンサー",
    resourceName: "dancer_walk_",
    sequenceCount: 1,
    maxHp: 80,
    defaultAttackRange: 1,
    defencePower: 1,
    dex: 20,
  },
  {
    type: "テイマー",
    resourceName: "taimer_walk_",
    sequenceCount: 1,
    maxHp: 80,
    defaultAttackRange: 1,
    defencePower: 1,
    dex: 10,
  },
  {
    type: "ゾンビ",
    resourceName: "zombi_",
    sequenceCount: 2,
    maxHp: 30,
    power: 5,
    speed: 1,
    exp: 5,
    money: 5,
    offsetY: 10,
  },
  {
    type: "ゴブリン",
    resourceName: "gobrin_",
    sequenceCount: 2,
    maxHp: 30,
    power: 10,
    speed: 2,
    exp: 15,
    money: 5,
    offsetY: 2,
  },
  {
    type: "ゴブリンアーチャー",
    resourceName: "gobrin_archer_",
    attackType: "ショット",
    sequenceCount: 2,
    attackSequenceCount: 1,
    attackCounter: 50,
    maxHp: 40,
    power: 20,
    speed: 2,
    exp: 20,
    money: 15,
    offsetY: 2,
  },
  {
    type: "ホブゴブリン",
    resourceName: "hobgoblin_",
    sequenceCount: 2,
    attackType: "スマッシュ",
    attackSequenceCount: 2,
    maxHp: 800,
    power: 30,
    speed: 1,
    exp: 50,
    money: 50,
    offsetY: 10,
  },
  {
    type: "スライム",
    resourceName: "slime_",
    sequenceCount: 2,
    maxHp: 100,
    power: 5,
    speed: 0.5,
    exp: 2,
    money: 1,
    offsetY: 0,
  },
  {
    type: "ブラッドスライム",
    resourceName: "slime_",
    sequenceCount: 2,
    maxHp: 200,
    power: 15,
    speed: 0.5,
    exp: 15,
    money: 1,
    offsetY: 0,
    hue: -143,
  },
  {
    type: "ミイラ",
    resourceName: "mummy_",
    sequenceCount: 2,
    maxHp: 100,
    power: 15,
    speed: 1,
    exp: 20,
    money: 10,
    offsetY: 10,
  },
  {
    type: "キマイラ",
    resourceName: "chimera_",
    sequenceCount: 2,
    attackType: "スマッシュ",
    attackSequenceCount: 2,
    maxHp: 1200,
    power: 50,
    speed: 1,
    exp: 150,
    money: 150,
    offsetY: 10,
  },
  {
    type: "スマッシュ",
    resourceName: "sword_",
    startSEName: "sword_1",
    hittedSEName: "sword_2",
    sequenceCount: 4,
    power: 20,
    coolTime: 20,
    limitTime: 4,
    onetime: false,
    targetType: "敵",
    attenuationRate: 1,
    criticalRate: 1,
  },
  {
    type: "ガード",
    resourceName: "shilde_",
    sequenceCount: 1,
    power: 30,
    coolTime: 300,
    limitTime: 80,
    onetime: false,
    targetType: "自分",
    attenuationRate: 1,
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
    power: 30,
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
    sequenceCount: 4,
    power: 4,
    coolTime: 400,
    limitTime: 160,
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
    limitTime: 300,
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
    power: 8,
    coolTime: 200,
    limitTime: 80,
    onetime: false,
    targetType: "敵",
    attenuationRate: 1,
    criticalRate: 0.5,
  },
  {
    type: "魔狼",
    resourceName: "wolf_",
    startSEName: "sword_1",
    hittedSEName: "sword_2",
    sequenceCount: 2,
    power: 15,
    coolTime: 250,
    limitTime: 160,
    onetime: false,
    targetType: "敵",
    attenuationRate: 1,
    criticalRate: 1,
  },
];

export type HeroType =
  | "勇者"
  | "魔法使い"
  | "僧侶"
  | "アーチャー"
  | "戦士"
  | "ダンサー"
  | "テイマー";
export type EnemyType =
  | "ゾンビ"
  | "ゴブリン"
  | "ゴブリンアーチャー"
  | "スライム"
  | "ブラッドスライム"
  | "ホブゴブリン"
  | "ミイラ"
  | "キマイラ";
export type WeaponType =
  | "スマッシュ"
  | "ガード"
  | "ファイア"
  | "サンダー"
  | "ヒール"
  | "エアロ"
  | "ロングショット"
  | "ショット"
  | "魔狼";
