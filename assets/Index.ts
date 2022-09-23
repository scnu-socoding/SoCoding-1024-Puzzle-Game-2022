import { _decorator, Component, Node, director, Label, Sprite, assetManager, view } from 'cc';
import { Util } from './scripts/util/Util';
const { ccclass, property } = _decorator;

@ccclass('Index')
export class Index extends Component {

    @property(Label)
    label: Label = null;

    @property(Label)
    label2: Label = null;

    @property(Sprite)
    image: Sprite = null;

    @property(Node)
    logo: Node = null;

    onLoad() {
        view.resizeWithBrowserSize(true);
    }

    update(deltaTime: number) {

    }

    start() {

        let scene = Util.getQueryVariable()['s'];
        if (typeof scene !== 'string' || scene === 'Index') {
            scene = 'Main';
        }

        let err = true;

        try {
            director.preloadScene(scene, (completedCount: number, totalCount: number, item: any) => {
                err = false;
                this.label.string = `${completedCount} / ${totalCount} 正在加载`;
                this.label2.string = item.uuid;
                this.image.fillRange = completedCount / totalCount;
            }, (error: Error) => {
                if (error) {
                    this.label.string = `无法加载场景 ${scene}`;
                } else {
                    director.loadScene(scene);
                }
            });
        } catch {
            this.label.string = `无法加载场景 ${scene}`;
        }

        this.scheduleOnce(() => {
            if (err) {
                this.label.string = `无法加载场景 ${scene}`;
            }
        }, 3);

    }
}

