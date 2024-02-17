import { Container, Texture, TilingSprite } from "pixi.js";
import { IScene, SceneManager } from "../shared/scene-manager";
import { HeroModel } from "../model/hero/hero-common";
import { getRandom } from "../util";
import { EnemyModel } from "../model/enemy/ememy-common";
import {
  EnemyType,
  HeroConfig,
  HeroType,
  ModelConfig,
  WeaponConfig,
  WeaponType,
} from "../model/model-types";
import { sound } from "@pixi/sound";
import { EnemyFactory } from "../model/enemy/enemy-factory";
import { SkillButton } from "../control/indicator-button";
import { Button } from "../control/button";
import { strings } from "../strings";
import { BossLifeGage } from "../control/boss-life-gage";
import { HeroPanel } from "../control/hero-panel";

export interface UnitInfo {
  type: HeroType;
  weapons: Array<WeaponType>;
  exp: number;
  level: number;
}

export class GameScene extends Container implements IScene {
  // TODO
  private static _unitInfo: Array<UnitInfo> = [
    {
      type: "勇者",
      weapons: ["スマッシュ", "ソニックブーム"],
      exp: 0,
      level: 1,
    },
    {
      type: "アーチャー",
      weapons: ["ショット", "ロングショット"],
      exp: 0,
      level: 1,
    },
    {
      type: "魔法使い",
      weapons: ["ファイア", "サンダー"],
      exp: 0,
      level: 1,
    },
    {
      type: "僧侶",
      weapons: ["ヒール", "エアロ"],
      exp: 0,
      level: 1,
    },
  ];

  private _hero!: Array<HeroModel>;
  private _heroCommands: Array<SkillButton> = [];
  private _heroPanels: Array<HeroPanel> = [];
  private _enemy!: Array<EnemyModel>;
  private _tilingSprite!: TilingSprite;
  private _tilingSprite2!: TilingSprite;
  private _tilingSprite3!: TilingSprite;
  private _counter: number = 0;
  private _nextEnemy: number = 0;
  private _parentWidth: number;
  private _parentHeight: number;
  private _gameover: boolean = false;
  private _frameCount: number = 0;
  private _suspend: boolean = false;
  private _isHitted: boolean = false;
  private _isAppearBoss = false;
  private _boss?: EnemyModel;

  constructor(parentWidth: number, parentHeight: number) {
    super();
    this._parentWidth = parentWidth;
    this._parentHeight = parentHeight;
  }

  load(): void {
    this._enemy = [];
    this._nextEnemy = getRandom(400);

    sound.stopAll();
    sound.play("field1", { loop: true });
    this.loadBackground();
    this.setHeros();
    this.addCommandButton();
  }

  private setHeros(): void {
    this._hero = [];
    GameScene._unitInfo.forEach((u, index) => {
      const hero = new HeroModel(u.type, this._parentWidth, this._parentHeight);
      this._hero.push(hero);
      hero.setTeam(this._hero);
      hero.load((_) => {
        if (!this._hero.find((h) => !h.isDead())) {
          this._gameover = true;
          this.showReload();
        }
        this._heroCommands
          .filter((b) => b.getHeroType() === u.type)
          .forEach((b) => b.disable());
      });
      hero.move(
        this._parentWidth / 2 -
          120 * SceneManager.scale -
          60 * index * SceneManager.scale,
        this._parentHeight - 190 * SceneManager.scale
      );
    });
  }

  private showReload(): void {
    const button = new Button(
      strings.getString("もう1回"),
      SceneManager.width / 2 - 60,
      SceneManager.height / 2
    );
    button.setCallback(() => {
      SceneManager.changeScene(
        new GameScene(SceneManager.width, SceneManager.height)
      );
    });
    this.addChild(button);
  }

  private addCommandButton(): void {
    const sum = GameScene._unitInfo
      .map((a, b) => a.weapons.length)
      .reduce((a, b) => a + b);
    let i = 0;
    GameScene._unitInfo.forEach((u, index) => {
      const heroConfig = ModelConfig.find(
        (c) => c.type === u.type
      ) as HeroConfig;
      const p = new HeroPanel(
        u,
        (i * this._parentWidth) / sum,
        this._parentHeight - 120 * SceneManager.scale,
        this._parentWidth / GameScene._unitInfo.length,
        40 * SceneManager.scale
      );
      this.addChild(p);
      this._heroPanels.push(p);
      u.weapons.forEach((w) => {
        const weaponConfig = ModelConfig.find(
          (c) => c.type === w
        ) as WeaponConfig;
        const b = new SkillButton(
          heroConfig,
          weaponConfig,
          (i * this._parentWidth) / sum,
          this._parentHeight - 80 * SceneManager.scale,
          this._parentWidth / sum,
          80 * SceneManager.scale
        );
        b.setCallback(() => {
          const hero = this._hero[index];
          if (hero.isDead()) return false;
          hero.loadAttack(w);
          return true;
        });
        this.addChild(b);
        this._heroCommands.push(b);
        i++;
      });
    });
  }

