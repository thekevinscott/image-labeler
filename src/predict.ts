import * as tf from '@tensorflow/tfjs';

import {
  IPreds,
  IOptions,
} from './types';

const getPreds = async (images: tf.Tensor4D, model: tf.Model): Promise<tf.Tensor4D> => {
  const labels = await model.predict(images) as tf.Tensor4D;
  return labels;
};

type ILabelMap = {
  [index: string]: string;
} | Array<string>;

type IPrediction = {
  predictions: number[];
  labelIds: {
    [index: string]: string;
  };
};

const predict = (preds: tf.Tensor4D): IPrediction => {
  const predsArray = preds.dataSync();

  const labelIds = {};
  predsArray.forEach((confidence, i) => {
    labelIds[confidence] = i;
  });

  return {
    predictions: Object.values(predsArray),
    labelIds,
  };
};

const predictAcross = async (images: tf.Tensor4D, model: tf.Model, options: IOptions): Promise<IPreds> => {
  const labels: ILabelMap = options.modelSettings.labels;
  const preds: tf.Tensor4D = await getPreds(images, model);
  const predsBySlice = [];
  const predToLabelIds = {};
  for (let i = 0; i < preds.shape[0]; i++) {
    const predSlice: tf.Tensor4D = preds.slice(i, 1);
    const pred = predict(predSlice);
    predsBySlice[i] = pred;
    predToLabelIds[i] = predsBySlice[i].labelIds;
  }

  const sortedPredictions = predsBySlice.reduce((arr, { predictions }, index) => {
    return arr.concat(predictions.map(pred => ({
      pred,
      index,
    })));
  }, []).sort((a: any, b: any) => {
    return b.pred - a.pred;
  });

  const results = [];

  const found = [];

  let i = 0;
  while (results.length < options.numberOfLabels) {
  // for (let i = 0; i < options.numberOfLabels; i++) {
    const { pred: confidence, index } = sortedPredictions[i];
    const labelId = predToLabelIds[index][confidence];

    if (!found.includes(labelId)) {
      found.push(labelId);
      results.push({
        confidence,
        labelId,
        label: labels[labelId],
      });
    }

    i++;
  }

  if (!options.includeConfidence) {
    return results.map(result => result.label);
  }

  return results;
}

export default predictAcross;
