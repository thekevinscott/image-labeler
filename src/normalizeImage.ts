import * as tf from '@tensorflow/tfjs';
const normalizeImages = (images: tf.Tensor4D, dims: [number, number]): tf.Tensor4D => {
  const resized: tf.Tensor4D = tf.image.resizeBilinear(images, dims);
  return resized.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
};

export default normalizeImages;
