'use strict';

const { stringifyRequest } = require('loader-utils');

exports.pitch = function(remainingRequest) {
  this.cacheable && this.cacheable();
  return `
		import React from 'react';

		function load() {
			return import(${stringifyRequest(this, '!!' + remainingRequest)});
		}

		const Comp = React.lazy(load);
		Comp.prefetch = load;

		export default Comp;
	`;
};
