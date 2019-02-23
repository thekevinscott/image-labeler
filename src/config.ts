import labels from './labels/simple';
import {
  IModelSettings,
} from './types';

const url = 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';

export const DEFAULT_MODEL_SETTINGS: IModelSettings = {
  url,
  labels,
};
export const DEFAULT_NUMBER_OF_LABELS = 5;
export const DEFAULT_FILTERS = [1, 0.5];
export const DEFAULT_INCLUDE_CONFIDENCE = false;
