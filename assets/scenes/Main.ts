import { _decorator, Component, Node, Label, PageView, PhysicsSystem2D, macro, Prefab, instantiate, Sprite } from 'cc';
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

    @property(Label)
    public mRankLabel: Label = null;

    @property(Prefab)
    public puzzleBoxPrefab: Prefab = null;

    @property(Node)
    public puzzleBoxContainer: Node = null;

    @property(Label)
    public startButtonLabel: Label = null;

    @property(Node)
    mPuzzles: Node = null;

    @property(Node)
    mSelectPuzzle: Node = null;

    @property(Sprite)
    public mSplashBg: Sprite = null;

    @property(Node)
    rigNode: Node = null;

    @property(Node)
    subNode: Node = null;


    started = false;

    public static instance: Main = null;

    public static infoLabel: Label = null;
    public static uuidLabel: Label = null;
    public static UUID: string = null;
    public static puzzlesNode: Node = null;
    public static selectPuzzleNode: Node = null;
    public static splashBG: Sprite = null;

    start() {
        PhysicsSystem2D.instance.enable = false;
        this.updateTimeLable();
        this.schedule(() => this.updateTimeLable(), 1000, macro.REPEAT_FOREVER, 0);

        Main.instance = this;

        Main.infoLabel = this.mInfoLabel;
        Main.uuidLabel = this.mUUIDLabel;
        Main.puzzlesNode = this.mPuzzles;
        Main.selectPuzzleNode = this.mSelectPuzzle;
        Main.splashBG = this.mSplashBg;

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

        this.getPuzzles();

    }

    getPuzzles() {
        (async () => {
            let uuid = WebUtil.getCookie('uuid');
            Main.UUID = uuid;

            if (uuid) {

                this.subNode.active = true;
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

                this.mInfoLabel.string = JSON.stringify(await Main.getInfo(uuid));
                this.mRankLabel.string = JSON.stringify(await Main.my_rank(uuid));
            } else {
                this.rigNode.active = true;
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


        if (this.started === true) {
            this.startButtonLabel.string = "启动";
            this.started = false;
            PhysicsSystem2D.instance.enable = false;
        } else {
            this.startButtonLabel.string = "暂停";
            this.started = true;
            PhysicsSystem2D.instance.enable = true;
        }



    }

    onSubmitButtonClick() {
        this.pageView.scrollToPage(1, 1);
    }

    update(deltaTime: number) {
        this.updateTimeLable();
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
        let data = encodeURI("uuid=" + uuid + "&email=" + email + "&phone=" + phone + "&student_code=" + student_code);

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

            return json;

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

            return json.message;

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
            Main.alert("token 复制到剪贴板了捏，请一定要妥善保管，不要泄露给其他人");
        } catch (e) {
            Main.alert("复制失败" + e);
        }
    }


    public static activeUpdateInfo() {
        Main.alert("要输入真实信息哦，不然没办法验证你的身份，也没办法联系你哦");

        let email = prompt("请输入你的邮箱");
        let phone = prompt("请输入你的手机号");
        let student_code = prompt("请输入你的学号");

        if (email && phone && student_code) {
            Main.updateInfo(Main.UUID, email, phone, student_code).then((message) => {
                Main.alert(message);
            });
        }
    }
}

