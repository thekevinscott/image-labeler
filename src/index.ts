import * as tf from '@tensorflow/tfjs';

interface IOptions {
}

class ImageLabeler {
  constructor(options = {}) {
    this.setOptions(options);
  }

  configure(options: IOptions = {}) {
    this.setOptions(options);
  }

  setOptions = async (options) => {
    const model = await tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/iris_v1/model.json');
    model.summary();
  }
}

export default ImageLabeler;
