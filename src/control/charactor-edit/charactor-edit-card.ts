import { CurrentUnitInfo, UnitInfo } from "../../scenes/scene-master";
import { strings } from "../../strings";
import { HeroSpec, WeaponSpec, bind, showDialog } from "../../util";
import html from "./charactor-edit-card.html?raw";
import heroIconHtml from "./charactor-edit-card-hero-icon.html?raw";
import heroDetailHtml from "./charactor-edit-detail-dialog.html?raw";
import { HeroType } from "../../model/model-types";

export class CharactorEditCard {
  static write(info: UnitInfo): string {
    let heroIcons = "";
    CurrentUnitInfo.forEach((u, index) => {
      heroIcons += bind(heroIconHtml.toString(), {
        job: `${strings.getString(u.type)}`,
        level: `Lv. ${u.level}`,
        hero: `${HeroSpec(u.type).resourceName}walk_1.png`,
        unitType: u.type,
        ring:
          index == CurrentUnitInfo.indexOf(info) ? "ring-blue-500 ring-2" : "",
      });
    });

    return bind(html.toString(), {
      job: `${strings.getString(info.type)}`,
      unitType: info.type,
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
      heros: heroIcons,
      いれかえ: `${CurrentUnitInfo.indexOf(info) + 1}${strings.getString(
        "いれかえ"
      )}`,
      すきる: strings.getString("すきるいれかえ"),
    });
  }

  static setup(
    selectAction: (info: HeroType) => void,
    closeAction: () => void
  ) {
    document
      .getElementById("eidtCloseButton")
      ?.addEventListener("click", () => {
        closeAction();
      });
    Array.from(document.getElementsByClassName("ChangeCharactorIcon")).forEach(
      (dom) => {
        dom.addEventListener("click", (d) => {
          const data = (d.currentTarget as HTMLElement).dataset
            .unit! as HeroType;
          selectAction(data);
        });
      }
    );
    Array.from(document.getElementsByClassName("JobInfoIcon")).forEach(
      (dom) => {
        dom.addEventListener("click", (d) => {
          const type = (d.currentTarget as HTMLElement).dataset
            .unit! as HeroType;

          showDialog(
            bind(heroDetailHtml.toString(), {
              job: `${strings.getString(type)}`,
              hero: `${HeroSpec(type).resourceName}detail.webp`,
              detail: strings.getString(`${type}詳細`),
            }),
            "closeButton"
          );
        });
      }
    );
  }
}
