import { assetManager, Camera, EventTouch, log, Node, physics, PhysicsSystem, randomRangeInt, tween, TweenEasing, v3 } from "cc";

export class Util {

    public static log(...args: any[]): void {
        log(...args);
    }

    // 处理所有的射线相交
    public static processTouchRayCastAll(camera: Camera, event: EventTouch,
        callback: (event: EventTouch, element: physics.PhysicsRayResult) => void) {
        let ray = camera.screenPointToRay(event.getLocation().x, event.getLocation().y);

        if (PhysicsSystem.instance.raycast(ray)) {
            const result = PhysicsSystem.instance.raycastResults;
            for (let element of result) {
                if (element.collider === null) {
                    Util.log('没有检测到碰撞体');
                    return;
                }
                callback(event, element);
            }
        }
    }

    // 处理最近的射线相交
    public static processTouchRayCastClosest(camera: Camera, event: EventTouch,
        callback: (event: EventTouch, element: physics.PhysicsRayResult) => void) {
        let ray = camera.screenPointToRay(event.getLocation().x, event.getLocation().y);

        if (PhysicsSystem.instance.raycastClosest(ray)) {
            const element = PhysicsSystem.instance.raycastClosestResult;
            if (element.collider === null) {
                Util.log('没有检测到碰撞体');
                return;
            }
            callback(event, element);
        }
    }

    // 列表中随机选择
    public static randomChoice<T>(array: T[]): T {
        return array[randomRangeInt(0, array.length)];
    }

    // 数字缓动
    public static tweenNumber(duration: number,
        from: number, to: number,
        callback: (num: number) => void, easing: TweenEasing = 'smooth') {
        let numObj = { num: from };
        tween(numObj)
            .to(duration,
                { num: to },
                {
                    easing: easing,
                    onUpdate: () => callback(numObj.num)
                })
            .start();
    }

    //  缓动销毁
    public static tweenDestroy(duration: number, node: Node, callback: () => void) {
        tween(node).to(duration, { scale: v3(0, 0, 0) }, { easing: 'quartOut' }).call(() => {
            // Util.log('销毁', node);
            node.destroy();
            callback && callback();
        }).start();
    }

    public static getQueryVariable(): object {
        let obj = Object.create(null);

        if (!window?.location) {
            return obj;
        }

        let query = window.location.search.substring(1);
        let vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            obj[pair[0]] = pair[1];
        }
        return obj;
    }

    public static getSceneURLs() {
        let urls = [];
        assetManager.bundles.get('main').config.scenes.forEach((v) => { urls.push(v.url) })
        return urls;
    }

    public static copyToClip1(content) {
        var aux = document.createElement("input");
        aux.setAttribute("value", content);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
    }

    public static async copyToClip2(content) {
        await navigator.clipboard.writeText(content)
    }

    public static copyToClip(content) {
        try {
            this.copyToClip1(content);
        }
        catch {
            this.copyToClip2(content);
        }
    }

}

