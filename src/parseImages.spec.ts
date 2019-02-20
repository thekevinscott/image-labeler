import 'ts-jest';
import * as tf from '@tensorflow/tfjs';
import parseImages from './parseImages';

describe('parseImages', () => {
  test('it returns tensors for a string', async () => {
    const img = 'foo';
    const result = await parseImages(img);
    expect(result).toEqual(tf.tensor([]));
  });
});

