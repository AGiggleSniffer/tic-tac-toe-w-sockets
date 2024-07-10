import { useAtom } from "jotai";
import { charListAtom, myCharHandleAtom } from "../SocketManager";
import DummyNPC from "./DummyNPC";

export default function NonPlayerChar() {
	const [charList] = useAtom(charListAtom);
	const [handle] = useAtom(myCharHandleAtom);
	console.log("CHAR RENDER")
	return charList.map((char) => {
		return char === handle ? null : <DummyNPC key={char} handle={char} />;
	});
}
