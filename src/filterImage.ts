import * as tf from '@tensorflow/tfjs';

type IFilter = number;
export type IFilters = Array<IFilter>;

type IDims = [number, number];
type ISlices = {
  size: IDims;
  slices: Array<IDims>;
};

const getNum = (min: number, max: number) => Math.ceil(max / min);

const getSlice = (min: number, max: number, step: number) => {
  let slice = step * min;
  if (slice + min > max) {
    slice = max - min;
  }
  return slice;
};

export const getSlices = ([ height, width ]: IDims, filter: IFilter): ISlices => {
  if (!filter || filter > 1 || filter <= 0) {
    throw new Error(`Invalid filter provided: ${filter}`);
  }
  let slices: Array<IDims> = [];
  let min = height;
  let max = width;
  let pos = 0;
  if (width < height) {
    min = width;
    max = height;
    pos = 0;
  } else if (height < width) {
    min = height;
    max = width;
    pos = 1;
  }

  const minStep = Math.ceil(min * filter);
  let numberOfFilters = min / minStep;
  if (numberOfFilters > min) {
    numberOfFilters = min;
  }

  for (let j = 0; j < numberOfFilters; j++) {
    const minSlice = getSlice(minStep, min, j);
    const num = getNum(minStep, max);
    for (let step = 0; step < num; step++) {
      const maxSlice = getSlice(minStep, max, step);
      slices.push([
        pos === 0 ? maxSlice : minSlice,
        pos === 1 ? maxSlice : minSlice,
      ]);
    }
  }

  const size: IDims = [minStep, minStep];
  return {
    size,
    slices,
  };
};

const filterImage = (img: tf.Tensor4D, filters: IFilters) => tf.tidy(() => {
  let t;
  filters.forEach(filter => {
    const {
      slices,
      size,
    } = getSlices([ img.shape[1], img.shape[2] ], filter);

    slices.forEach(slice => {
      const start = [0, ...slice, 0];
      const end = [1, ...size, 3];
      // console.log(start, end, img.shape.slice(1, 3));
      if (t) {
        t = t.concat(img.slice(start, end));
      } else {
        t = img.slice(start, end);
      }
    });
  });
  return t;
});

export default filterImage;
