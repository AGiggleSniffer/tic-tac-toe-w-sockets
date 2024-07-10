import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import RAPIER from "@dimforge/rapier3d-compat";
import Player from "./entity/player.js";
import world from "./engine/physics.js";
import Enemy from "./entity/enemy.js";
import PF from "pathfinding";
import { Vector3 } from "three";

// SERVER
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
	},
});

const port = 3000;
io.listen(port);

// TERRAIN
const gridSize = { w: 100, h: 100 };
const terrainCollider = RAPIER.ColliderDesc.cuboid(gridSize.w, 1, gridSize.h);
terrainCollider.setFriction(2);
const terrainBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
const terrain = world.createCollider(terrainCollider, terrainBody);
const grid = new PF.Grid(gridSize.w, gridSize.h);

// ENEMIES
const enemyArr = Enemy.enemyFactory(10, world);

// GAME
const playersObj = {};
const clientChars = {};
const clientCharsArr = [];

const clientEnemies = {};
const clientEnemiesArr = [];
enemyArr.forEach((enemy) => {
	clientEnemiesArr.push(enemy.handle);
	clientEnemies[enemy.handle] = {
		handle: enemy.handle,
		position: enemy.position,
		rotation: enemy.rotation,
		linvel: enemy.linvel,
	};
});

// PLAYERS / LOGIC
io.on("connection", (socket) => {
	console.log(`User Connected ${socket.id}`);

	const initialLocation = { x: 0, y: 5, z: 0 };
	const newPlayer = new Player(initialLocation, socket.id, world);

	playersObj[newPlayer.handle] = newPlayer;
	clientCharsArr.push(newPlayer.handle);
	clientChars[newPlayer.handle] = {
		id: newPlayer.id,
		handle: newPlayer.handle,
		position: newPlayer.position,
		rotation: newPlayer.rotation,
		linvel: newPlayer.linvel,
	};

	io.emit("characters", clientCharsArr, clientChars);

	socket.emit("world", terrainCollider, clientEnemiesArr, clientEnemies);

	socket.emit("mychar", newPlayer.handle);

	const moveStack = [];
	socket.on("move", (impulse, torqueImpulse, mouseup) => {
		newPlayer.body.applyImpulse(impulse, true);

		newPlayer.body.applyTorqueImpulse(torqueImpulse, true);

		if (mouseup) {
			newPlayer.joint.configureMotorPosition(0, 1e5, 10);
		}

		if (!mouseup) {
			newPlayer.joint.configureMotorPosition(5, 1e5, 10);
		}
	});

	socket.on("disconnect", () => {
		newPlayer.disconnect();
		delete clientChars[newPlayer.handle];
		delete playersObj[newPlayer.handle];
		clientCharsArr.splice(
			clientCharsArr.findIndex((char) => char === newPlayer.handle),
			1,
		);

		io.emit("characters", clientCharsArr, clientChars);
	});
});

// START GAME
const delay = 16;
const gameLoop = () => {
	world.step();

	let charupdate = false;
	let enemyupdate = false;

	world.forEachActiveRigidBody((body) => {
		if (!body.isMoving()) return;

		const myChar = clientChars[body.handle];
		const myEnemy = clientEnemies[body.handle];
		const pos = body.translation();
		const rot = body.rotation();
		const linvel = body.linvel();

		if (myChar) {
			myChar.position = pos;
			myChar.rotation = rot;
			myChar.linvel = linvel;
			charupdate = true;
		}
		if (myEnemy) {
			myEnemy.position = pos;
			myEnemy.rotation = rot;
			myEnemy.linvel = linvel;
			enemyupdate = true;
		}
	});

	if (charupdate) {
		io.emit("charactersupdate", clientChars);
	}
	if (enemyupdate) {
		io.emit("enemiesupdate", clientEnemies);
	}

	setTimeout(gameLoop, delay);
};

gameLoop();
