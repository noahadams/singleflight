# Singleflight

## A wrapper for de-duplicating in-flight requests

Singleflight allows you to simply wrap asynchronous functions of the form
`function(key, callback)` where key is a single string argument and callback
can be a function of any signature.

### Usage

```javascript
var singleflight = require('singleflight');
var request = require('request');

var wrappedget = singleflight(request.get);

wrappedget('https://www.example.com/cool.jpg', function(error, response) {
  ...
});
wrappedget('https://www.example.com/cool.jpg', function(error, response) {
  ...
});
```

will result in only one call to fetch `https://www.example.com/cool.jpg`.

Useful applications include re-validation and re-population of caches, and any
other de-duplication of longish running asynchronous tasks. Combines well with
other async flow control tools like Promises and the
[async](https://github.com/caolan/async) and
[vasync](https://github.com/davepacheco/node-vasync) libraries.

### Testing
`npm test`
