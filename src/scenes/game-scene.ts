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
import { StageInfo, Stages } from "./scene-master";
import { UpText } from "../control/up-text";
import { GameSceneStatusBar } from "../control/game-scene-status-bar";

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
      type: "戦士",
      weapons: ["スマッシュ", "ガード"],
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
  private _tilingSprite: Array<TilingSprite> = [];
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
  private _fadeOutHeros: boolean = false;
  private _fadeOutHerosCount: number = 0;
  private _statusBar?: GameSceneStatusBar;
  private _getMoney: number = 0;

  constructor(parentWidth: number, parentHeight: number) {
    super();
    this._parentWidth = parentWidth;
    this._parentHeight = parentHeight;
  }

  private get _stageInfo(): StageInfo {
    return Stages.find((s) => s.name === SceneManager.CurrentStageName)!;
  }

  load(): void {
    this._enemy = [];
    this._nextEnemy = getRandom(400);

    sound.stopAll();
    sound.play(this._stageInfo.sound.resourceName, { loop: true });
    this.loadBackground();
    this.setHeros();
    this.addCommandButton();
    this.addStatusBar();
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
        new GameScene(SceneManager.width, SceneManager.height),
        "草原"
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
          if (this._fadeOutHeros) return false;
          const hero = this._hero[index];
          if (hero.isDead()) return false;
          hero.loadAttack(w);
          if (weaponConfig.targetType != "敵") {
            this._heroPanels.forEach((p, index) => {
              p.update(this._hero[index].restLife());
            });
          }
          return true;
        });
        this.addChild(b);
        this._heroCommands.push(b);
        i++;
      });
    });
  }

  private addStatusBar() {
    this._statusBar = new GameSceneStatusBar(this._stageInfo.endCount);
    this.addChild(this._statusBar!);
  }

  public requestAddChild(obj: Container): void {
    this.addChild(obj);
  }

  public requestRemoveChild(obj: Container): void {
    this.removeChild(obj);
  }

  loadBackground(): void {
    this._stageInfo.background.forEach((backgroundInfo) => {
      const texture = Texture.from(backgroundInfo.resourceName);
      const tile = new TilingSprite(
        texture,
        this._parentWidth,
        backgroundInfo.height * SceneManager.scale
      );
      tile.tileScale = {
        x: SceneManager.scale,
        y: SceneManager.scale,
      };
      if (backgroundInfo.fromTop) {
        tile.position.y = backgroundInfo.offsetY * SceneManager.scale;
      } else {
        tile.position.y =
          this._parentHeight - backgroundInfo.offsetY * SceneManager.scale;
      }
      this.addChild(tile);
      this._tilingSprite.push(tile);
    });
  }

  private _bossLifeGage?: BossLifeGage;
  loadEnemy(): void {
    if (this._isAppearBoss) return;
    let type: EnemyType;

    if (!this._isAppearBoss && this._frameCount > this._stageInfo.boss.count) {
      type = this._stageInfo.boss.type;
      this._isAppearBoss = true;

      this._bossLifeGage = new BossLifeGage(
        type,
        this._parentWidth / 5,
        0,
        (3 * this._parentWidth) / 5,
        48
      );
      this.addChild(this._bossLifeGage);
    } else {
      const max = this._stageInfo.enemy.reduce((a, b) => a + b.rate, 0);
      const tmp = getRandom(max);
      let count = 0;
      for (let i = 0; i < this._stageInfo.enemy.length; i++) {
        count += this._stageInfo.enemy[i].rate;
        if (tmp <= count) {
          type = this._stageInfo.enemy[i].type;
          break;
        }
      }
    }

    const enemy = EnemyFactory.CreateEnemy(
      type!,
      this._parentWidth,
      this._parentHeight
    );
    this._enemy.push(enemy);
    enemy.load((obj) => {
      this.removeChild(obj);
      this._enemy.splice(this._enemy.indexOf(enemy), 1);
      if (type == this._stageInfo.boss.type) {
        if (SceneManager.CurrentStageName == "砂漠") {
          this.showReload();
        } else {
          this._fadeOutHeros = true;
        }
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
    if (!this._isHitted && !this._fadeOutHeros) {
      this._stageInfo.background.forEach((back, index) => {
        this._tilingSprite[index].tilePosition.x -= back.movePower;
      });
      this._statusBar!.update(framesPassed);
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
      this._nextEnemy = getRandom(this._stageInfo.nextEnemyCount) + 10;
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
    if (this._fadeOutHeros) {
      this._hero.forEach((h) => {
        h.move(framesPassed * 4, 0);
      });
      this._fadeOutHerosCount += framesPassed;
      if (this._fadeOutHerosCount > 200) {
        SceneManager.changeScene(
          new GameScene(SceneManager.width, SceneManager.height),
          "砂漠"
        );
      }
    }
  }

  enemyHitTest(): void {
    let exp = 0;
    let money = 0;
    this._hero.forEach((hero) => {
      const result = hero.attackHitTest(this._enemy);
      exp += result.exp;
      money += result.money;
    });
    if (money) {
      this._getMoney += money;
      this._statusBar!.updateMoney(this._getMoney);
    }
    if (exp) {
      let isChangeLevel = false;
      GameScene._unitInfo.forEach((u, index) => {
        if (!this._hero[index].isDead()) {
          u.exp += exp;
          const newLevel = HeroModel.judgeLevel(u.exp);
          if (newLevel != u.level) {
            isChangeLevel = true;
            u.level = newLevel;
            this._heroPanels[index].updateText();
            this._hero[index].levelUp();

            UpText.ShowText(
              strings.getString("レベルアップ"),
              this._heroPanels[index].Coordinate.x + 6,
              this._heroPanels[index].Coordinate.y,
              {
                fill: ["#ffffff", "#9999ff"],
                speed: 1,
              }
            );
          }
        }
      });
      if (isChangeLevel) {
        sound.play("se_level_up", { loop: false });
      }
    }
  }

  heroHitTest(): void {
    this._isHitted = false;
    this._enemy.forEach((e) => {
      e.stop(false);
      this._hero.forEach((hero) => {
        if (hero.isHit(e)) {
          const value = e.attackPower - hero.defencePower;
          if (value > 0) {
            hero.damaged(e.attackPower, true);
          }
          e.stop(true);
          this._isHitted = true;
        }
      });
      e.attackHitTest(this._hero);
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