  public requestAddChild(obj: Container): void {
    this.addChild(obj);
  }

  public requestRemoveChild(obj: Container): void {
    this.removeChild(obj);
  }

  loadBackground(): void {
    const texture = Texture.from("sky_1");
    this._tilingSprite = new TilingSprite(
      texture,
      this._parentWidth,
      400 * SceneManager.scale
    );
    this._tilingSprite.tileScale = {
      x: SceneManager.scale,
      y: SceneManager.scale,
    };
    this._tilingSprite.position.y = -200 * SceneManager.scale;
    this.addChild(this._tilingSprite);

    const texture3 = Texture.from("background_3");
    this._tilingSprite3 = new TilingSprite(
      texture3,
      this._parentWidth,
      300 * SceneManager.scale
    );
    this._tilingSprite3.tileScale = {
      x: SceneManager.scale,
      y: SceneManager.scale,
    };
    this._tilingSprite3.y = this._parentHeight - 400 * SceneManager.scale;
    this.addChild(this._tilingSprite3);

    const texture2 = Texture.from("ground_1");
    this._tilingSprite2 = new TilingSprite(
      texture2,
      this._parentWidth,
      82 * SceneManager.scale
    );
    this._tilingSprite2.tileScale = {
      x: SceneManager.scale,
      y: SceneManager.scale,
    };
    this._tilingSprite2.y = this._parentHeight - 160 * SceneManager.scale;
    this.addChild(this._tilingSprite2);
  }

  private _bossLifeGage?: BossLifeGage;
  loadEnemy(): void {
    if (this._isAppearBoss) return;
    let type: EnemyType;
    const tmp = getRandom(10);
    if (tmp <= 2) {
      type = "ゴブリン";
    } else if (tmp >= 8) {
      type = "スライム";
    } else {
      type = "ゾンビ";
    }
    if (!this._isAppearBoss && this._frameCount > 2000) {
      type = "ホブゴブリン";
      this._isAppearBoss = true;

      this._bossLifeGage = new BossLifeGage(
        type,
        this._parentWidth / 5,
        0,
        (3 * this._parentWidth) / 5,
        48
      );
      this.addChild(this._bossLifeGage);
    }

    const enemy = EnemyFactory.CreateEnemy(
      type,
      this._parentWidth,
      this._parentHeight
    );
    this._enemy.push(enemy);
    enemy.load((obj) => {
      this.removeChild(obj);
      this._enemy.splice(this._enemy.indexOf(enemy), 1);
      if (type == "ホブゴブリン") {
        this.showReload();
        this.removeChild(this._bossLifeGage!);
        this._bossLifeGage?.destroy();
        this._bossLifeGage = undefined;
      }
    });

    if (this._isAppearBoss) {
      this._boss = enemy;
    }
  }

  update(framesPassed: number): void {
    if (this._suspend) {
      return;
    }
    this._frameCount += framesPassed;
    if (this._gameover) {
      return;
    }
    if (!this._isHitted) {
      this._tilingSprite.tilePosition.x -= 0.1;
      this._tilingSprite2.tilePosition.x -= 1;
      this._tilingSprite3.tilePosition.x -= 0.3;
    }
    this._counter += framesPassed;
    this._hero.forEach((hero) => {
      hero.update(framesPassed);
    });
    this._enemy.forEach((e) => {
      e.update(framesPassed);
    });
    if (this._counter >= this._nextEnemy) {
      this.loadEnemy();
      this._nextEnemy = getRandom(60) + 10;
      this._counter = 0;
    }
    this._enemy.forEach((e) => {
      e.update(framesPassed);
    });
    this.enemyHitTest();
    this.heroHitTest();
    if (this._bossLifeGage) {
      this._bossLifeGage.update(this._boss!.restLife());
    }
    if (this._isHitted) {
      this._heroPanels.forEach((p, index) => {
        p.update(this._hero[index].restLife());
      });
    }
  }

  enemyHitTest(): void {
    let exp = 0;
    this._hero.forEach((hero) => {
      exp += hero.attackHitTest(this._enemy);
    });
    if (exp) {
      GameScene._unitInfo.forEach((u, index) => {
        u.exp += exp;
        const newLevel = HeroModel.judgeLevel(u.exp);
        if (newLevel != u.level) {
          u.level = newLevel;
          this._heroPanels[index].updateText();
        }
      });
    }
  }

  heroHitTest(): void {
    this._isHitted = false;
    this._enemy.forEach((e) => {
      e.stop(false);
      this._hero.forEach((hero) => {
        if (hero.isHit(e)) {
          hero.damaged(e.attackPower, true);
          e.stop(true);
          this._isHitted = true;
        }
      });
      let exp = e.attackHitTest(this._hero);
      GameScene._unitInfo.forEach((u, index) => {});
    });
  }

  resize(parentWidth: number, parentHeight: number): void {
    if (parentWidth > parentHeight) {
      this._suspend = false;
    } else {
      this._suspend = true;
    }
  }

  static getLevel(type: HeroType): number {
    return this._unitInfo.find((u) => u.type === type)!.level;
  }
}
