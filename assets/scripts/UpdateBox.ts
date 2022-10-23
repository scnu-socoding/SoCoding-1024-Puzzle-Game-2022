import { _decorator, Component, Node, RigidBody2D, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UpdateBox')
export class UpdateBox extends Component {

    rigidBody: RigidBody2D = null;

    start() {
        this.rigidBody = this.node.parent.getComponent(RigidBody2D);
    }

    update(deltaTime: number) {
        if (this.rigidBody.node.worldPosition.y < -1000 || this.rigidBody.node.worldPosition.y > 10000
            || this.rigidBody.node.worldPosition.x > 4000 || this.rigidBody.node.worldPosition.x < -4000) {
            this.rigidBody.node.setWorldPosition(v3((Math.random() - 0.5) * 2 * 2000, 1500));
            this.rigidBody.linearVelocity.set(this.rigidBody.linearVelocity.divide2f(10, 10));
        }
    }
}

