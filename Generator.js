var captchaClass = (function () {

	captchaClass = function (symbol, pos, fsize) {
		this.symbol = symbol;
		this.pos = pos;
		this.fsize = fsize;
	}

	return captchaClass;
})();

var Verifier = new function() {
	this.total_clicks = 0;
	
	this.total_wrong = 0;
	this.term_wrong = 0;

	this.correct = 0;	
	this.ans = "";

	this.isMatch = function(x, y) {
		if(this.correct > 4) return true;

		if(x <= Generator.captchaArray[this.correct].pos.x + Generator.captchaArray[this.correct].fsize / 3 &&
		   y <= Generator.captchaArray[this.correct].pos.y + Generator.captchaArray[this.correct].fsize / 3 &&
		   x >= Generator.captchaArray[this.correct].pos.x - Generator.captchaArray[this.correct].fsize / 3 &&
		   y >= Generator.captchaArray[this.correct].pos.y - Generator.captchaArray[this.correct].fsize / 3) {
			this.correct += 1;
			this.term_wrong = 0;
			this.ans += "O";
			return true;
		}
		else {
			this.term_wrong += 1;
			this.total_wrong += 1;
			this.ans += "X";
			return false;
		}
	};
};

var Generator = new function() {
	this.max = 260;
	this.min = 40;
	this.records = [];
	this.captchaArray = [];

	this.genCharsAndPos = function(callback) {
		// var i = Math.random();
		var counts = 0;
		var c;
		var px, py;
		
		var index;
		var fsize;
		var possible = "ABCDEFGHJKLMNPQRSTUVWXYZabdefghjkmnqrtuy0123456789";
		while (counts < 5) {
			// c = String.fromCharCode(0x0041 +  Math.random() * (0x005A - 0x0041 + 1));
			
			// generate none-repeat character
			var r = Math.random();
			c = possible.charAt(Math.floor(r * possible.length));
			possible = possible.replace(c, "");
			// str.replace(/ba/gi, '');
			// px = Math.floor(Math.random() * (this.max - this.min)) + this.min;
			// py = Math.floor(Math.random() * (this.max - this.min)) + this.min;
			var length = this.records.length;
			index = Math.floor(Math.random() * length);

			px = this.records[index].x;
			py = this.records[index].y;
			
			var loc = {
				x: px, 
				y: py
			};

			fsize = Math.floor(Math.random() * (90 - 30 + 1)) + 30;

			this.captchaArray.push(new captchaClass(c, loc, fsize));
			this.noOverlap(counts);
			counts += 1;
		}
		callback();
	};

	this.genColor =  function() {
		var newColor = "#" + (0x1000000+(Math.random()) * 0xffffff).toString(16).substr(1,6);
		return newColor;
	};

	this.shrink = function(records) {
		// alert(records.length);
		for(var i = records.length - 1; i >= 0; i--) {
    		if(records[i].x <= this.min || records[i].x >= this.max || 
    		   records[i].y <= this.min || records[i].y >= this.max) {
				records.splice(i, 1);
			}
		}

		this.records = records;
	}

	this.noOverlap = function(index) {
		if (index >= 4) return;
		var x = this.captchaArray[index].pos.x;
		var y = this.captchaArray[index].pos.y;
		var s = this.captchaArray[index].fsize / 2;
		var minx = x - s;
		var miny = y - s;
		var maxx = x + s;
		var maxy = y + s;
		
		for(var i = this.records.length - 1; i >= 0; i--) {
    		if(this.records[i].x >= minx && this.records[i].y >= miny &&  
    		   this.records[i].x <= maxx && this.records[i].y <= maxy) {
				//console.log(this.records[i].x + ", " + this.records[i].y);
				this.records.splice(i, 1);
				
			}
		}
	}
};
