import * as tf from '@tensorflow/tfjs';
import { expect } from 'chai';
import parseImages from './parseImages';

const BLACKWHITE_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAAXNSR0IArs4c6QAAAA9JREFUCB1j+A8EDAwM/wEa7gT8qKTw7wAAAABJRU5ErkJggg==';
const BLACKWHITE_SRC = 'https://i.imgur.com/zCGy3hG.png';
const BADIMAGE_SRC = 'https://www.imagemagick.org/image/wizard.jpg';

const getImage = (src) => {
  const img = new Image();
  img.src = src;
  img.crossOrigin = '';
  return img;
};

const getCanvas = (width = 2, height = 1) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width / 2, height);
  ctx.fillStyle = "black";
  ctx.fillRect(width / 2, 0, width, height);
  return canvas;
};

const getImageData = () => {
  const arr = new Uint8ClampedArray(8);
  arr[0] = 255;
  arr[1] = 255;
  arr[2] = 255;
  arr[3] = 255;
  arr[4] = 0;
  arr[5] = 0;
  arr[6] = 0;
  arr[7] = 255;
  return new ImageData(arr as any, 2);
};

const a = tensor => Array.from(tensor.dataSync());

const tensor3D = tf.tensor([[[255,255,255],[0,0,0]], [[255,255,255],[0,0,0]]], [2, 2, 3], 'float32');
const tensor4D = tf.tensor([[[[255,255,255],[0,0,0]], [[255,255,255],[0,0,0]]]], [1, 2, 2, 3], 'float32');

describe('parseImages', () => {
  it('handles an empty array', async () => {
    // black / white image
    const result = await parseImages([], [224, 224], [1]);
    expect(result.shape).to.eql([null, null, null, null]);
    expect(a(result)).to.eql([]);
  });

  describe('string', () => {
    it('returns a tensor for a string', async () => {
      // black / white image
      const result = await parseImages(BLACKWHITE_DATA, [2, 2], [1]);
      expect(result.shape).to.eql([1, 2, 2, 3]);
      expect(a(result)).to.eql([
        255,255,255,0,0,0,
        255,255,255,0,0,0,
      ]);
    });

    it('returns a tensor for a working image src', async () => {
      // break cache to fix issue with multiple tests caching image
      const src = `${BLACKWHITE_SRC}?cache=${Math.random()}`;
      const result = await parseImages(src, [2, 2], [1]);
      expect(result.shape).to.eql([1, 2, 2, 3]);
      expect(a(result)).to.eql([
        255,255,255,0,0,0,
        255,255,255,0,0,0,
      ]);
    });

    it('ignores an image that fails to load over CORS', async () => {
      const result = await parseImages(`${BADIMAGE_SRC}?cache=${Math.random()}`, [224, 224], [1]);
      expect(a(result)).to.eql([]);
    });
  });

  describe('image', () => {
    it('returns a tensor for an image', async () => {
      const img = getImage(BLACKWHITE_DATA);
      const result = await parseImages(img, [2, 2], [1]);
      expect(result.shape).to.eql([1, 2, 2, 3]);
      expect(a(result)).to.eql([
        255,255,255,0,0,0,
        255,255,255,0,0,0,
      ]);
    });

    it('waits for image to load before parsing it', async () => {
      // break cache to fix issue with multiple tests caching image
      const img = getImage(`${BLACKWHITE_SRC}?cache=${Math.random()}`);
      const result = await parseImages(img, [2, 2], [1]);
      expect(result.shape).to.eql([1, 2, 2, 3]);
      expect(a(result)).to.eql([
        255,255,255,0,0,0,
        255,255,255,0,0,0,
      ]);
    });

    it('ignores an image that fails to load over CORS', async () => {
      const img = getImage(`${BADIMAGE_SRC}?cache=${Math.random()}`);
      const result = await parseImages(img, [224, 224], [1]);
      expect(a(result)).to.eql([]);
    });
  });

  describe('canvas', () => {
    it('returns a tensor for a canvas', async () => {
      const canvas = getCanvas();
      const result = await parseImages(canvas, [2, 2], [1]);
      expect(result.shape).to.eql([1, 2, 2, 3]);
      expect(a(result)).to.eql([
        255,255,255,0,0,0,
        255,255,255,0,0,0,
      ]);
    });
  });

  describe('ImageData', () => {
    it('returns a tensor for an ImageData', async () => {
      const imageData = getImageData();
      const result = await parseImages(imageData, [2, 2], [1]);
      expect(result.shape).to.eql([1, 2, 2, 3]);
      expect(a(result)).to.eql([
        255,255,255,0,0,0,
        255,255,255,0,0,0,
      ]);
    });
  });

  describe('Tensor', () => {
    const dims: [number, number] = [2,2];
    it('returns a tensor for a 3d tensor', async () => {
      const result = await parseImages(tensor3D, dims, [1]);
      expect(result.shape).to.eql([1, ...dims, 3]);
      expect(a(result)).to.eql([
        255,255,255,0,0,0,
        255,255,255,0,0,0,
      ]);
    });

    it('returns a tensor for a 4d tensor', async () => {
      const result = await parseImages(tensor4D, dims, [1]);
      expect(result.shape).to.eql([1, ...dims, 3]);
      expect(a(result)).to.eql([
        255,255,255,0,0,0,
        255,255,255,0,0,0,
      ]);
    });

    it('returns an error for a 2d tensor', async () => {
      const tensor: tf.Tensor2D = tf.tensor([255,0], [2, 1], 'float32');
      const result = await parseImages(tensor, dims, [1]);
      expect(a(result)).to.eql([]);
    });
  });

  describe('multiple types', () => {
    it('handles two types', async () => {
      const src = `${BLACKWHITE_SRC}?cache=${Math.random()}`;
      const images = [
        BLACKWHITE_DATA,
        src,
      ];

      const result = await parseImages(images, [2, 2,], [1]);
      expect(result.shape).to.eql([images.length, 2, 2, 3]);
      const expectation = [
        255,255,255,0,0,0,
        255,255,255,0,0,0,
        255,255,255,0,0,0,
        255,255,255,0,0,0,
      ];
      expect(a(result)).to.eql(expectation);
    });

    it('handles multiple types', async () => {
      const images = [
        BLACKWHITE_DATA,
        getCanvas(),
        getImageData(),
        tensor3D,
        tensor4D,
      ];
      const result = await parseImages(images, [2, 2], [1]);
      expect(result.shape).to.eql([images.length, 2, 2, 3]);
      const expectation = [
        255,255,255,0,0,0,
        255,255,255,0,0,0,
        255,255,255,0,0,0,
        255,255,255,0,0,0,
        255,255,255,0,0,0,
        255,255,255,0,0,0,
        255,255,255,0,0,0,
        255,255,255,0,0,0,
        255,255,255,0,0,0,
        255,255,255,0,0,0,
      ];
      expect(a(result)).to.eql(expectation);
    });

    it('handles multiple types with failing types', async () => {
      const images = [
        BLACKWHITE_DATA,
        getImage(BADIMAGE_SRC),
        getCanvas(2, 2),
      ];
      const result = await parseImages(images, [2, 2], [1]);
      expect(result.shape).to.eql([2, 2, 2, 3]);
      const expectation = [
        255,255,255,0,0,0,
        255,255,255,0,0,0,
        255,255,255,0,0,0,
        255,255,255,0,0,0,
      ];
      expect(a(result)).to.eql(expectation);
    });
  });
});
