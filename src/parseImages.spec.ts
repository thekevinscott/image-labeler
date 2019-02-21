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
