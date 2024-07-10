import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import {
	vec3,
	quat,
	RigidBody,
	BallCollider,
	useSphericalJoint,
	useRevoluteJoint,
} from "@react-three/rapier";
import { Controls } from "../../hooks/useControls";
import { charactersAtom, myCharHandleAtom, socket } from "../SocketManager";
import DummyModel from "./DummyModel";
import { useAtom } from "jotai";

const Player = () => {
	const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
	const leftPressed = useKeyboardControls((state) => state[Controls.left]);
	const rightPressed = useKeyboardControls((state) => state[Controls.right]);
	const backPressed = useKeyboardControls((state) => state[Controls.back]);
	const forwardPressed = useKeyboardControls(
		(state) => state[Controls.forward],
	);

	const [characters] = useAtom(charactersAtom);
	const [handle] = useAtom(myCharHandleAtom);
	const { position, rotation } = characters[handle];
	const capsuleSize = { r: 0.2, l: 1 };

	const playerPos = vec3();
	const playerQuat = quat();
	const playerLinvel = vec3();
	const playerAngvel = vec3();
	const forward = vec3();
	const upVec = vec3({ x: 0, y: 1, z: 0 });
	const rightVec = vec3();
	const directionVec = vec3();
	const impulse = vec3();
	const torqueImpulse = vec3();
	const mousePos = { x: 0, y: 0 };
	const [mouseup, setMouseup] = useState(true);

	useEffect(() => {
		const handleMouseMove = (e) => {
			mousePos.x = e.movementX;
			mousePos.y = e.movementY;
		};
		const handleMouseClick = (e) => {
			switch (e.type) {
				case "mousedown":
					return setMouseup((state) => !state);
				case "mouseup":
					return setMouseup((state) => !state);
			}
		};
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mousedown", handleMouseClick);
		document.addEventListener("mouseup", handleMouseClick);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mousedown", handleMouseClick);
			document.removeEventListener("mouseup", handleMouseClick);
		};
	});

	const model = useRef(null);
	const player = useRef(null);
	const onFloor = useRef(false);
	const offset = vec3({ x: 0, y: 2, z: -5 });
	const handleMovement = () => {
		if (!player.current || !model.current) return;

		model.current.getWorldDirection(forward);
		rightVec.crossVectors(upVec, forward).normalize();

		const currLinvel = player.current.linvel();
		const maxVel = 5;

		let update = false;
		// if (jumpPressed && onFloor.current) {
		// 	impulse.y += jumpDist;
		// 	update = true;
		// }
		if (forwardPressed && currLinvel.z > -maxVel) {
			directionVec.addScaledVector(forward, 1);
			update = true;
		}
		if (backPressed && currLinvel.z < maxVel) {
			directionVec.addScaledVector(forward, -1);
			update = true;
		}
		if (leftPressed && currLinvel.x > -maxVel) {
			directionVec.addScaledVector(rightVec, 1);
			update = true;
		}
		if (rightPressed && currLinvel.x < maxVel) {
			directionVec.addScaledVector(rightVec, -1);
			update = true;
		}

		const { x } = mousePos;
		if (x > 3) {
			torqueImpulse.y -= 0.003;
			update = true;
		}
		if (x < -3) {
			torqueImpulse.y += 0.003;
			update = true;
		}

		if (mouseup) {
			leftShoulderJoint.current.configureMotorPosition(0, 1e5, 10);
			update = true;
		}

		if (!mouseup) {
			leftShoulderJoint.current.configureMotorPosition(5, 1e5, 10);
			update = true;
		}

		if (update) {
			const impulse = directionVec.normalize().multiplyScalar(0.1);
			socket.emit("move", impulse, torqueImpulse, mouseup);
			player.current.applyImpulse(impulse, true);
			player.current.applyTorqueImpulse(torqueImpulse, true);
		}
	};

	const ballColliderSize = 0.1;
	const leftHand = useRef(null);
	const leftShoulderJoint = useRevoluteJoint(player, leftHand, [
		[-capsuleSize.r + -0.1, 0.4, 0],
		[0, 0.8, 0],
		[1, 0, 0],
	]);

	useFrame(({ camera, clock }) => {
		if (!player.current) return;

		// Set Vector3 so we can use built in methods
		playerPos.set(position.x, position.y, position.z);
		playerQuat.set(rotation.x, rotation.y, rotation.z, rotation.w);

		// Copy server positions to client
		player.current.setTranslation(playerPos, true);
		player.current.setRotation(playerQuat, true);

		// Apply the player's rotation to the offset
		const newOffset = offset.clone().applyQuaternion(playerQuat);

		// Calculate the target camera position by adding the rotated offset to the player's position
		const cameraTargetPosition = playerPos.clone().add(newOffset);

		// Smoothly interpolate the camera's position towards the target position
		const lerpFactor = 0.05;
		camera.position.lerp(cameraTargetPosition, lerpFactor);

		// Ensure the camera is looking at the player
		camera.lookAt(playerPos);

		// Handle Inputs
		handleMovement();
	});

	return (
		<>
			<RigidBody ref={leftHand}>
				<BallCollider args={[ballColliderSize]} />
			</RigidBody>
			<DummyModel
				playerRef={player}
				modelRef={model}
				capsuleSize={capsuleSize}
				onFloor={onFloor}
			/>
		</>
	);
};

export default Player;
