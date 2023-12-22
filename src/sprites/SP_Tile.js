import { Sprite } from 'pixi.js';

const SP_Tile = ({ core: { textures: { tx_main } }, name }) => {
  const sprite = new Sprite(tx_main[`${name}`]);
  sprite.eventMode = 'auto';
  return sprite;
}

export default SP_Tile;


