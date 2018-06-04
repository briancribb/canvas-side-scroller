let buildSled = function(classes) {
	function Sled(settings = {}) {
		this.Shape_constructor();
		this.name	= settings.name || '';
		this.x		= settings.x || 0;
		this.y		= settings.y || 0;
		this.width	= 25;
		this.height	= 15;
		this.regX	= settings.regX || 0;
		this.regY	= settings.regY || 0;
		this.ready	= true;

		this.setBounds(  0, 0, this.width, this.height );
		//this.graphics.beginFill("red").drawCircle(0, 0, 40);
		//this.graphics.beginFill("#FFF").drawRect(0, -this.height, this.width, this.height);
		this.graphics = this.setType('blah', this);
		//console.log(['Sled()', this]);
	};

	Sled.prototype = createjs.extend(Sled, createjs.Shape);

	/*
	var grSled = new createjs.Graphics()
							.setStrokeStyle(2)
							.beginStroke("#ffffff")
							.drawRect(-(this.width/2),-(this.height/2),this.width,this.height);
	*/

	Sled.prototype.setType = function(strType, that) {
		//console.log('*** setType()');
		var tempGr = new createjs.Graphics();

        switch(strType) {
			case 'blah':
				tempGr.beginFill("#FFF").drawRect(0, -that.height, that.width, that.height);
				break;
			default:
				tempGr.beginFill("#FFF").drawRect(0, -that.height, that.width, that.height);
		}
		return tempGr;
	}

	Sled.prototype.moveTeam = function(yPoint) {
		let sled = this;

		sled.ready = false;
		let waitTime = 0;
		for (var i = 0; i < sled.team.length; i++) {
			let member = sled.team[i];

			createjs.Tween.get(member)
				.wait(waitTime)
				.to({y:yPoint}, 500)
				.call(function(){
					//console.log('All done...');
					//console.log(member.name);
					if (member.name === 'leadDog') {
						sled.ready = true;
					}

				});

			waitTime += 75;
		}
	}

	Sled.prototype.update = function(elapsed) {
		let that = this;


		that.graphics.clear();
		that.graphics = that.setType('blah', that);
		that.graphics.beginStroke("#BADA55");
		that.graphics.moveTo(that.width, -5);

		//let floatingPoint = {x:that.width, y:-5};

		// This does a line from the sled to each dog. Next we will  
		// go from dog to dog.
		for (var i = that.team.length - 2; i >= 0; i--) {
			that.team[i]
			let gp = that.team[ i ].localToGlobal(7,-5);
			let lp = that.globalToLocal(gp.x, gp.y);
			that.graphics.lineTo(lp.x, lp.y);
			// Get previous array item's point
			// Get this array item's point.
			// Line..
		}
	}

 


	return Sled;	
};
export default buildSled;