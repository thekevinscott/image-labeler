# Image Labeler

`image-labeler` provides autosuggested labels for images or video. It relies on a Neural Network, MobileNet, performing inference in the browser to calculate the suggestions.

---

A demo is forthcoming.

## Table of Contents

* [Getting Started](#getting-started)
* [API](#api)
* [Tests](#test)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [Author](#author)
* [License](#license)
* [Acknowledgments](#acknowledgments)

## Getting Started

<a href="#table-of-contents">Back to Top</a>

### Via script tag

You can use `image-labeler` via a `<script />` tag:

```
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.15.1/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/image-labeler/dist/index.umd.min.js"></script>
    <script>
      const imageLabeler = new ImageLabeler();
      imageLabeler.label('https://imgur.com/some-image').then(suggestions => {
        console.log(suggestions);
        // ['one', 'two', 'three'];
      });
    </script>
  </head>
</html>
```

### Via ES6

Install with:

```
// npm
npm install image-labeler

// yarn
yarn add image-labeler
```

```
import ImageLabeler from 'image-labeler';
const imageLabeler = new ImageLabeler();
imageLabeler.label('https://imgur.com/some-image').then(suggestions => {
  console.log(suggestions);
  // ['one', 'two', 'three'];
});
```

### CORS

Many image src are not loadable via CORS. Theres ways around this.

## API

<a href="#table-of-contents">Back to Top</a>

`constructor`

`configure` same options as xonstructor

`label` label the image .accepts string html image or video and either a callback or options or both .

options can include the number of labels to return (0 is all), and how many filters to utilize. also includeConfidence

### Filters

a gif about how filters work

## Tests

<a href="#table-of-contents">Back to Top</a>

## Versioning

<a href="#table-of-contents">Back to Top</a>

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/thekevinscott/image-labeler/tags). 

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Author

<a href="#table-of-contents">Back to Top</a>

[Kevin Scott](https://thekevinscott.com)

See also the list of [contributors](https://github.com/thekevinscott/image-labeler/contributors) who participated in this project.

## License

<a href="#table-of-contents">Back to Top</a>

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

<a href="#table-of-contents">Back to Top</a>

This package leverages [`tensorflow.js`](https://js.tensorflow.org) and [MobileNet](https://arxiv.org/abs/1704.04861), both released by Google.
