import { CurrentUnitInfo, UnitInfo } from "../../scenes/scene-master";
import { strings } from "../../strings";
import { HeroSpec, WeaponSpec, bind } from "../../util";
import html from "./charactor-edit-card.html?raw";
import heroIconHtml from "./charactor-edit-card-hero-icon.html?raw";
import { HeroType } from "../../model/model-types";

export class CharactorEditCard {
  static write(info: UnitInfo): string {
    let heroIcons = "";
    CurrentUnitInfo.forEach((u) => {
      heroIcons += bind(heroIconHtml.toString(), {
        job: `${strings.getString(u.type)}`,
        level: `Lv. ${u.level}`,
        hero: `${HeroSpec(u.type).resourceName}1.png`,
        unitType: u.type,
      });
    });

    return bind(html.toString(), {
      job: `${strings.getString(info.type)}`,
      level: `Lv. ${info.level}`,
      hero: `${HeroSpec(info.type).resourceName}1.png`,
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
      heros: heroIcons,
    });
  }

  static changeHeroEvent(action: (info: HeroType) => void) {
    Array.from(document.getElementsByClassName("ChangeCharactorIcon")).forEach(
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
