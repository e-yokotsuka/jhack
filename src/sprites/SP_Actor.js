import { Assets, Sprite } from 'pixi.js';

const Sp_Actor = async () => {
  const { textures } = await Assets.load('./assets/sprites/atlas.json');
  const sprite = new Sprite(textures[`pen1.svg`]);
  return sprite;
}

export default Sp_Actor;


