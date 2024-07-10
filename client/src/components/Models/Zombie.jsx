/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 ./client/public/models/Zombie.gltf 
*/

import { useMemo} from 'react'
import { useGLTF } from '@react-three/drei'
import { useGraph } from '@react-three/fiber';
import { SkeletonUtils } from "three-stdlib";

export function Zombie(props) {
  const { scene, materials } = useGLTF('./models/Zombie.gltf')

	const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

	const { nodes } = useGraph(clone);

  return (
		<group {...props} dispose={null}>
			<primitive name="LeftFootCtrl" object={nodes.LeftFootCtrl} />
			<primitive name="RightFootCtrl" object={nodes.RightFootCtrl} />
			<primitive name="HipsCtrl" object={nodes.HipsCtrl} />
			<skinnedMesh
				geometry={nodes.characterMedium.geometry}
				material={materials["skin.001"]}
				skeleton={nodes.characterMedium.skeleton}
			/>
		</group>
	);
}

useGLTF.preload("./models/Zombie.gltf");