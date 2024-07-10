import { useEffect } from "react";
import { io } from "socket.io-client";
import { atom, useAtom } from "jotai";

export const socket = io.connect("http://localhost:3000");

export const terrainAtom = atom();

export const myCharHandleAtom = atom();

export const charactersAtom = atom({});

export const charListAtom = atom([]);

export const enemiesAtom = atom({});

export const enemiesListAtom = atom([]);

export default function SocketManager() {
	const [, setTerrain] = useAtom(terrainAtom);
	const [, setMyCharHandle] = useAtom(myCharHandleAtom);
	const [, setCharacters] = useAtom(charactersAtom);
	const [, setCharList] = useAtom(charListAtom);
	const [, setEnemies] = useAtom(enemiesAtom);
	const [, setEnemiesList] = useAtom(enemiesListAtom);
	useEffect(() => {
		function onConnect() {}

		function onDisconnect() {}

		function onWorld(terrain, enemyList, enemies) {
			setTerrain(terrain);
			setEnemiesList(enemyList);
			setEnemies(enemies);
		}

		function onMyCharHandle(handle) {
			setMyCharHandle(handle);
		}

		function onCharacters(charList, chars) {
			setCharList(charList);
			setCharacters(chars);
		}

		function onCharactersUpdate(chars) {
			setCharacters(chars);
		}

		function onEnemiesUpdate(value) {
			setEnemies(value);
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("world", onWorld);
		socket.on("mychar", onMyCharHandle);
		socket.on("characters", onCharacters);
		socket.on("charactersupdate", onCharactersUpdate);
		socket.on("enemiesupdate", onEnemiesUpdate);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("world", onWorld);
			socket.off("mychar", onMyCharHandle);
			socket.off("characters", onCharacters);
			socket.off("charactersupdate", onCharacters);
			socket.off("enemiesupdate", onEnemiesUpdate);
		};
	}, [
		setTerrain,
		setMyCharHandle,
		setCharacters,
		setCharList,
		setEnemies,
		setEnemiesList,
	]);
}
