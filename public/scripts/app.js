(function (exports) {
	var $ = function (id) { return document.getElementById(id); };
	var App = {
		init: function () {
			var worldEl = $('world');
			var startEl = $('start');
			var cleanEl = $('clean');
			var speedupEl = $('speedup');
			var speeddownEl = $('speeddown');

			var speedBtn = $('speed');
			var speedGroup = $('speed-group');
			speedBtn.addEventListener('click', function () {
				if (speedGroup.style.display === "none" || !speedGroup.style.display) {
					speedGroup.style.display = "block";
					speedGroup.style.top = speedBtn.offsetTop;
					speedGroup.style.left = speedBtn.offsetWidth;
					addClass(speedBtn, 'active');
				} else {
					speedGroup.style.display = 'none';
					removeClass(speedBtn, 'active');
				}
			});

			var sizeBtn = $('size');
			var sizeGroup = $('size-group');
			sizeBtn.addEventListener('click', function () {
				if (sizeGroup.style.display === "none" || !sizeGroup.style.display) {
					sizeGroup.style.display = "block";
					sizeGroup.style.top = sizeBtn.offsetTop;
					sizeGroup.style.left = sizeBtn.offsetWidth;
					addClass(sizeBtn, 'active');
				} else {
					sizeGroup.style.display = 'none';
					removeClass(sizeBtn, 'active');
				}
			});

			var world = window.world = new World(worldEl);

			var valueNode = speedBtn.getElementsByClassName('value')[0];
			var unitNode = speedBtn.getElementsByClassName('unit')[0];
			valueNode.innerText = world.ms;

			world.on('interval:change', function (interval) {
				if (interval < 1000) {
					valueNode.innerText = interval;
					unitNode.innerText = 'ms';
				} else {
					valueNode.innerText = interval / 1000;
					unitNode.innerText = 's';
				}
			});

			startEl.addEventListener('click', function () {
				world.isStarted ? world.stop() : world.start();
			});

			cleanEl.addEventListener('click', function () {
				world.clean();
			});

			speedupEl.addEventListener('click', function () {
				world.changeInterval(50);
			});

			speeddownEl.addEventListener('click', function () {
				world.changeInterval(-50);
			});

			world.on('stop', function () {
				removeClass(startEl, 'started');
			});

			world.on('start', function () {
				addClass(startEl, 'started');
			});

			var setCellSize = function (size) {
				if (world.isStarted) world.stop();
				world.build(size);
			};

			var sizeEl = $('size');
			var sizeLargeEl = $('size-large');
			var sizeMiddleEl = $('size-middle');
			var sizeSmallEl = $('size-small');

			sizeLargeEl.addEventListener('click', function () {
				setCellSize(50);
				addClass(sizeEl, 'size-large');
				removeClass(sizeEl, 'size-middle');
				removeClass(sizeEl, 'size-small');
			});
			sizeMiddleEl.addEventListener('click', function () {
				setCellSize(25);
				addClass(sizeEl, 'size-middle');
				removeClass(sizeEl, 'size-large');
				removeClass(sizeEl, 'size-small');
			});
			sizeSmallEl.addEventListener('click', function () {
				setCellSize(10);
				addClass(sizeEl, 'size-small');
				removeClass(sizeEl, 'size-middle');
				removeClass(sizeEl, 'size-large');
			});


			setCellSize(50);
			addClass(sizeEl, 'size-large');
			removeClass(sizeEl, 'size-middle');
			removeClass(sizeEl, 'size-small');

			world.build(50);
		}
	};

	exports.App = App;
})(window);