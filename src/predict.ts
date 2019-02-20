import * as tf from '@tensorflow/tfjs';

const predict = async (images: tf.Tensor4D, model: tf.Model) => {
  return await model.predict(images);
};

export default predict;
