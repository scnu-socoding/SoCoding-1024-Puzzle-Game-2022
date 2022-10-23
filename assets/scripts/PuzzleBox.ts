import { _decorator, Component, Node, Label, BoxCollider2D, RigidBody2D, UITransform } from 'cc';
import { Main } from '../scenes/Main';
import WebUtil from './util/WebUtil';
const { ccclass, property } = _decorator;

@ccclass('PuzzleBox')
export class PuzzleBox extends Component {

    UITransform: UITransform = null;
    label: Label = null;
    boxCollider: BoxCollider2D = null;
    rigidBody: RigidBody2D = null;

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

        this.updateBasic(this.data);
    }

    updateBasic(data) {

        this.label.string = `#${data.problem_id}: ${data.problem_title}`;
        this.label.updateRenderData();
        this.label.updateRenderer();
        this.boxCollider.size = this.UITransform.contentSize;


        this.updateALL(this.data.problem_id);

    }

    updateBasicAfterStart(data) {

        this.data = data;

    }

    updateALL(id: number) {

        (async () => {
            this.data = await Main.getProblemDetail(Main.UUID, id.toString());

            this.label.string = `#${this.data.problem_id}: ${this.data.title}`;
            this.label.updateRenderData();
            this.label.updateRenderer();
            this.boxCollider.size = this.UITransform.contentSize;
        })();

    }



    update(deltaTime: number) {

    }
}

