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
    x: 200,
    y: 150,
    ereaName: "森林",
    difficulty: 1,
    resourceName: "forest_detail.webp",
  },
  {
    x: 200,
    y: 100,
    ereaName: "砂漠",
    difficulty: 2,
    resourceName: "desart_detail.webp",
  },
];
