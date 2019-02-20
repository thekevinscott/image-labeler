import 'ts-jest';
import ImageLabeler from './index';
jest.mock('@tensorflow/tfjs');
jest.mock('@tensorflow/tfjs-core');

describe('ImageLabeler', () => {
  test('it loads and sets defaults', () => {
    const imageLabeler = new ImageLabeler();
    expect(imageLabeler.labels).toEqual(5);
    expect(imageLabeler.filters).toEqual(2);
    expect(imageLabeler.includeConfidence).toEqual(false);
  })

  test('it sets options', () => {
    const imageLabeler = new ImageLabeler({
      labels: 6,
      filters: 3,
      includeConfidence: true,
    });
    expect(imageLabeler.labels).toEqual(6);
    expect(imageLabeler.filters).toEqual(3);
    expect(imageLabeler.includeConfidence).toEqual(true);
  });

  test('it sets options via configure', () => {
    const imageLabeler = new ImageLabeler({
      labels: 7,
      filters: 4,
      includeConfidence: false,
    });
    imageLabeler.configure({
      labels: 6,
      filters: 3,
      includeConfidence: true,
    });
    expect(imageLabeler.labels).toEqual(6);
    expect(imageLabeler.filters).toEqual(3);
    expect(imageLabeler.includeConfidence).toEqual(true);
  });
});
