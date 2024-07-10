import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import { useKeyboardMap } from "./hooks/useControls";
import Lighting from "./components/Lighting";
import Terrain from "./components/Terrain";
import Player from "./components/Player";
import { useAtom } from "jotai";
import SocketManager, { terrainAtom } from "./components/SocketManager";
import NonPlayerChar from "./components/NonPlayerChar/NonPlayerChar";
import Enemies from "./components/Enemies/Enemyies";

function App() {
	const map = useKeyboardMap();
	const [terrain] = useAtom(terrainAtom);
	const canvas = useRef(null);

	useEffect(() => {
		const canvasRef = canvas.current;
		const lockPointer = async () => {
			await canvasRef.requestPointerLock();
		};
		canvasRef.addEventListener("click", lockPointer);

		return () => canvasRef.removeEventListener("click", lockPointer);
	}, []);

	return (
		<>
			<SocketManager />
			<Canvas ref={canvas}>
				<Perf position="top-right" className="performance" />
				<Suspense fallback={null}>
					<Lighting />
					<Physics debug gravity={[0, -9.82, 0]} colliders={false}>
						<KeyboardControls map={map}>
							<Player />
						</KeyboardControls>
						<NonPlayerChar />
						<Enemies />
						{terrain && <Terrain terrain={terrain} />}
						{/* <TestComp /> */}
					</Physics>
				</Suspense>
			</Canvas>
		</>
	);
}

export default App;
