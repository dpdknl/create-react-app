import 'core-js/es/set';
import 'core-js/es/map';
import 'core-js/es/symbol';
import 'core-js/features/object/assign';
import 'core-js/features/object/entries';
import 'core-js/features/object/values';
import 'core-js/features/array/from';
import 'core-js/features/array/every';
import 'core-js/features/array/some';

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// fetch() polyfill for making API calls.
require('whatwg-fetch');
