(function (exports) {
	var Set = {
		create: function () {
			var set = Object.create(Set);
			set.items = [];
			return set;
		},

		has: function (item) {
			return this.items.indexOf(item) !== -1;
		},

		add: function (item) {
			if (!this.has(item)) this.items.push(item);
			return this;
		},

		remove: function (item) {
			if (this.has(item)) {
				var index = this.items.indexOf(item);
				delete this.items[index];
				this.items = compact(this.items);
			}
			return this;
		},

		isEmpty: function () {
			return this.items.length === 0;
		},

		clean: function () {
			this.items.length = 0;
			return this;
		}
	};

	['map', 'forEach', 'filter'].forEach(function (method) {
		Set[method] = function () {
			return Array.prototype[method].apply(this.items, arguments);
		};
	});

	exports.Set = Set;
})(window);
