/* globals Promise */
import * as tf from '@tensorflow/tfjs';

const getLocalPhoto = url => loadImage(url);

const loadImage = src => new Promise((resolve, reject) => {
  const img = new Image();
  img.src = src;

  img.onload = () => {
    const pixels = tf.browser.fromPixels(img).expandDims(0);
    resolve(pixels);
  };

  img.onerror = (err) => {
    console.log(src);
    reject(err);
  };
});

const getStockPhoto = (width, height) => loadImage(`https://picsum.photos/${width}/${height}/?random`);

const getCanvasData = async (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, width, height / 3);
  ctx.fillStyle = "green";
  ctx.fillRect(0, height / 3 * 1, width, height / 3 * 2);
  ctx.fillStyle = "blue";
  ctx.fillRect(0, height / 3 * 2, width, height);
  return tf.fromPixels(canvas).expandDims(0);
};

export default getLocalPhoto;
