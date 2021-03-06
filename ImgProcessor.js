function ImgProcessor(img) {
	this.img = img;
	this.record = [];
	ImgProcessor.prototype.edgeDetect = function() {
		// Sobel edge detection.
		var kernel_x = [
			[ 1, 0, -1],
			[ 2, 0, -2],
			[ 1, 0, -1]
		];
		var kernel_y = [
			[ 1, 2, 1],
			[ 0, 0, 0],
			[-1,-2,-1]
		];

		var w  = img.width,
		    h  = img.height,
		    w4 = w * 4,
		    y  = h;

		var dataCopy = this.prepareImgData();

		this.record = []; // clear the array

		do {
			var offsetY = (y - 1) * w4;
			var nextY = (y == h) ? (y - 1) : y;
			var prevY = (y == 1) ? 0 : (y - 2);

			var offsetYPrev = prevY * w4;
			var offsetYNext = nextY * w4;

			var x = w;
			do {
				var curr = offsetY + (x * 4 - 4);
				var prev = offsetYPrev + ((x == 1) ? 0 : (x - 2)) * 4;
				var next = offsetYNext + ((x == w) ? (x - 1) : x) * 4;

				var rx = dataCopy[prev - 4] * kernel_x[0][0] + 
						 dataCopy[prev]     * kernel_x[0][1] + 
						 dataCopy[prev + 4] * kernel_x[0][2] + 
						 dataCopy[curr - 4] * kernel_x[1][0] + 
						 dataCopy[curr]     * kernel_x[1][1] +
						 dataCopy[curr + 4] * kernel_x[1][2] + 
						 dataCopy[next - 4] * kernel_x[2][0] + 
						 dataCopy[next]     * kernel_x[2][1] + 
						 dataCopy[next + 4] * kernel_x[2][2];

				var ry = dataCopy[prev - 4] * kernel_y[0][0] + 
						 dataCopy[prev]     * kernel_y[0][1] + 
						 dataCopy[prev + 4] * kernel_y[0][2] + 
						 dataCopy[curr - 4] * kernel_y[1][0] + 
						 dataCopy[curr]     * kernel_y[1][1] +
						 dataCopy[curr + 4] * kernel_y[1][2] + 
						 dataCopy[next - 4] * kernel_y[2][0] + 
						 dataCopy[next]     * kernel_y[2][1] + 
						 dataCopy[next + 4] * kernel_y[2][2];

				var gx = dataCopy[prev - 3] * kernel_x[0][0] + 
						 dataCopy[prev + 1] * kernel_x[0][1] + 
						 dataCopy[prev + 5] * kernel_x[0][2] + 
						 dataCopy[curr - 3] * kernel_x[1][0] + 
						 dataCopy[curr + 1] * kernel_x[1][1] +
						 dataCopy[curr + 5] * kernel_x[1][2] + 
						 dataCopy[next - 3] * kernel_x[2][0] + 
						 dataCopy[next + 1] * kernel_x[2][1] + 
						 dataCopy[next + 5] * kernel_x[2][2];

				var gy = dataCopy[prev - 3] * kernel_y[0][0] + 
						 dataCopy[prev + 1] * kernel_y[0][1] + 
						 dataCopy[prev + 5] * kernel_y[0][2] + 
						 dataCopy[curr - 3] * kernel_y[1][0] + 
						 dataCopy[curr + 1] * kernel_y[1][1] +
						 dataCopy[curr + 5] * kernel_y[1][2] + 
						 dataCopy[next - 3] * kernel_y[2][0] + 
						 dataCopy[next + 1] * kernel_y[2][1] + 
						 dataCopy[next + 5] * kernel_y[2][2];

				var bx = dataCopy[prev - 2] * kernel_x[0][0] + 
						 dataCopy[prev + 2] * kernel_x[0][1] + 
						 dataCopy[prev + 6] * kernel_x[0][2] + 
						 dataCopy[curr - 2] * kernel_x[1][0] + 
						 dataCopy[curr + 2] * kernel_x[1][1] +
						 dataCopy[curr + 6] * kernel_x[1][2] + 
						 dataCopy[next - 2] * kernel_x[2][0] + 
						 dataCopy[next + 2] * kernel_x[2][1] + 
						 dataCopy[next + 6] * kernel_x[2][2];

				var	by = dataCopy[prev - 2] * kernel_y[0][0] + 
						 dataCopy[prev + 2] * kernel_y[0][1] + 
						 dataCopy[prev + 6] * kernel_y[0][2] + 
						 dataCopy[curr - 2] * kernel_y[1][0] + 
						 dataCopy[curr + 2] * kernel_y[1][1] +
						 dataCopy[curr + 6] * kernel_y[1][2] + 
						 dataCopy[next - 2] * kernel_y[2][0] + 
						 dataCopy[next + 2] * kernel_y[2][1] + 
						 dataCopy[next + 6] * kernel_y[2][2];

				var r = Math.sqrt((rx*rx + ry*ry) / 8.0);
				var g = Math.sqrt((gx*gx + gy*gy) / 8.0);
				var b = Math.sqrt((bx*bx + by*by) / 8.0);
				
				var brightness = (255 - (r*0.299 + g*0.587 + b*0.114)) || 255; // caculate brightness and invert.
				r = g = b = brightness = this.clampRGB(brightness);

				if(brightness == 255) {
					var loc = {
						x: x, 
						y: y
					};
					this.record.push(loc);
				}
			} while(--x);
		} while(--y);
	};

	ImgProcessor.prototype.prepareImgData = function() {
		var canvas = document.createElement('canvas'); // create an in memory canvas
		canvas.width = this.img.width; canvas.height = this.img.height; 
		var context = canvas.getContext("2d");
		context.drawImage(img, 0, 0 );  // draw on in memory canvas
		var imgData = context.getImageData(0, 0, canvas.width, canvas.height); // get imageData

		return imgData.data;
	};

	ImgProcessor.prototype.clampRGB = function(value) {
		if(value < 0)
			value = 0;
		else if(value > 255)
			value = 255;
		return value;
	};
}