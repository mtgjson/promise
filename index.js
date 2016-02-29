'use strict';

/**
 * A *very* simple promise
 *
 * Adapted from: https://github.com/mostlygeek/Node-Simple-Cache
 */
module.exports = function() {
	var _results = null;
	var _err = null;
	var _done = false;
	// callbacks
	var _cbs = [];

	var emptyStack = function() {
		if (!_done) return;

		var cb;
		while (cb = _cbs.shift()) {
			cb.call(this, _err, _results);
		}
	};

	var promise = {
		resolve: function(results) {
			if (_done) return;

			_results = results;
			_done = true;

			emptyStack();
		},
		reject: function(err) {
			if (_done) return;

			_err = err;
			_done = true;

			emptyStack();
		},
		/**
		 * What to do when the promise has been fulfilled
		 */
		done: function(cb) {
			if (typeof(cb) !== "function") {
				throw "callback is not a function";
			}

			if (_done) {
				cb(_err, _results);
			}
			else {
				_cbs.push(cb);
			}

			return this;
		}
	};

	return(promise);
};
