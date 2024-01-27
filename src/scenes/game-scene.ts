import { Container, Sprite, Texture, TilingSprite } from "pixi.js";
import { IScene } from "../shared/scene-manager";
import { HeroModel } from "../model/hero/hero-common";
import { getRandom } from "../util";
import { EnemyModel } from "../model/enemy/ememy-common";
import { SpriteModel } from "../model/model-share";
import { EnemyType } from "../model/model-types";
import { sound } from "@pixi/sound";
import { EnemyFactory } from "../model/enemy/enemy-factory";

export class GameScene extends Container implements IScene {
  private static instance: GameScene;
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

  constructor(parentWidth: number, parentHeight: number) {
    super();
    GameScene.instance = this;
    sound.play("field1", { loop: true });

    this._parentWidth = parentWidth;
    this._parentHeight = parentHeight;
    this._enemy = [];
    this._nextEnemy = getRandom(400);

    this.loadBackground();

    this._hero = [];
    this._hero.push(
      new HeroModel("勇者", this._parentWidth, this._parentHeight)
    );
    this._hero[0].setWeapon(["剣"]);
    this._hero.push(
      new HeroModel("魔法使い", this._parentWidth, this._parentHeight)
    );
    this._hero[1].setWeapon(["ファイア"]);
    this._hero.push(
      new HeroModel("僧侶", this._parentWidth, this._parentHeight)
    );
    this._hero[2].setWeapon(["ヒール"]);
    this._hero.forEach((hero, index) => {
      hero.setTeam(this._hero);
      hero.load((_) => {
        if (!this._hero.find((h) => !h.isDead())) {
          this._gameover = true;
        }
      });
      hero.move(
        this._parentWidth / 2 - 120 - 100 * index,
        this._parentHeight / 2
      );
    });
  }

  static requestAddChild(obj: Sprite): void {
    GameScene.instance.addChild(obj);
  }

  static requestRemoveChild(obj: Sprite): void {
    GameScene.instance.removeChild(obj);
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
    this._tilingSprite.tilePosition.x -= 1;
    this._counter += framesPassed;
    this._hero.forEach((hero) => {
      hero.update(framesPassed);
    });
    this._enemy.forEach((e) => {
      e.update(framesPassed);
    });
    if (this._counter >= this._nextEnemy) {
      this.loadEnemy();
      this._nextEnemy = getRandom(50) + 10;
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
    this._enemy.forEach((e) => {
      e.stop(false);
      this._hero.forEach((hero) => {
        if (hero.isHit(e)) {
          hero.damaged(e.getAttackPower(), true);
          e.stop(true);
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
