import * as tf from '@tensorflow/tfjs';
import { expect } from 'chai';
import parseImages from './parseImages';

describe('parseImages', () => {
  it('returns a tensor for a string', async () => {
    // black / white image
    const img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAAXNSR0IArs4c6QAAAA9JREFUCB1j+A8EDAwM/wEa7gT8qKTw7wAAAABJRU5ErkJggg==';
    const result = await parseImages(img);
    expect(result.shape).to.eql([1, 1, 2, 3]);
    expect(result.dataSync()).to.deep.equal(new Int32Array([255,255,255,0,0,0]));
  });

  it('returns a tensor for a working image src', async () => {
    const img = 'https://i.imgur.com/zCGy3hG.png';
    const result = await parseImages(img);
    expect(result.dataSync()).to.deep.equal(new Int32Array([255,255,255,0,0,0]));
  });

  it('ignores an image that fails to load over CORS', async () => {
    const img = 'https://www.imagemagick.org/image/wizard.jpg';
    const result = await parseImages(img);
    expect(result.dataSync()).to.eql(new Float32Array([]));
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
