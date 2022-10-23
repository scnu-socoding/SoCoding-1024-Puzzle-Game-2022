import { _decorator, Component, Node, EditBox, v3, AudioSource, tween, Label } from 'cc';
import { Main } from '../../scenes/Main';
import WebUtil from '../util/WebUtil';
const { ccclass, property } = _decorator;

@ccclass('RigisterButton')
export class RigisterButton extends Component {

    @property(EditBox)
    textEdit: EditBox = null;

    @property(AudioSource)
    audioSource: AudioSource = null;

    @property(Node)
    backNode: Node = null;

    @property(Node)
    muyuNode: Node = null;

    @property(Label)
    label: Label = null;

    scale = 1;

    muyu = 114514;


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

        this.audioSource.play();
        this.muyu--;

        if (this.muyuNode.active === false) {
            this.muyuNode.active = true;
            this.muyuNode.setScale(v3(0, 0, 1));
            tween(this.muyuNode).to(0.5, { scale: v3(1, 1, 1) }, { easing: 'circOut' }).start();
        }

        if (this.backNode.active === true) {
            tween(this.backNode).to(0.2, { scale: v3(0, 0, 1) }, { easing: 'circOut' }).start();
        }

        let gongde = 114514 - this.muyu - 1;

        if (gongde > 80) {
            let uuid = WebUtil.getCookie('uuid');
            if (uuid) {
                Main.alert("你不需要再注册了");
                return;
            }

            let message = await Main.register(this.textEdit.string);
            Main.alert(message);
            
            uuid = Main.UUID;

            Main.uuidLabel.string = "token{" + uuid + "}";
            Main.infoLabel.string = await Main.getInfo(uuid);
        }
        else if (gongde > 70) {
            this.label.string = "看你那么努力\n再点十次就给你注册账号";
        }
        else if (gongde > 40) {
            this.label.string = "功德: " + gongde.toString() + "/1145141919810\n" + "谁让你点那么快了？";
        }
        else if (gongde > 30) {
            this.label.string = "功德: " + gongde.toString() + "/114.514\n" + "嗯，看你那么努力";
        }
        else if (gongde > 20) {
            this.label.string = "你真的达不到那么多功德\n" + "没用的，别点了";
        }
        else if (gongde > 10) {
            this.label.string = "功德: " + gongde.toString() + "/114514\n" + "你已经很努力了，不要再点了";
        }
        else {
            this.label.string = "功德: " + gongde.toString() + "/114514";
        }
    }
}

