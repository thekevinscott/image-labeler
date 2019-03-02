import * as tf from '@tensorflow/tfjs';

const getImageData = (width, height) => {
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

export default getImageData;
