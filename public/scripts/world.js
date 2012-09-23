(function (exports) {
	function World (el, size) {
		this.el = el;
		this.size = size || World.MIDDLE;
		this.startCell = [0, 0];
		this.ms = 500;
		this.liveCells = Set.create();
		this.potentialLive = Set.create();
		this.isStarted = false;
		extend(this, Events);
	}

	World.SMALL  = 15;
	World.MIDDLE = 25;
	World.LARGE  = 50;

	World.prototype.cell = function (position) {
		var node = this.getNode(position);
		return Cell.create().el(node);
	};

	World.prototype.clean = function () {
		world = this;

		var toCell = function (pos) {
			return world.cell(pos.split(':'));
		};

		this.liveCells.map(toCell).forEach(function (cell) {
			cell.die();
		});

		this.liveCells.clean();
		this.potentialLive.clean();

		return this;
	};

	World.prototype.changeInterval = function (offset) {
		if (this.isStarted) {
			this.stop();
			this.start(this.ms + offset);
		} else {
			this.ms += offset;
			this.trigger('interval:change', this.ms);
		}
	};

	World.prototype.build = function (size) {
		console.log(this.el.clientWidth, this.el.clientHeight);

		this.size = size;
		this.trigger('size:change', size);

		if (this.isStarted) this.stop();

		rows = this.rows = Math.ceil(this.el.clientHeight / size);
		cols = this.cols = Math.ceil(this.el.clientWidth / size);

		max = cols > rows ? cols : rows;
		rows = this.rows = cols = this.cols = max;
		console.log("%s:%s", rows, cols);

		var emptyEl = document.createElement('td');
		emptyEl.style.width = emptyEl.style.height = size + 'px';
		emptyEl.setAttribute('class', Cell.deadClass);

		var row = document.createElement('tr');
		for (var i = 0; i < cols; i++) {
			var node = emptyEl.cloneNode(true);
			node.setAttribute('data-col', i);
			row.appendChild(node);
		}

		var tbody = document.createElement('tbody');
		for (var j = 0; j < rows; j++) {
			var node = row.cloneNode(true);
			node.setAttribute('data-row', j);
			tbody.appendChild(node);
		}

		var table = document.createElement('table');
		table.appendChild(tbody);

		while (this.el.hasChildNodes()) {
			this.el.removeChild(this.el.firstChild);
		}
		this.el.appendChild(table);

		var world = this;
		table.onclick = function (event) {
			var node = event.target || event.srcElement;
			if (node.nodeName.toUpperCase() !== 'TD') return;

			var c = Cell.create().el(node);
			if (c.isAlive()) {
				c.die();
				world.liveCells.remove(c.toString());
			} else {
				c.live();
				world.liveCells.add(c.toString());

				var deadCells = world.neighbors(c).filter(function (cell) {
					return !cell.isAlive();
				}).forEach(function (cell) {
					world.potentialLive.add(cell.toString());
				});
			}
		};

		console.log('world builded. size: ' + rows + 'x' + cols);
		return this;
	};

	World.prototype.start = function (ms) {
		ms = this.ms = ms || this.ms;
		this.trigger('interval:change', ms);
		var world = this;
		this.action = setInterval(function () {
			world.nextStep();
		}, ms);

		world.isStarted = true;
		this.trigger('start');
		return this;
	};

	World.prototype.stop = function () {
		clearInterval(this.action);
		this.isStarted = false;
		this.trigger('stop');
		return this;
	};

	var deaded = function (cell) {
		return !cell.isAlive();
	};

	var lived = function (cell) {
		return cell.isAlive();
	};

	World.prototype.nextStep = function () {
		var world = this;
		var toCell = function (pos) {
			return world.cell(pos.split(':'));
		};

		var liveneighbors = function (cell) {
			return world.neighbors(cell).filter(lived);
		};

		var deadCells =	world.liveCells.map(toCell).filter(function (cell) {
			var count = liveneighbors(cell).length;
			return count < 2 || count > 3;
		});

		var liveCells = world.potentialLive.map(toCell).filter(function (cell) {
			var count = liveneighbors(cell).length;
			console.log(cell.toString(), count);
			return count === 3;
		});

		deadCells.forEach(function (cell) {
			cell.die();
			world.liveCells.remove(cell.toString());
		});

		liveCells.forEach(function (cell) {
			cell.live();
			world.liveCells.add(cell.toString());
		});

		world.potentialLive.clean();
		world.liveCells.map(toCell).forEach(function (cell) {
			var deadCells = world.neighbors(cell).filter(deaded);

			deadCells.forEach(function (cell) {
				world.potentialLive.add(cell.toString());
			});
		});

		if (world.liveCells.isEmpty()) {
			world.stop();
		}
	};

	World.prototype.getNode = function (cell) {
		var row = cell[0], col = cell[1];
		return this.el.getElementsByTagName('tr')[row].getElementsByTagName('td')[col];
	};

	World.prototype.neighbors = function (cell) {
		var firstRowOffset = [[-1, -1], [-1, 0], [-1, 1]];
		var secondRowOffset = [[0, -1], [0, 1]];
		var thirdRowOffset = [[1, -1], [1, 0], [1, 1]];

		var offset = firstRowOffset.concat(secondRowOffset, thirdRowOffset);

		var neighbors = this.eliminateOverflow(offset.map(combine(cell.position, add)));
		return neighbors.map(this.cell.bind(this));
	};

	World.prototype.eliminateOverflow = function (items) {
		items = [].concat(items);
		var lastRow = this.rows - 1;
		var lastCol = this.cols - 1;

		return items.map(function (position) {
			var row = replace(position[0], [[-1, lastRow], [lastRow + 1, 0]]);
			var col = replace(position[1], [[-1, lastCol], [lastCol + 1, 0]]);
			return [row, col];
		});
	};

	World.prototype.show = function (cells) {
		cells.forEach(function (cell) {
			cell.live();
		});

		return this;
	};

	exports.World = World;
})(window);