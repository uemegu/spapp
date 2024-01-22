import type { ResolverManifest } from "pixi.js";

export const manifest: ResolverManifest = {
  bundles: [
    {
      name: "hero",
      assets: {
        hero_walk_1: "resources/images/hero/hero_walk_1.png",
        wizard_walk_1: "resources/images/hero/wizard_walk_1.png",
        priest_walk_1: "resources/images/hero/priest_walk_1.png",
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
      },
    },
    {
      name: "weapon",
      assets: {
        sword_1: "resources/images/weapon/sword_1.png",
        sword_2: "resources/images/weapon/sword_2.png",
        sword_3: "resources/images/weapon/sword_3.png",
        sword_4: "resources/images/weapon/sword_4.png",
        fire_1: "resources/images/weapon/fire_1.png",
        heal_1: "resources/images/weapon/heal_1.png",
      },
    },
    {
      name: "background",
      assets: {
        background_1: "resources/images/background/background_1.jpeg",
        background_2: "resources/images/background/maptile_sogen_01.png",
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
        "forklift-effect": "sound/forklift-effect.wav",
      },
    },
  ],
};
