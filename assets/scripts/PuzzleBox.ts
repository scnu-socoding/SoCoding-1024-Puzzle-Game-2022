import { _decorator, Component, Node, Label, BoxCollider2D, RigidBody2D, UITransform, Sprite, Texture2D, ImageAsset, assetManager, SpriteFrame, size, PhysicsSystem2D, tween, v3, quat, Vec3, color } from 'cc';
import { Main } from '../scenes/Main';
import WebUtil from './util/WebUtil';
const { ccclass, property } = _decorator;

@ccclass('PuzzleBox')
export class PuzzleBox extends Component {

    UITransform: UITransform = null;
    label: Label = null;
    boxCollider: BoxCollider2D = null;
    rigidBody: RigidBody2D = null;

    @property(Node)
    spriteSplash: Node = null;

    @property(Sprite)
    sprite: Sprite = null;

    basicData: any = null;

    data: {
        "code"?: number,
        "problem_id"?: number,
        "template"?: number,
        "title"?: string,
        "description"?: string,
        "tips"?: string,
        "pass_count"?: number,
        "is_pass"?: boolean,
        "message"?: string
    } = null;

    start() {
        this.UITransform = this.getComponent(UITransform);
        this.label = this.getComponent(Label);
        this.boxCollider = this.getComponent(BoxCollider2D);
        this.rigidBody = this.getComponent(RigidBody2D);

        this.node.setWorldPosition((Math.random() - 0.5) * 2 * 2000, 2500, 0);

        this.rigidBody.enabled = false;

        this.updateBasic(this.data);

        PhysicsSystem2D.instance.fixedTimeStep = 1 / 120;
        PhysicsSystem2D.instance.velocityIterations = 60;
        PhysicsSystem2D.instance.positionIterations = 60;
    }

    updateBasic(data) {

        this.basicData = data;

        this.label.string = `#${data.problem_id}: ${data.problem_title}`;
        this.label.updateRenderData();
        this.label.updateRenderer();
        this.boxCollider.size = this.UITransform.contentSize.clone();

        this.boxCollider.apply();

        this.updateALL(this.data.problem_id);

        console.log("loaded basic" + data.problem_id);

    }

    updateBasicAfterStart(data) {

        this.data = data;

    }

    updateALL(id: number) {

        (async () => {
            this.data = await Main.getProblemDetail(Main.UUID, id.toString());

            console.log("loaded all " + this.data.problem_id);

            if (this.data.description.startsWith("data:image")) {
                assetManager.loadRemote(this.data.description, { ext: '.png' }, (err, asset: ImageAsset) => {
                    this.sprite.spriteFrame = SpriteFrame.createWithImage(asset);
                    let spriteUITransform = this.sprite.getComponent(UITransform);
                    // let radio = spriteUITransform.contentSize.x / spriteUITransform.contentSize.y;
                    // spriteUITransform.setContentSize(size(this.UITransform.contentSize.x, this.UITransform.contentSize.x / radio));

                    this.boxCollider.size = spriteUITransform.contentSize.clone();
                    this.boxCollider.apply();

                    this.sprite.node.setScale(0, 0, 0)
                    tween(this.sprite.node).to(0.5, { scale: v3(1, 1, 1) }, { easing: 'circOut' }).start();

                    tween(this.spriteSplash).to(0.5, { scale: v3(0, 0, 0) }, { easing: 'circOut' }).call(() => {
                        this.spriteSplash.active = false;
                        this.label.enabled = false;
                    }).start();

                    this.rigidBody.enabled = true;

                })
            } else {
                Main.alert(this.data.description);
            }

            // TODO
        })();

    }

    async onClick() {

        if (Main.selectPuzzleNode.children.length === 1) {
            if (Main.selectPuzzleNode.children[0] !== this.node) {
                return;
            }
        }

        if (this.rigidBody.enabled === false) {
            tween(this.node).to(0.5, { scale: v3(0, 0, 0) }, { easing: 'circOut' })
                .call(() => {
                    this.node.setParent(Main.puzzlesNode);
                    this.rigidBody.enabled = true;

                    this.node.setScale(0.5, 0.5, 1);
                    this.node.setWorldPosition(v3(0, 3000, 0));

                    // tween(Main.splashBG).to(1, { color: color(0, 0, 0, 0) }, { easing: 'circOut' }).start();

                }).start();
        } else {

            this.rigidBody.enabled = false;


            this.node.setParent(Main.selectPuzzleNode);

            // tween(Main.splashBG).to(1, { color: color(0, 0, 0, 255) }, { easing: 'circOut' }).start();

            //  window.open(this.data.description, '_blank');

            const img = new Image()
            img.src = this.data.description
            const newWin = window.open('', '_blank')
            newWin.document.write(img.outerHTML)
            newWin.document.title = this.data.title
            newWin.document.close()

            Main.instance.mRankLabel.string = JSON.stringify(await Main.my_rank(Main.UUID))
                + JSON.stringify(this.basicData);

            tween(this.node).to(1, { position: v3(0, 0, 0) }, { easing: 'circOut' }).start();
            tween(this.node).to(3, { angle: 0 }, { easing: 'circOut' }).start();
        }

    }



    update(deltaTime: number) {

    }
}

