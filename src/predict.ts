import * as tf from '@tensorflow/tfjs';

import {
  IPreds,
} from './types';

const getPreds = async (images: tf.Tensor4D, model: tf.Model): Promise<tf.Tensor> => {
  const labels: tf.Tensor|tf.Tensor[] = await model.predict(images);
  if (Array.isArray(labels)) {
    throw new Error('handle this');
    return labels[0];
  }
  return labels;
};

type ILabelMap = {
  [index: string]: string;
} | Array<string>;

const predict = async (images: tf.Tensor4D, model: tf.Model, labels: ILabelMap): Promise<IPreds> => {
  const preds = await getPreds(images, model);
  const predsArray = preds.dataSync();
  const sortedPredictions = Object.values(predsArray).sort((a: number, b: number) => {
    return a - b;
  });

  const predsObj = {};
  predsArray.forEach((pred, i) => {
    predsObj[pred] = i;
  });

  return sortedPredictions.map(confidence => ({
    confidence,
    label: labels[predsObj[confidence]],
  }));
};

export default predict;
