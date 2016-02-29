'use strict';

// Adapted from: https://github.com/mostlygeek/Node-Simple-Cache
module.exports = function() {
	/** 
	 * A *very* simple promise 
	 */
	var promise = {
		results: null,
		done: false,
		cbs: [], // callbacks
		resolve: function(results) {
			if (this.done) {
				return; // a bit of safety :)
			}

			var cb;
			while (cb = this.cbs.shift()) {
				cb.call(this, results);
			}

			this.results = results;
			this.done = true;

		},
		/**
		 * What to do when the promise has been fulfilled
		 */
		fulfilled: function(cb) {
			if (typeof(cb) !== "function") {
				throw "callback is not a function";
			}

			if (this.done) {
				cb(this.results);
			} else {
				this.cbs.push(cb);
			}

			return this;
		}
	};

	return(promise);
};
