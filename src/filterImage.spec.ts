import * as tf from '@tensorflow/tfjs';
import { expect } from 'chai';
import filterImage, { getSlices } from './filterImage';

const getCanvas = (width, height): tf.Tensor4D => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height / 2);
  ctx.fillStyle = "black";
  ctx.fillRect(0, height / 2, width, height);
  return tf.browser.fromPixels(canvas).expandDims(0);
};

describe('filterImage', () => {
  it('throws with invalid filter', () => {
    expect(() => {
      getSlices([2,2], -1);
    }).to.throw();
    expect(() => {
      getSlices([2,2], 1.5);
    }).to.throw();
    expect(() => {
      getSlices([2,2], 0);
    }).to.throw();
    expect(() => {
      getSlices([2,2], undefined);
    }).to.throw();
  });

  describe('100%', () => {
    it('handles a square', () => {
      const { size, slices } = getSlices([2,2], 1);
      expect(size).to.eql([2,2]);
      expect(slices).to.eql([[0, 0]]);
    });

    it('handles a large square', () => {
      const { size, slices } = getSlices([10, 10], 1);
      expect(size).to.eql([10, 10]);
      expect(slices).to.eql([[0, 0]]);
    });

    it('handles a tall square', () => {
      const { size, slices } = getSlices([6, 2], 1);
      expect(size).to.eql([2,2]);
      expect(slices).to.eql([
        [0, 0],
        [2, 0],
        [4, 0],
      ]);
    });

    it('handles a long square', () => {
      const { size, slices } = getSlices([2,6], 1);
      expect(size).to.eql([2,2]);
      expect(slices).to.eql([
        [0, 0],
        [0, 2],
        [0, 4],
      ]);
    });

    it('handles a tall square with remainder', () => {
      const { size, slices } = getSlices([7, 2], 1);
      expect(size).to.eql([2,2]);
      expect(slices).to.eql([
        [0, 0],
        [2, 0],
        [4, 0],
        [5, 0],
      ]);
    });

    it('handles a long square with remainder', () => {
      const { size, slices } = getSlices([2, 7], 1);
      expect(size).to.eql([2,2]);
      expect(slices).to.eql([
        [0, 0],
        [0, 2],
        [0, 4],
        [0, 5],
      ]);
    });
  });

  describe('50%', () => {
    it('handles a square', () => {
      const { size, slices } = getSlices([2,2], .5);
      expect(size).to.eql([1,1]);
      expect(slices).to.eql([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]);
    });

    it('handles a small square', () => {
      const { size, slices } = getSlices([1, 1], .5);
      expect(size).to.eql([1, 1]);
      expect(slices).to.eql([
        [0, 0],
      ]);
    });


    it('handles a large even square', () => {
      const { size, slices } = getSlices([10, 10], .5);
      expect(size).to.eql([5, 5]);
      expect(slices).to.eql([
        [0, 0],
        [5, 0],
        [0, 5],
        [5, 5],
      ]);
    });

    it('handles a large odd square', () => {
      const { size, slices } = getSlices([9, 9], .5);
      expect(size).to.eql([5, 5]);
      expect(slices).to.eql([
        [0, 0],
        [4, 0],
        [0, 4],
        [4, 4],
      ]);
    });

    it('handles a tall rectangle', () => {
      const { size, slices } = getSlices([4, 2], .5);
      expect(size).to.eql([1,1]);
      expect(slices).to.eql([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
      ]);
    });

    it('handles a tall odd rectangle', () => {
      const { size, slices } = getSlices([5, 4], .5);
      expect(size).to.eql([2, 2]);
      expect(slices).to.eql([
        [0, 0],
        [2, 0],
        [3, 0],
        [0, 2],
        [2, 2],
        [3, 2],
      ]);
    });

    it('handles a long rectangle', () => {
      const { size, slices } = getSlices([2, 4], .5);
      expect(size).to.eql([1,1]);
      expect(slices).to.eql([
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ]);
    });

    it('handles a long odd rectangle', () => {
      const { size, slices } = getSlices([4, 5], .5);
      expect(size).to.eql([2, 2]);
      expect(slices).to.eql([
        [0, 0],
        [0, 2],
        [0, 3],
        [2, 0],
        [2, 2],
        [2, 3],
      ]);
    });
  });

  describe('40%', () => {
    it('handles a square', () => {
      const { size, slices } = getSlices([10, 10], .4);
      expect(size).to.eql([4, 4]);
      expect(slices).to.eql([
        [0, 0],
        [4, 0],
        [6, 0],
        [0, 4],
        [4, 4],
        [6, 4],
        [0, 6],
        [4, 6],
        [6, 6],
      ]);
    });

    it('handles a small square', () => {
      const { size, slices } = getSlices([1, 1], .4);
      expect(size).to.eql([1, 1]);
      expect(slices).to.eql([
        [0, 0],
      ]);
    });

    it('handles a small but larger square', () => {
      const { size, slices } = getSlices([2, 2], .4);
      expect(size).to.eql([1, 1]);
      expect(slices).to.eql([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]);
    });

    it('handles a large odd square', () => {
      const { size, slices } = getSlices([9, 9], .4);
      expect(size).to.eql([4, 4]);
      expect(slices).to.eql([
        [0, 0],
        [4, 0],
        [5, 0],
        [0, 4],
        [4, 4],
        [5, 4],
        [0, 5],
        [4, 5],
        [5, 5],
      ]);
    });

    it('handles a tall rectangle', () => {
      const { size, slices } = getSlices([4, 2], .4);
      expect(size).to.eql([1,1]);
      expect(slices).to.eql([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
      ]);
    });

    it('handles a tall odd rectangle', () => {
      const { size, slices } = getSlices([5, 4], .4);
      expect(size).to.eql([2, 2]);
      expect(slices).to.eql([
        [0, 0],
        [2, 0],
        [3, 0],
        [0, 2],
        [2, 2],
        [3, 2],
      ]);
    });

    it('handles a long rectangle', () => {
      const { size, slices } = getSlices([2, 4], .4);
      expect(size).to.eql([1, 1]);
      expect(slices).to.eql([
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ]);
    });

    it('handles a long odd rectangle', () => {
      const { size, slices } = getSlices([4, 5], .4);
      expect(size).to.eql([2, 2]);
      expect(slices).to.eql([
        [0, 0],
        [0, 2],
        [0, 3],
        [2, 0],
        [2, 2],
        [2, 3],
      ]);
    });
  });
});

describe('filterImage', () => {
  it('returns a square for a filter of 1', () => {
    const canvas = getCanvas(2, 2);
    const img = filterImage(canvas, [1]);
    expect(img.dataSync()).to.eql(new Int32Array([
      255,255,255,
      255,255,255,
      0,0,0,
      0,0,0,
    ]));
  });

  it('returns two squares for a filter of 1 and double width', () => {
    const canvas = getCanvas(4, 2);
    const img = filterImage(canvas, [1]);
    expect(img.shape).to.eql([2, 2, 2, 3]);
    expect(img.dataSync()).to.eql(new Int32Array([
      255,255,255,
      255,255,255,
      0,0,0,
      0,0,0,
      255,255,255,
      255,255,255,
      0,0,0,
      0,0,0,
    ]));
  });

  it('returns two squares for a filter of 1 and double height', () => {
    const canvas = getCanvas(2, 4);
    const img = filterImage(canvas, [1]);
    expect(img.shape).to.eql([2, 2, 2, 3]);
    expect(img.dataSync()).to.deep.equal(new Int32Array([
      255,255,255,
      255,255,255,
      255,255,255,
      255,255,255,
      0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
    ]));
  });
});
