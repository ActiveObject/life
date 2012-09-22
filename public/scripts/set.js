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

		filter: function (iterator, context) {
			return Array.prototype.filter.call(this.items, iterator, context);
		},

		map: function (iterator, context) {
			return Array.prototype.map.call(this.items, iterator, context);
		},

		forEach: function (iterator, context) {
			return Array.prototype.forEach.call(this.items, iterator, context);
		},

		isEmpty: function () {
			return this.items.length === 0;
		},

		clean: function () {
			this.items.length = 0;
			return this;
		}
	};

	exports.Set = Set;
})(window);
