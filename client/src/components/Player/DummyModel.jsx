import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { Survivor } from "../Models/Survivor";

export default function DummyModel({ playerRef, modelRef, onFloor, capsuleSize }) {
	return (
		<>
			<RigidBody
				ref={playerRef}
				position={[0, 5, 0]}
				onCollisionEnter={(other) => {
					if (other.rigidBodyObject.name === "floor") {
						onFloor.current = true;
					}
				}}
				onCollisionExit={(other) => {
					if (other.rigidBodyObject.name === "floor") {
						onFloor.current = false;
					}
				}}
				type="dynamic"
				enabledRotations={[false, true, false]}
				angularDamping={10}
			>
				<CapsuleCollider args={[capsuleSize.l, capsuleSize.r]} />
				<group ref={modelRef}>
					<Survivor position={[0, -capsuleSize.r + -capsuleSize.l, 0]} />
				</group>
			</RigidBody>
		</>
	);
}
