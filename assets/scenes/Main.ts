import { _decorator, Component, Node, Label, PageView } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property(Label)
    timeLabel: Label = null;

    @property(PageView)
    pageView: PageView = null;

    start() {

        this.updateTimeLable();
        this.schedule(this.updateTimeLable, 1000);

    }

    updateTimeLable() {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        this.timeLabel.string = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }

    onStartButtonClick() {
        this.pageView.scrollToPage(1, 1);
    }

    update(deltaTime: number) {

    }
}

