import { bind } from "../../util";
import html from "./map-selector.html?raw";
import selectedMapHtml from "./map-selector-selectedMap.html?raw";
import { MapInfo, MapMaster } from "../../scenes/map-master";
import { strings } from "../../strings";
import { sound } from "@pixi/sound";

const MAP_WIDTH = 1360;
const MAP_HEIGHT = 1024;

export class MapSelector {
  private static _selectedIndex: number = 0;
  static write(): string {
    let mapPointHTML = "";
    MapMaster.forEach((m, index) => {
      if (index === this._selectedIndex) {
        mapPointHTML += `<div id="mapPoint${index}" class="rounded-full w-4 h-4 absolute bg-red-500 ring-2 ring-red-500 pulse" ></div>`;
      } else {
        mapPointHTML += `<div id="mapPoint${index}" class="rounded-full w-4 h-4 absolute bg-red-200 " ></div>`;
      }
    });

    return bind(html.toString(), { mapPointConteiner: mapPointHTML });
  }

  static mapSelected() {
    const info = MapMaster[this._selectedIndex];
    document.getElementById("selectedMap")!.innerHTML = bind(
      selectedMapHtml.toString(),
      {
        ereaName: info.ereaName,
        difficulty: `${strings.getString(
          "むずかしさ"
        )}: ${info.difficulty.toString()}`,
        map: info.resourceName,
      }
    );
  }
  static setup(action: (info: MapInfo) => void) {
    MapMaster.forEach((m, index) => {
      document
        .getElementById(`mapPoint${index}`)!
        .addEventListener("click", () => {
          sound.play("se_tap");
          document
            .getElementById(`mapPoint${this._selectedIndex}`)
            ?.classList.remove("pulse", "bg-red-500");
          document
            .getElementById(`mapPoint${this._selectedIndex}`)
            ?.classList.add("bg-red-200");
          document
            .getElementById(`mapPoint${index}`)
            ?.classList.add("pulse", "bg-red-500");
          document
            .getElementById(`mapPoint${index}`)
            ?.classList.remove("bg-red-200");
          this._selectedIndex = index;
          MapSelector.mapSelected();
        });
    });
    document.getElementById("decideMap")?.addEventListener("click", () => {
      action(MapMaster[this._selectedIndex]);
    });
    MapSelector.mapSelected();

    const ratioX =
      document.getElementById("mapContainer")!.clientWidth / MAP_WIDTH;
    const ratioY =
      document.getElementById("mapContainer")!.clientHeight / MAP_HEIGHT;
    const map_point: Array<{ top: number; left: number }> = [];
    MapMaster.forEach((m) => {
      map_point.push({
        left: m.x * ratioX,
        top: m.y * ratioY,
      });
    });
    map_point.forEach((m, index) => {
      document.getElementById(`mapPoint${index}`)!.style.left = `${m.left}px`;
      document.getElementById(`mapPoint${index}`)!.style.top = `${m.top}px`;
    });
  }
}
