import Rapier from "@dimforge/rapier3d-compat";
await Rapier.init();

const gravity = { x: 0.0, y: -9.81, z: 0.0 };
export default new Rapier.World(gravity);
