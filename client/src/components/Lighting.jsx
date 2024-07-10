import { Environment, Sky } from "@react-three/drei";

const Lighting = () => {
	return (
		<>
			<Environment preset="sunset" intensity={0.1} />
			<ambientLight intensity={0.1} />
			{/* <Sky sunPosition={[100, 100, 100]} /> */}
			{/* <directionalLight
				position={[0, 6, 6]}
				intensity={1}
				castShadow={true}
				shadow-mapSize={[2048, 2048]}
			/> */}
		</>
	);
};

export default Lighting;
