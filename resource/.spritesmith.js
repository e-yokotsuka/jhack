'use strict';

var util = require('util');

module.exports = [
  {
    src: './resource/**/*.{png,gif,jpg}',
    destImage: './public/assets/sprites/main.png',
    destCSS: './public/assets/sprites/main.json',
    cssTemplate: require('spritesmith-texturepacker'),
    padding: 2,
    algorithmOpts: { sort: false },
  }
];