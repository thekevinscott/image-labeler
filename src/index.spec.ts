import ImageLabeler from './index';
import { expect } from 'chai';

describe('ImageLabeler', () => {
  it('loads and sets defaults', () => {
    const imageLabeler = new ImageLabeler();
    expect(imageLabeler.labels).to.equal(5);
    expect(imageLabeler.filters).to.equal(2);
    expect(imageLabeler.includeConfidence).to.equal(false);
  })

  it('sets options', () => {
    const imageLabeler = new ImageLabeler({
      labels: 6,
      filters: 3,
      includeConfidence: true,
    });
    expect(imageLabeler.labels).to.equal(6);
    expect(imageLabeler.filters).to.equal(3);
    expect(imageLabeler.includeConfidence).to.equal(true);
  });

  it('sets options via configure', () => {
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
    expect(imageLabeler.labels).to.equal(6);
    expect(imageLabeler.filters).to.equal(3);
    expect(imageLabeler.includeConfidence).to.equal(true);
  });
});
