import { AssetsManifest } from "pixi.js";

export const manifest: AssetsManifest = {
  bundles: [
    {
      name: "hero",
      assets: {
        hero_walk_1: "resources/images/hero/hero_walk_1.png",
        wizard_walk_1: "resources/images/hero/wizard_walk_1.png",
        priest_walk_1: "resources/images/hero/priest_walk_1.png",
        archer_walk_1: "resources/images/hero/archer_walk_1.png",
      },
    },
    {
      name: "enemy",
      assets: {
        zombi_1: "resources/images/enemy/zombi_1.png",
        zombi_2: "resources/images/enemy/zombi_2.png",
        gobrin_1: "resources/images/enemy/gobrin_1.png",
        gobrin_2: "resources/images/enemy/gobrin_2.png",
        slime_1: "resources/images/enemy/slime_1.png",
        slime_2: "resources/images/enemy/slime_2.png",
        slime_3: "resources/images/enemy/slime_3.png",
        slime_4: "resources/images/enemy/slime_2.png",
        boss_1: "resources/images/enemy/boss_1.png",
        boss_2: "resources/images/enemy/boss_2.png",
        boss_2_attack_1: "resources/images/enemy/boss_3.png",
        boss_2_attack_2: "resources/images/enemy/boss_4.png",
        boss_2_attack_3: "resources/images/enemy/boss_2.png",
      },
    },
    {
      name: "weapon",
      assets: {
        sword_1: "resources/images/weapon/sword_1.png",
        sword_2: "resources/images/weapon/sword_2.png",
        sword_3: "resources/images/weapon/sword_3.png",
        sword_4: "resources/images/weapon/sword_4.png",
        shilde_1: "resources/images/weapon/shilde_1.png",
        fire_1: "resources/images/weapon/fire_1.png",
        after_fire_1: "resources/images/weapon/after_fire_1.png",
        after_fire_2: "resources/images/weapon/after_fire_2.png",
        after_fire_3: "resources/images/weapon/after_fire_3.png",
        heal_1: "resources/images/weapon/heal_1.png",
        arrow_1: "resources/images/weapon/arrow_1.png",
        aero_1: "resources/images/weapon/aero2_1.png",
        aero_2: "resources/images/weapon/aero2_2.png",
        aero_3: "resources/images/weapon/aero2_3.png",
        aero_4: "resources/images/weapon/aero2_4.png",
        aero_5: "resources/images/weapon/aero2_5.png",
        thander_1: "resources/images/weapon/thander_1.png",
        thander_2: "resources/images/weapon/thander_2.png",
        thander_3: "resources/images/weapon/thander_3.png",
        thander_4: "resources/images/weapon/thander_4.png",
      },
    },
    {
      name: "background",
      assets: {
        background_1: "resources/images/background/background_1.jpeg",
        background_2: "resources/images/background/background_2.png",
        background_3: "resources/images/background/background_3.png",
        sky_1: "resources/images/background/sky_1.png",
        ground_1: "resources/images/background/ground_1.png",
        panel_background: "resources/images/background/panel_background.png",
        panel_background2: "resources/images/background/panel_background2.png",
      },
    },
    {
      name: "ui",
      assets: {
        bar_1: "resources/images/ui/bar_1.png",
        bar_2: "resources/images/ui/bar_2.png",
      },
    },
    {
      name: "sound",
      assets: {
        field1: "sound/bgm/field1.m4a",
      },
    },
    {
      name: "se",
      assets: {
        se_fire: "sound/se/fire.mp3",
        se_heal: "sound/se/heal.mp3",
        se_sword_1: "sound/se/sword_1.mp3",
        se_sword_2: "sound/se/sword_2.mp3",
        se_damaged: "sound/se/damaged.mp3",
        se_thander: "sound/se/thander.mp3",
        se_aero: "sound/se/aero.mp3",
      },
    },
  ],
};
