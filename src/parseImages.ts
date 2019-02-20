import * as tf from '@tensorflow/tfjs';

type IImage = string|ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement;

const getArrayOfImages = (images: IImage|Array<IImage>): Array<IImage> => {
  let arrayOfImages: Array<IImage>;
  if (Array.isArray(images)) {
    arrayOfImages = images;
  } else {
    arrayOfImages = [images];
  }

  return arrayOfImages;
};

const loadImage = (src): Promise<HTMLImageElement> => {
  const img = new Image();
  img.src = src;
  // TODO: Handle CORS
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve(img);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};

const getImage = async (image: IImage): Promise<tf.Tensor3D> => {
  if (typeof image === 'string') {
    image = await loadImage(image);
  }
  // TODO: Also accept tensors
  return tf.fromPixels(image);
};

const parseImages = async (images: IImage|Array<IImage>): Promise<tf.Tensor4D> => {
  const preparedImages = getArrayOfImages(images)

  for (let i = 0; i < preparedImages.length; i++) {
    const img = await getImage(preparedImages[i]);
  }

  return tf.tensor([]);
};

export default parseImages;
