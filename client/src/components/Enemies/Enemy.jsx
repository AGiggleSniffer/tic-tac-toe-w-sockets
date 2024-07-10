import { CapsuleCollider, RigidBody, quat, vec3 } from "@react-three/rapier";
import { Zombie } from "../Models/Zombie";
import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { enemiesAtom } from "../SocketManager";

export default function Enemy({ handle }) {
	const capsuleSize = { r: 0.3, l: 0.8 };
	const enemy = useRef(null);
	const model = useRef(null);
	const [enemies] = useAtom(enemiesAtom);
	const { position, rotation, linvel } = enemies[handle];
	const pos = vec3();
	const rot = quat();

	useEffect(() => {
		if (!enemy.current || !model.current) return;
		pos.set(position.x, position.y, position.z);
		rot.set(rotation.x, rotation.y, rotation.z, rotation.w);

		enemy.current.setTranslation(pos, true);
		enemy.current.setRotation(rot, true);
		const angle = Math.atan2(linvel.x, linvel.z);
		model.current.rotation.y = angle;
	}, [enemy, position, rotation, linvel, pos, rot]);

	return (
		<>
			<RigidBody
				ref={enemy}
				type="dynamic"
				enabledRotations={[false, false, false]}
			>
				<CapsuleCollider args={[capsuleSize.l, capsuleSize.r]} />
				<group ref={model}>
					<Zombie position={[0, -capsuleSize.r + -capsuleSize.l, 0]} />
				</group>
			</RigidBody>
		</>
	);
}
