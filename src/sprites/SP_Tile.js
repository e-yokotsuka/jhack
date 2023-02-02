import { Sprite } from 'pixi.js';

const SP_Tile = ({ core: { textures: { tx_main } }, name }) => {
  const sprite = new Sprite(tx_main[`${name}`]);
  sprite.interactive = false;
  return sprite;
}

export default SP_Tile;


