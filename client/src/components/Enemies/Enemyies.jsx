import { useAtom } from "jotai";
import { enemiesListAtom } from "../SocketManager";
import Enemy from "./Enemy";

export default function Enemies() {
	const [enemiesList] = useAtom(enemiesListAtom);
	console.log("ENEMY RENDER")
	return (
		<>
			{enemiesList.map((enemy) => (
				<Enemy key={enemy} handle={enemy} />
			))}
		</>
	);
}
