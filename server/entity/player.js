import {
	RigidBodyDesc,
	ColliderDesc,
	JointData,
} from "@dimforge/rapier3d-compat";

export default class Player {
	position = { x: 0, y: 0, z: 0 };
	rotation = { x: 0, y: 0, z: 0, w: 0 };

	constructor(initialLocation, id, world) {
		this.position = initialLocation;
		this.id = id;
		this.init(world);
	}

	get linvel() {
		return this.body.linvel();
	}

	init(world) {
		const capsuleSize = { r: 0.2, l: 1 };
		const playerCollider = ColliderDesc.capsule(capsuleSize.l, capsuleSize.r);
		const rightHandCollider = ColliderDesc.ball(0.1);

		this.rightHandBody = world.createRigidBody(
			RigidBodyDesc.dynamic().setTranslation(
				this.position.x,
				this.position.y,
				this.position.z,
			),
		);

		this.body = world.createRigidBody(
			RigidBodyDesc.dynamic().setTranslation(
				this.position.x,
				this.position.y,
				this.position.z,
			),
		);

		this.body.setEnabledRotations(false, true, false);
		this.body.setAngularDamping(10);

		world.createCollider(playerCollider, this.body);
		world.createCollider(rightHandCollider, this.rightHandBody);

		const params = JointData.revolute(
			{ x: -capsuleSize.r + -0.1, y: 0.4, z: 1.0 },
			{ x: 0.0, y: 0.8, z: 0.0 },
			{ x: 1.0, y: 0.0, z: 0.0 },
		);
		this.joint = world.createImpulseJoint(
			params,
			this.body,
			this.rightHandBody,
			true,
		);

		this.handle = this.body.handle;
		this.world = world;
	}

	disconnect() {
		this.world.removeRigidBody(this.world.bodies.get(this.handle));
	}

	formatForSocket() {
		return {
			id: this.id,
			handle: this.handle,
			position: this.position,
			rotation: this.rotation,
			linvel: this.linvel,
		};
	}
}
