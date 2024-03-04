import { CurrentUnitInfo, UnitInfo } from "../../scenes/scene-master";
import { strings } from "../../strings";
import { HeroSpec, WeaponSpec, bind, showDialog } from "../../util";
import html from "./charactor-edit-card.html?raw";
import heroIconHtml from "./charactor-edit-card-hero-icon.html?raw";
import heroDetailHtml from "./charactor-edit-detail-dialog.html?raw";
import skillDialogHtml from "./charactor-edit-card-skill-dialog.html?raw";
import { HeroType, WeaponType } from "../../model/model-types";

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

    let skillIcons = "";
    HeroSpec(info.type).skills.forEach((skill) => {
      const spec = WeaponSpec(skill.type);
      skillIcons += `<div data-unit="${skill.type}" class="w-16 ChangeSkillIcon"><img
        src="./resources/images/weapon/${spec.resourceName}${spec.sequenceCount}.png"
        class="p-4 absolute z-10 h-12 ml-4 w-12"
      />
      <img
        src="./resources/images/ui/panel_background.png"
        class="absolute h-12 ml-4"
      /></div>`;
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
      skills: skillIcons,
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
    Array.from(document.getElementsByClassName("ChangeSkillIcon")).forEach(
      (dom) => {
        dom.addEventListener("click", (d) => {
          const type = (d.currentTarget as HTMLElement).dataset
            .unit! as WeaponType;
          const spec = WeaponSpec(type);
          showDialog(
            bind(skillDialogHtml.toString(), {
              パワー: `${strings.getString("パワー")}`,
              クールタイム: `${strings.getString("クールタイム")}`,
              貫通: `${strings.getString("貫通")}`,
              ノックバック: `${strings.getString("ノックバック")}`,
              weapon_image: `${spec.resourceName}${spec.sequenceCount}.png`,
              power: `${spec.power}`,
              coolTime: `${spec.coolTime}`,
              onetime: `${
                spec.onetime
                  ? strings.getString("する")
                  : strings.getString("しない")
              }`,
              knockback: `${spec.knockback ?? 0}`,
              weapon_name: strings.getString(`${type}`),
            }),
            "skillChangeCloseButton"
          );
        });
      }
    );
  }
}
