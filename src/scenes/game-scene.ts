import { Container, Texture, TilingSprite } from "pixi.js";
import { IScene, SceneManager } from "../shared/scene-manager";
import { HeroModel } from "../model/hero/hero-common";
import { getRandom } from "../util";
import { EnemyModel } from "../model/enemy/ememy-common";
import {
  EnemyType,
  HeroType,
  ModelConfig,
  WeaponConfig,
  WeaponType,
} from "../model/model-types";
import { sound } from "@pixi/sound";
import { EnemyFactory } from "../model/enemy/enemy-factory";
import { IndicatorButton } from "../control/indicator-button";
import { Button } from "../control/button";
import { strings } from "../strings";

export interface UnitInfo {
  type: HeroType;
  weapons: Array<WeaponType>;
}

export class GameScene extends Container implements IScene {
  // TODO
  private _unitInfo: Array<UnitInfo> = [
    {
      type: "勇者",
      weapons: ["スマッシュ", "ソニックブーム"],
    },
    {
      type: "アーチャー",
      weapons: ["ショット", "ロングショット"],
    },
    {
      type: "魔法使い",
      weapons: ["ファイア", "サンダー"],
    },
    {
      type: "僧侶",
      weapons: ["ヒール", "エアロ"],
    },
  ];

  private _hero!: Array<HeroModel>;
  private _enemy!: Array<EnemyModel>;
  private _tilingSprite!: TilingSprite;
  private _counter: number = 0;
  private _nextEnemy: number = 0;
  private _parentWidth: number;
  private _parentHeight: number;
  private _gameover: boolean = false;
  private _frameCount: number = 0;
  private _suspend: boolean = false;
  private _isHitted: boolean = false;

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
    this._unitInfo.forEach((u) => {
      this._hero.push(
        new HeroModel(u.type, this._parentWidth, this._parentHeight)
      );
    });

    this._hero.forEach((hero, index) => {
      hero.setTeam(this._hero);
      hero.load((_) => {
        if (!this._hero.find((h) => !h.isDead())) {
          this._gameover = true;
          this.showReload();
        }
      });
      hero.move(
        this._parentWidth / 2 - 120 - 60 * index,
        this._parentHeight - 190
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
    this._unitInfo.forEach((u, index) => {
      u.weapons.forEach((w, index2) => {
        const config = ModelConfig.find((c) => c.type === w) as WeaponConfig;
        const b = new IndicatorButton(
          strings.getString(w),
          (index * this._parentWidth) / this._unitInfo.length,
          this._parentHeight - 60 * (index2 + 1),
          this._parentWidth / this._unitInfo.length,
          60,
          config.coolTime
        );
        b.setCallback(() => {
          const hero = this._hero[index];
          if (hero.isDead()) return false;
          hero.loadAttack(w);
          return true;
        });
        this.addChild(b);
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
    const texture = Texture.from("background_1");
    this._tilingSprite = new TilingSprite(
      texture,
      this._parentWidth,
      this._parentHeight
    );
    this._tilingSprite.position._y = this._parentHeight;
    this.addChild(this._tilingSprite);
  }

  private _isAppearBoss = false;
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
      type = "ボブゴブリン";
      this._isAppearBoss = true;
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
      if (type == "ボブゴブリン") {
        this.showReload();
      }
    });
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
      this._tilingSprite.tilePosition.x -= 1;
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
      this._nextEnemy = getRandom(30) + 10;
      this._counter = 0;
    }
    this._enemy.forEach((e) => {
      e.update(framesPassed);
    });
    this.enemyHitTest();
    this.heroHitTest();
  }

  enemyHitTest(): void {
    this._hero.forEach((hero) => {
      hero.attackHitTest(this._enemy);
    });
  }

  heroHitTest(): void {
    this._isHitted = false;
    this._enemy.forEach((e) => {
      e.stop(false);
      this._hero.forEach((hero) => {
        if (hero.isHit(e)) {
          hero.damaged(e.getAttackPower(), true);
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
}
