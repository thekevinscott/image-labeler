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

describe('parseImages', () => {
  describe('string', () => {
    it('returns a tensor for a string', async () => {
      // black / white image
      const result = await parseImages(BLACKWHITE_DATA);
      expect(result.shape).to.eql([1, 1, 2, 3]);
      expect(result.dataSync()).to.deep.equal(new Int32Array([255,255,255,0,0,0]));
    });

    it('returns a tensor for a working image src', async () => {
      // break cache to fix issue with multiple tests caching image
      const src = `${BLACKWHITE_SRC}?cache=${Math.random()}`;
      const result = await parseImages(src);
      expect(result.shape).to.eql([1, 1, 2, 3]);
      expect(result.dataSync()).to.deep.equal(new Int32Array([255,255,255,0,0,0]));
    });

    it('ignores an image that fails to load over CORS', async () => {
      const result = await parseImages(`${BADIMAGE_SRC}?cache=${Math.random()}`);
      expect(result.dataSync()).to.eql(new Float32Array([]));
    });
  });

  describe('string', () => {
    it('returns a tensor for an image', async () => {
      const img = getImage(BLACKWHITE_DATA);
      const result = await parseImages(img);
      expect(result.shape).to.eql([1, 1, 2, 3]);
      expect(result.dataSync()).to.deep.equal(new Int32Array([255,255,255,0,0,0]));
    });

    it('waits for image to load before parsing it', async () => {
      // break cache to fix issue with multiple tests caching image
      const img = getImage(`${BLACKWHITE_SRC}?cache=${Math.random()}`);
      const result = await parseImages(img);
      expect(result.shape).to.eql([1, 1, 2, 3]);
      expect(result.dataSync()).to.deep.equal(new Int32Array([255,255,255,0,0,0]));
    });

    it('ignores an image that fails to load over CORS', async () => {
      const img = getImage(`${BADIMAGE_SRC}?cache=${Math.random()}`);
      const result = await parseImages(img);
      expect(result.dataSync()).to.eql(new Float32Array([]));
    });
  });

  describe('canvas', () => {
    it('returns a tensor for a canvas', async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 2;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 1, 1);
      ctx.fillStyle = "black";
      ctx.fillRect(1, 0, 1, 1);
      const result = await parseImages(canvas);
      expect(result.shape).to.eql([1, 1, 2, 3]);
      expect(result.dataSync()).to.deep.equal(new Int32Array([255,255,255,0,0,0]));
    });
  });

  describe('ImageData', () => {
    it('returns a tensor for an ImageData', async () => {
      const arr = new Uint8ClampedArray(8);
      arr[0] = 255;
      arr[1] = 255;
      arr[2] = 255;
      arr[3] = 255;
      arr[4] = 0;
      arr[5] = 0;
      arr[6] = 0;
      arr[7] = 255;
      const imageData = new ImageData(arr as any, 2);
      const result = await parseImages(imageData);
      expect(result.shape).to.eql([1, 1, 2, 3]);
      expect(result.dataSync()).to.deep.equal(new Int32Array([255,255,255,0,0,0]));
    });
  });

  describe('Tensor', () => {
    it('returns a tensor for a 3d tensor', async () => {
      const tensor: tf.Tensor3D = tf.tensor([[255,255,255,0,0,0]], [1, 2, 3], 'float32');
      const result = await parseImages(tensor);
      expect(result.shape).to.eql([1, 1, 2, 3]);
      console.log(typeof result.dataSync());
      expect(result.dataSync()).to.deep.equal(new Float32Array([255,255,255,0,0,0]));
    });

    it('returns a tensor for a 4d tensor', async () => {
      const tensor: tf.Tensor4D = tf.tensor([[255,255,255,0,0,0]], [1, 1, 2, 3], 'float32');
      const result = await parseImages(tensor);
      expect(result.shape).to.eql([1, 1, 2, 3]);
      expect(result.dataSync()).to.deep.equal(new Float32Array([255,255,255,0,0,0]));
    });

    it('returns an error for a 2d tensor', async () => {
      const tensor: tf.Tensor2D = tf.tensor([255,0], [2, 1], 'float32');
      const result = await parseImages(tensor);
      expect(result.dataSync()).to.eql(new Float32Array([]));
    });
  });

  // test('it returns a tensor for a tensor', async () => {
  //   const t = tf.tensor([0, 1, 3]);
  //   const result = await parseImages(t);
  //   expect(result).toEqual(tf.tensor([]));
  // });

  // test('it returns a tensor for an HTML Image element', async () => {
  //   const img = new Image();
  //   img.src = 'foobar';
  //   const result = await parseImages(img);
  //   expect(result).toEqual(tf.tensor([]));
  // });

  // test('it returns a tensor for a Canvas element', async () => {
  //   const canvas = new Canvas();
  //   const result = await parseImages(canvas);
  //   expect(result).toEqual(tf.tensor([]));
  // });
});
