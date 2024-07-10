import { useMemo } from "react";

export const Controls = {
	forward: "forward",
	back: "back",
	left: "left",
	right: "right",
};

export const useKeyboardMap = () =>
	useMemo(
		() => [
			{ name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
			{ name: Controls.back, keys: ["ArrowDown", "KeyS"] },
			{ name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
			{ name: Controls.right, keys: ["ArrowRight", "KeyD"] },
			{ name: Controls.jump, keys: ["Space"] },
		],
		[],
	);
