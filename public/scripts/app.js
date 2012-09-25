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
					speedGroup.style.left = speedBtn.offsetWidth + speedBtn.offsetParent.offsetLeft;
					console.log(speedBtn);
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
					sizeGroup.style.left = sizeBtn.offsetWidth + speedBtn.offsetParent.offsetLeft;
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

			var sizeEl = $('size');
			$('size-large').addEventListener('click', world.build.bind(world, World.LARGE));
			$('size-middle').addEventListener('click', world.build.bind(world, World.MIDDLE));
			$('size-small').addEventListener('click', world.build.bind(world, World.SMALL));

			var sizeBtnClasses = ['size-small', 'size-middle', 'size-large'];
			var changeClassForSizeButton = function (newClass) {
				sizeBtnClasses.filter(function (cls) {
					return cls === newClass;
				}).forEach(function (cls) {
					addClass(sizeEl, cls);
				});

				sizeBtnClasses.filter(function (cls) {
					return cls !== newClass;
				}).forEach(function (cls) {
					removeClass(sizeEl, cls);
				});
			};

			world.on('size:change', function (newSize) {
				if (newSize === World.SMALL)  changeClassForSizeButton('size-small');
				if (newSize === World.MIDDLE) changeClassForSizeButton('size-middle');
				if (newSize === World.LARGE)  changeClassForSizeButton('size-large');
			});

			world.build(World.MIDDLE);
		}
	};

	exports.App = App;
})(window);