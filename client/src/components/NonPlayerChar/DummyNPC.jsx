import { CapsuleCollider, RigidBody, quat, vec3 } from "@react-three/rapier";
import { Survivor } from "../Models/Survivor";
import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { charactersAtom } from "../SocketManager";

export default function DummyNPC({ handle }) {
	const capsuleSize = { r: 0.2, l: 1 };
	const player = useRef(null);
	const model = useRef(null);
	const [characters] = useAtom(charactersAtom);
	const { position, rotation, linvel } = characters[handle];
	const pos = vec3();
	const rot = quat();

	useEffect(() => {
		if (!player.current || !model.current) return;
		pos.set(position.x, position.y, position.z);
		rot.set(rotation.x, rotation.y, rotation.z, rotation.w);

		player.current.setTranslation(pos, true);
		player.current.setRotation(rot, true);

		const angle = Math.atan2(linvel.x, linvel.z);
		model.current.rotation.y = angle;
	}, [player, position, rotation, linvel, pos, rot]);

	return (
		<>
			<RigidBody
				ref={player}
				position={[0, 5, 0]}
				type="dynamic"
				enabledRotations={[false, false, false]}
			>
				<CapsuleCollider args={[capsuleSize.l, capsuleSize.r]} />
				<group ref={model}>
					<Survivor position={[0, -capsuleSize.r + -capsuleSize.l, 0]} />
				</group>
			</RigidBody>
		</>
	);
}
