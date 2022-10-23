import { _decorator, Component, Node, Label, PageView, PhysicsSystem2D, macro, Prefab, instantiate } from 'cc';
import { PuzzleBox } from '../scripts/PuzzleBox';
import { Util } from '../scripts/util/Util';
import WebUtil from '../scripts/util/WebUtil';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property(Label)
    timeLabel: Label = null;

    @property(PageView)
    pageView: PageView = null;

    @property(Label)
    public mInfoLabel: Label = null;

    @property(Label)
    public mUUIDLabel: Label = null;

    @property(Prefab)
    public puzzleBoxPrefab: Prefab = null;

    @property(Node)
    public puzzleBoxContainer: Node = null;

    started = false;

    public static infoLabel: Label = null;
    public static uuidLabel: Label = null;
    public static UUID: string = null;

    start() {
        PhysicsSystem2D.instance.enable = false;
        this.updateTimeLable();
        this.schedule(this.updateTimeLable, 1000, macro.REPEAT_FOREVER, 0);

        Main.infoLabel = this.mInfoLabel;
        Main.uuidLabel = this.mUUIDLabel;

        Main.updateALLInfoNode();

        // this.pageView.node.on(PageView.EventType.SCROLL_BEGAN, (event) => {
        //     if (this.started) {
        //         PhysicsSystem2D.instance.enable = false;
        //     }

        // });

        // this.pageView.node.on(PageView.EventType.SCROLL_ENDED, (event) => {
        //     if (this.started) {
        //         PhysicsSystem2D.instance.enable = true;
        //     }
        // });

        (async () => {
            let uuid = WebUtil.getCookie('uuid');
            Main.UUID = uuid;

            if (uuid) {
                let list = await Main.getProblemList(uuid);
                if (!list.problems) {
                    return;
                }
                for (let i of list.problems) {
                    type ProblemData = {
                        is_pass: boolean,
                        pass_count: number,
                        problem_id: number,
                        problem_title: string,
                        template: number
                    }

                    console.log(i);

                    let data = i as ProblemData;

                    let node: Node = instantiate(this.puzzleBoxPrefab);
                    this.puzzleBoxContainer.addChild(node);
                    let puzzleBox: PuzzleBox = node.getComponent(PuzzleBox);
                    puzzleBox.updateBasicAfterStart(data);
                }
            }
        })();
    }

    updateTimeLable() {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        this.timeLabel.string = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }

    onStartButtonClick() {
        // 

        this.started = true;
        PhysicsSystem2D.instance.enable = true;
    }

    onSubmitButtonClick() {
        this.pageView.scrollToPage(1, 1);
    }

    update(deltaTime: number) {

    }

    initInputTag() {
        let inputs = document.getElementsByClassName('cocosEditBox');
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i] as HTMLInputElement;
            input.setAttribute('autocomplete', "off");
        }
    }

    public static async updateALLInfoNode() {
        let uuid = WebUtil.getCookie('uuid');

        if (uuid) {
            Main.uuidLabel.string = "token{" + uuid + "}";
            Main.infoLabel.string = await Main.getInfo(uuid);
        }
    }

    public static async register(username: string) {
        const url = 'https://1024.hunyl.com/user/register';
        let data = "username=" + username;

        try {
            let json = await WebUtil.postData(url, data);

            console.log(json);

            let message = json.message;
            let uuid = json.uuid;

            uuid && WebUtil.setCookie('uuid', uuid.toString());
            uuid && (Main.UUID = uuid.toString());

            if (uuid) {
                return "注册成功，你获得了\ntoken{" + uuid + "}\n妥善保管且不要以任何方式泄露给他人";
            }

            if (!message) {
                return "不知道为啥，注册失败了";
            }

            return message;

        } catch (error) {
            return "网络错误";
        }
    }

    public static async updateInfo(uuid: string, email: string, phone: string, student_code: string) {
        const url = 'https://1024.hunyl.com/user/update';
        let data = "uuid=" + uuid + "&email=" + email + "&phone=" + phone + "&student_code=" + student_code;

        try {
            let json = await WebUtil.postData(url, data);

            console.log(json);

            let message = json.message;

            if (!message) {
                return "不知道为啥，更新用户信息失败了";
            }

            return message;

        } catch (error) {
            return "网络错误";
        }
    }

    public static async getInfo(uuid: string) {
        const url = 'https://1024.hunyl.com/user/info';
        let data = "uuid=" + uuid;

        try {
            let json = await WebUtil.postData(url, data);

            console.log(json);

            return JSON.stringify(json);

        } catch (error) {
            return "网络错误";
        }
    }

    public static async getProblemList(uuid: string) {
        const url = 'https://1024.hunyl.com/problem/list';
        let data = "uuid=" + uuid;

        try {
            let json = await WebUtil.postData(url, data);

            console.log(json);

            return json;

        } catch (error) {
            return "网络错误";
        }
    }

    public static async getProblemDetail(uuid: string, problem_id: string) {
        const url = 'https://1024.hunyl.com/problem/detail';
        let data = "uuid=" + uuid + "&problem_id=" + problem_id;

        try {
            let json = await WebUtil.postData(url, data);

            console.log(json);

            return json;

        } catch (error) {
            return "网络错误";
        }
    }

    public static async submit(uuid: string, problem_id: string, answer: string) {
        const url = 'https://1024.hunyl.com/problem/submit';
        let data = "uuid=" + uuid + "&problem_id=" + problem_id + "&answer=" + answer;

        try {
            let json = await WebUtil.postData(url, data);

            console.log(json);

            return json;

        } catch (error) {
            return "网络错误";
        }
    }

    public static async rank() {
        const url = 'https://1024.hunyl.com/rank/list';

        try {
            let json = await WebUtil.getData(url);

            console.log(json);

            return json;

        } catch (error) {
            return "网络错误";
        }
    }

    public static async my_rank(uuid: string) {
        const url = 'https://1024.hunyl.com/rank/my';
        let data = "uuid=" + uuid;

        try {
            let json = await WebUtil.postData(url, data);

            console.log(json);

            return json;

        } catch (error) {
            return "网络错误";
        }
    }

    public static alert(str: string) {
        alert(str);
    }

    copyUUID() {
        let uuid = WebUtil.getCookie('uuid');
        try {
            Util.copyToClip(uuid);
            Main.alert("复制到剪贴板了捏");
        } catch (e) {
            Main.alert("复制失败" + e);
        }
    }
}

