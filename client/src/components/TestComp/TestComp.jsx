import { Box } from "@react-three/drei";
import {
	CuboidCollider,
	RigidBody,
	interactionGroups,
} from "@react-three/rapier";

export default function TestComp({ position = [0, 10, 0], size = [1, 4, 1] }) {
	const color = "yellow";
	const type = "dynamic";
	const meshSize = size.map((size) => size * 2);
	return (
		<group position={position}>
			<RigidBody type={type} position={[5, 0, 0]}>
				<CuboidCollider args={size} />
				<Box args={meshSize}>
					<meshStandardMaterial color={color} />
				</Box>
			</RigidBody>
			<RigidBody type={type}>
				<CuboidCollider args={size} />
				<Box args={meshSize}>
					<meshStandardMaterial color={color} />
				</Box>
			</RigidBody>
			<RigidBody type={type} position={[-5, 0, 0]}>
				<CuboidCollider args={size} />
				<Box args={meshSize}>
					<meshStandardMaterial color={color} />
				</Box>
			</RigidBody>
		</group>
	);
}
