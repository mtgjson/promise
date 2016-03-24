'use strict';

/**
 * A *very* simple promise
 *
 * Adapted from: https://github.com/mostlygeek/Node-Simple-Cache
 *
 * Once the promise is fulfilled or rejected, the "done" function will be called with the following parameters
 * done(err, results);
 */
function promise() {
	var _results = null;
	var _err = null;
	var _done = false;
	// callbacks
	var _cbs = [];

	// Calls all callbacks on the list when we're done.
	var emptyStack = function() {
		_done = true;

		var cb;
		while (cb = _cbs.shift()) {
			cb.call(this, _err, _results);
		}
	};

	this.resolve = function(results) {
		if (_done) return;

		_results = results;

		setImmediate(emptyStack);
	};
	this.reject = function(err) {
		if (_done) return;

		_err = err;

		setImmediate(emptyStack);
	};
	/**
	 * What to do when the promise has been fulfilled
	 */
	this.done = function(cb) {
		if (typeof(cb) !== "function")
			throw "callback is not a function";

		if (_done)
			setImmediate(function() { cb(_err, _results); });
		else
			_cbs.push(cb);

		return this;
	};
};

module.exports = promise;
