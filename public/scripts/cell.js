(function (exports) {
	"use strict";

	var Cell = {
		deadClass: 'dead',
		liveClass: 'live',

		create: function () {
			return Object.create(Cell);
		},

		el: function (node) {
			this.el = node;
			this.position = position(node);
			return this;
		},

		die: function () {
			this.el.setAttribute('class', Cell.deadClass);
			return this;
		},

		live: function () {
			this.el.setAttribute('class', Cell.liveClass);
			return this;
		},

		isAlive: function () {
			return this.el.getAttribute('class') === Cell.liveClass;
		},

		toString: function () {
			return this.position.join(':');
		},

		row: function () {
			return this.position[0];
		},

		col: function () {
			return this.position[1];
		}
	};

	exports.Cell = Cell;
})(window);
