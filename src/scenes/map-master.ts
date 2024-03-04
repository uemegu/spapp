export interface MapInfo {
  x: number;
  y: number;
  ereaName: StageName;
  difficulty: number;
  resourceName: string;
}
export type StageName = "森林" | "砂漠";

export const MapMaster: Array<MapInfo> = [
  {
    x: 490,
    y: 420,
    ereaName: "森林",
    difficulty: 1,
    resourceName: "forest_detail.webp",
  },
  {
    x: 475,
    y: 300,
    ereaName: "砂漠",
    difficulty: 2,
    resourceName: "desart_detail.webp",
  },
];
