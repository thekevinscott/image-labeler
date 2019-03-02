import 'babel-polyfill';
import * as tf from '@tensorflow/tfjs';
import parseImages from '../../src/parseImages';

async function shapshot(target, parsedImages) {
  for (let i = 0; i < parsedImages.shape[0]; i++) {
    const slice = parsedImages.slice(i, 1);
    const canvas = makeCanvas(slice);
    target.appendChild(canvas);
    setTimeout(() => {
      canvas.className = 'show';
    });
  }
}

const makeCanvas = (tensor) => {
  const canvas = document.createElement("canvas");
  canvas.width = tensor.shape[2];
  canvas.height = tensor.shape[1];
  const ctx = canvas.getContext("2d");
  const t = tensor.dataSync();
  const arr = [];
  for (let i = 0; i < t.length / 3; i++) {
    const index = i * 4;
    arr[index + 0] = t[(i * 3)];
    arr[index + 1] = t[(i * 3) + 1];
    arr[index + 2] = t[(i * 3) + 2];
    arr[index + 3] = 255;
  }

  const data = new Uint8ClampedArray(arr);
  const imageData = new ImageData(data, tensor.shape[2], tensor.shape[1]);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

async function drawImages(images, filters = [1], getOffside) {
  const imageContainer = document.getElementById('imageContainer');
  imageContainer.innerHTML = '';

  const height = images.reduce((maxHeight, canvas) => {
    const height = canvas.shape[1];
    return height > maxHeight ? height : maxHeight;
  }, 0);
  const divs = [];
  for (let i = 0; i < images.length; i++) {
    const container = document.createElement('div');
    container.className = 'image';
    const mainImage = document.createElement('div');
    mainImage.className = 'main-image';
    mainImage.style.height = height;
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    const canvas = makeCanvas(images[i]);
    canvasContainer.appendChild(canvas);
    canvasContainer.style.height = canvas.height;
    canvasContainer.style.width = canvas.width;
    mainImage.appendChild(canvasContainer);
    container.appendChild(mainImage);
    imageContainer.appendChild(container);
    const shapshotContainer = document.createElement('div');
    shapshotContainer.className = 'snapshot-container';
    shapshotContainer.id = `snapshot-container-${i}`;
    container.appendChild(shapshotContainer);
    divs.push(shapshotContainer);
  }
  document.getElementById('snapshot').onclick = async () => {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      divs[i].innerHTML = '';
      const dims = [ 224, 224 ];
      const parsedImages = await parseImages(image, dims, filters);
      const filter = filters[0];
      makeFrame(divs[i], image, filter, parsedImages, slice => {
        const canvas = makeCanvas(slice);
        divs[i].appendChild(canvas);
        setTimeout(() => {
          canvas.className = 'show';
        });
      }, (getOffside || defaultGetOffside)(i));
    }
  }
}

const defaultGetOffside = imageIndex => (index, parsedImages, filter) => {
  return Math.floor((index + 1) / (parsedImages.shape[0] * filter));
};

const makeFrame = (target, image, filter, parsedImages, callback, getOffsideForIndex) => {
  const frame = document.createElement('div');
  frame.className = 'frame';
  const maxIndex = image.shape[1] < image.shape[2] ? 1 : 2;
  const mainImage = target.parentElement.children[0].children[0];
  mainImage.appendChild(frame);
  const size = image.shape[maxIndex] * filter;
  frame.style.width = size;
  frame.style.height = size;

  for (let j = 0; j < parsedImages.shape[0]; j++) {
    const slice = parsedImages.slice(j, 1);
    const start = j * 2000;
    setTimeout(() => {
      frame.className = 'frame snap twohundred';
    }, start);
    setTimeout(() => {
      frame.className = 'frame one no-snap';
      callback(slice);
    }, start + 200);
    setTimeout(() => {
      frame.className = 'frame no-snap';
      const offside = getOffsideForIndex(j, parsedImages, filter);
      const minIndex = maxIndex === 2 ? 1 : 2;
      let targetMax = size * offside;
      let remainder = 0;
      if (image.shape[minIndex] % size !== 0) {
        remainder = size - (image.shape[minIndex] % size);
      }
      let targetMin = size * (j + 1) - (offside * image.shape[minIndex]) - (offside * remainder);
      if (j !== parsedImages.shape[0] - 1) {
        if (targetMin + size > image.shape[minIndex]) {
          targetMin = image.shape[minIndex] - size;
        }
        if (targetMax + size > image.shape[maxIndex]) {
          targetMax = image.shape[maxIndex] - size;
        }
        if (minIndex === 2) {
          frame.style.top = `${targetMax}px`;
          frame.style.left = `${targetMin}px`;
        } else {
          frame.style.top = `${targetMin}px`;
          frame.style.left = `${targetMax}px`;
        }
      }
    }, start + 1000);
  }
};

export default drawImages;
