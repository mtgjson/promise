'use strict';

/**
 * A *very* simple promise
 *
 * Adapted from: https://github.com/mostlygeek/Node-Simple-Cache
 *
 * Once the promise is fulfilled or rejected, the "done" function will be called with the following parameters
 * done(err, results);
 *
 * You can pass other promises to "done" and they will get resolved/rejected according to the original promise.
 */
function promise() {
	var _results = null;
	var _err = null;
	var _done = false;
	// callbacks
	var _cbs = [];
	// promises
	var _promises = [];

	// Calls all callbacks on the list when we're done.
	var emptyStack = function() {
		_done = true;

		var cb;
		while (cb = _cbs.shift()) {
			cb.call(this, _err, _results);
		}

		while (cb = _promises.shift()) {
			if (_err) cb.reject(_err, _results);
			else cb.resolve(_results);
		}
	};

	this.resolve = function(results) {
		if (_done) return;

		_results = results;

		setImmediate(emptyStack);
	};
	this.reject = function(err, results) {
		if (_done) return;

		_err = err;
		_results = results;

		setImmediate(emptyStack);
	};

	/**
	 * What to do when the promise has been fulfilled
	 */
	this.done = function(cb) {
		if (cb instanceof promise) {
			if (_done) {
				if (_err) cb.reject(_err, _results);
				else cb.resolve(_results);
			}
			else
				_promises.push(cb);

			return(this);
		}
		if (typeof(cb) !== "function")
			throw "callback is not a function";

		if (_done)
			setImmediate(cb, _err, _results);
		else
			_cbs.push(cb);

		return this;
	};
};

module.exports = promise;
