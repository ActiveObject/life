(function (exports) {
	"use strict";

	var slice = Array.prototype.slice;

	exports.last = function (array) {
		return array[array.length - 1];
	};

	exports.isLastRow = function (cell, rows) {
		var row = cell[0];
		var lastRow = rows - 1;
		return row === lastRow;
	};

	exports.randomNum = function (from, to) {
		return Math.floor(Math.random() * (to - from)) + from;
	};

	exports.randomItem = function (array) {
		var index = randomNum(0, array.length);
		return array[index];
	};

	exports.equalCell = function (c1) {
		return function (c2) {
			return c1[0] === c2[0] && c1[1] === c2[1];
		};
	};

	exports.position = function (node) {
		var row = node.parentNode.getAttribute('data-row');
		var col = node.getAttribute('data-col');
		return [+row, +col];
	};

	exports.compact = function (array) {
		return array.filter(function(value){ return !!value; });
	};

	exports.replace = function (item, rules) {
		var result = item;

		rules.forEach(function (rule) {
			if (item === rule[0]) result = rule[1];
		});

		return result;
	};

	exports.combine = function (array1, operation) {
		return function (array2) {
			return array1.map(function (item, index) {
				return operation(item, array2[index]);
			});
		};
	};

	exports.add = function (x1, x2) { return x1 + x2; };

	exports.removeClass = function (node, str) {
		var cl = node.getAttribute('class').replace(str, '');
		node.setAttribute('class', cl);
		return node;
	};

	exports.addClass = function (node, str) {
		var cl = node.getAttribute('class');
		node.setAttribute('class', cl.concat(' ' + str));
		return node;
	};

	exports.extend = function (obj) {
		slice.call(arguments, 1).forEach(function(source) {
			for (var prop in source) {
				obj[prop] = source[prop];
			}
		});
		return obj;
	};

	/**
	 * Invoke method fnName for an obj.
	 * All arguments from the second to be transferred to the method.
	 * Return function that receive obj.
	 */
	exports.invoke = function (fnName) {
		var args = slice(arguments, 1);
		return function (obj) {
			return obj[fnName].apply(obj, args);
		};
	};


})(window);