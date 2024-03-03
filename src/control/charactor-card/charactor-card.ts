import { HeroType } from "../../model/model-types";
import { UnitInfo } from "../../scenes/scene-master";
import { strings } from "../../strings";
import { HeroSpec, WeaponSpec, bind } from "../../util";
import html from "./charactor-card.html?raw";

export class CharactorCard {
  static write(info: UnitInfo): string {
    return bind(html.toString(), {
      job: `${strings.getString(info.type)}`,
      level: `Lv. ${info.level}`,
      hero: `${HeroSpec(info.type).resourceName}walk_1.png`,
      weapon1:
        info.weapons.length > 0
          ? `${WeaponSpec(info.weapons[0]).resourceName}${
              WeaponSpec(info.weapons[0]).sequenceCount
            }.png`
          : "",
      weapon2:
        info.weapons.length > 0
          ? `${WeaponSpec(info.weapons[1]).resourceName}${
              WeaponSpec(info.weapons[1]).sequenceCount
            }.png`
          : "",
      unitType: info.type,
    });
  }
  static tapCallback(action: (info: HeroType) => void) {
    Array.from(document.getElementsByClassName("CharactorCard")).forEach(
      (dom) => {
        dom.addEventListener("click", (d) => {
          const data = (d.currentTarget as HTMLElement).dataset
            .unit! as HeroType;
          action(data);
        });
      }
    );
  }
}
