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
        warrior_walk_1: "resources/images/hero/warrior_walk_1.png",
        dancer_walk_1: "resources/images/hero/dancer_walk_1.png",
        taimer_walk_1: "resources/images/hero/taimer_walk_1.png",
      },
    },
    {
      name: "hero_detail",
      assets: {
        hero_detail: "resources/images/illust/hero_detail.webp",
        wizard_detail: "resources/images/illust/wizard_detail.webp",
        priest_detail: "resources/images/illust/priest_detail.webp",
        archer_detail: "resources/images/illust/archer_detail.webp",
        warrior_detail: "resources/images/illust/warrior_detail.webp",
        dancer_detail: "resources/images/illust/dancer_detail.webp",
        taimer_detail: "resources/images/illust/taimer_detail.webp",
      },
    },
    {
      name: "enemy",
      assets: {
        zombi_1: "resources/images/enemy/zombi_1.png",
        zombi_2: "resources/images/enemy/zombi_2.png",
        mummy_1: "resources/images/enemy/mummy_1.png",
        mummy_2: "resources/images/enemy/mummy_2.png",
        chimera_1: "resources/images/enemy/chimera_1.png",
        chimera_2: "resources/images/enemy/chimera_2.png",
        chimera_attack_1: "resources/images/enemy/chimera_3.png",
        chimera_attack_2: "resources/images/enemy/chimera_4.png",
        gobrin_1: "resources/images/enemy/gobrin_1.png",
        gobrin_2: "resources/images/enemy/gobrin_2.png",
        gobrin_archer_1: "resources/images/enemy/gobrin_archer_1.png",
        gobrin_archer_2: "resources/images/enemy/gobrin_archer_2.png",
        gobrin_archer_attack_1: "resources/images/enemy/gobrin_archer_3.png",
        slime_1: "resources/images/enemy/slime_1.png",
        slime_2: "resources/images/enemy/slime_2.png",
        slime_3: "resources/images/enemy/slime_3.png",
        slime_4: "resources/images/enemy/slime_2.png",
        hobgoblin_1: "resources/images/enemy/hobgoblin_1.png",
        hobgoblin_2: "resources/images/enemy/hobgoblin_2.png",
        hobgoblin_attack_1: "resources/images/enemy/hobgoblin_3.png",
        hobgoblin_attack_2: "resources/images/enemy/hobgoblin_4.png",
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
        aero_1: "resources/images/weapon/aero_1.png",
        aero_2: "resources/images/weapon/aero_2.png",
        aero_3: "resources/images/weapon/aero_3.png",
        aero_4: "resources/images/weapon/aero_4.png",
        thander_1: "resources/images/weapon/thander_1.png",
        thander_2: "resources/images/weapon/thander_2.png",
        thander_3: "resources/images/weapon/thander_3.png",
        thander_4: "resources/images/weapon/thander_4.png",
        wolf_1: "resources/images/weapon/wolf_1.png",
        wolf_2: "resources/images/weapon/wolf_2.png",
      },
    },
    {
      name: "background",
      assets: {
        background_1: "resources/images/background/background_1.jpeg",
        background_2: "resources/images/background/background_2.png",
        background_3: "resources/images/background/background_3.png",
        background_4: "resources/images/background/background_4.png",
        sky_1: "resources/images/background/sky_1.png",
        ground_1: "resources/images/background/ground_1.png",
        ground_2: "resources/images/background/ground_2.png",
      },
    },
    {
      name: "ui",
      assets: {
        bar_1: "resources/images/ui/bar_1.png",
        bar_2: "resources/images/ui/bar_2.png",
        panel_background: "resources/images/ui/panel_background.png",
        panel_background2: "resources/images/ui/panel_background2.png",
        panel_background3: "resources/images/ui/panel_background3.png",
        status_bar: "resources/images/ui/statusbar.png",
        money: "resources/images/ui/money.png",
        opening: "resources/images/ui/opening.jpg",
        map: "resources/images/ui/map.png",
      },
    },
    {
      name: "sound",
      assets: {
        field1: "sound/bgm/field1.m4a",
        desert: "sound/bgm/desert.m4a",
        win: "sound/bgm/Short_RPG_06.mp3",
        failed: "sound/bgm/Short_Gothic_09.mp3",
        town: "sound/bgm/Town.mp3",
        title: "sound/bgm/Opening.m4a",
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
        se_level_up: "sound/se/level_up.mp3",
        se_defense: "sound/se/defense.mp3",
        se_menu: "sound/se/menu.mp3",
        se_tap: "sound/se/tap.mp3",
      },
    },
  ],
};
