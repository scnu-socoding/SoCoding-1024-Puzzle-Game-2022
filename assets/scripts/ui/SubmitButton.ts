import { _decorator, Component, Node, EditBox, v3, AudioSource, tween, Label } from 'cc';
import { Main } from '../../scenes/Main';
import { PuzzleBox } from '../PuzzleBox';
import WebUtil from '../util/WebUtil';
const { ccclass, property } = _decorator;

@ccclass('SubmitButton')
export class SubmitButton extends Component {

    @property(EditBox)
    textEdit: EditBox = null;

    @property(Node)
    backNode: Node = null;

    @property(Label)
    label: Label = null;

    scale = 1;


    start() {
        this.node.setScale(v3(0, 0, 1));
    }

    update(deltaTime: number) {
        if (this.textEdit.string.length > 0) {
            this.scale += (1 - this.scale) * deltaTime * 10;
        } else {
            this.scale += (0 - this.scale) * deltaTime * 10;
        }

        const value = 1.5 * Math.sin(this.scale * 3 * Math.PI / 4);
        this.node.setScale(v3(value, value, 1));
    }

    async onClick() {
        let node = Main.selectPuzzleNode.children[0];
        if (node) {
            let puzzle = node.getComponent(PuzzleBox);
            let id = puzzle.data.problem_id.toString();
            let answer = this.textEdit.string;

            let message = await Main.submit(Main.UUID, id, answer);


            Main.alert(message);
            
            if (message === "用户未完善信息") {
                Main.activeUpdateInfo();
            }

            Main.instance.mRankLabel.string = JSON.stringify(await Main.my_rank(Main.UUID))
            + JSON.stringify(puzzle.basicData);
        }
    }
}

