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

		this.setBounds(  0, 0, this.width, this.height );
		//this.graphics.beginFill("red").drawCircle(0, 0, 40);
		this.graphics.beginFill("#FFF").drawRect(0, -this.height, this.width, this.height);
		//this.graphics = grSled;
		console.log(['Sled()', this]);
	};

	Sled.prototype = createjs.extend(Sled, classes.Mover);

	/*
	var grSled = new createjs.Graphics()
							.setStrokeStyle(2)
							.beginStroke("#ffffff")
							.drawRect(-(this.width/2),-(this.height/2),this.width,this.height);
	*/

	Sled.prototype.moveTeam = function(distance) {


	}

	Sled.prototype.update = function(elapsed) {
		this.graphics = grSled;
	}




	return Sled;	
};
export default buildSled;