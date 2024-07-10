import { ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d-compat";
import PF from "pathfinding";

export default class Enemy {
	position = { x: 0, y: 0, z: 0 };
	rotation = { x: 0, y: 0, z: 0, w: 0 };

	constructor(initialLocation, world) {
		this.position = initialLocation;
		this.init(world);
	}

	get position() {
		return this.body.translation();
	}

	get rotation() {
		return this.body.rotation();
	}

	get linvel() {
		return this.body.linvel();
	}

	get isMoving() {
		return this.body.isMoving();
	}

	init(world) {
		const enemyCollider = ColliderDesc.capsule(0.8, 0.3);
		const enemy = world.createRigidBody(
			RigidBodyDesc.dynamic().setTranslation(
				this.position.x,
				this.position.y,
				this.position.z,
			),
		);
		enemy.setEnabledRotations(false, false, false);
		const enemyChar = world.createCollider(enemyCollider, enemy);

		this.body = enemy;
		this.handle = enemyChar.handle;
		this.world = world;

		this.wander();
	}

	disconnect() {
		this.world.removeRigidBody(this.world.bodies.get(this.handle));
	}

	wander() {
		const SPEED = 3;
		const DELAY = Math.random() * 3000;
		this.wanderId = setInterval(() => {
			const x = (Math.random() - 0.5) * SPEED;
			const z = (Math.random() - 0.5) * SPEED;
			this.body.applyImpulse({ x: x, y: 0, z: z }, true);
		}, DELAY);
	}

	stopWander() {
		clearInterval(this.wanderId);
	}

	chase(targetPos) {}

	static enemyFactory(num, world) {
		return new Array(num).fill(null).map(() => {
			const pos = {
				x: Math.random() * 50,
				y: 5,
				z: Math.random() * 50,
			};
			return new Enemy(pos, world);
		});
	}
}
