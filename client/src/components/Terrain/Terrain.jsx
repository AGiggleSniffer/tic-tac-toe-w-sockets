import { RigidBody } from "@react-three/rapier";

export default function Terrain({ terrain }) {
	const { rotation, translation, friction } = terrain;
	const { halfExtents } = terrain.shape;
	return (
		<>
			<RigidBody type="fixed" name="floor" colliders="cuboid" friction={friction}>
				<mesh rotation={[rotation.x, rotation.y, rotation.z]}>
					<boxGeometry
						args={[halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2]}
						position={[translation.x, translation.y, translation.z]}
					/>
					<meshStandardMaterial color="grey" />
				</mesh>
			</RigidBody>
		</>
	);
}
