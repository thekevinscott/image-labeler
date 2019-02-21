import * as tf from '@tensorflow/tfjs';

const predict = async (images: tf.Tensor4D, model: tf.Model) => {
  const labels = await model.predict(images);
};

export default predict;
