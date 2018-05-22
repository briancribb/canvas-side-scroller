let buildSled = function(classes) {
	function Sled(settings = {}) {
		this.Shape_constructor();
		this.x		= settings.x || 0;
		this.y		= settings.y || 0;
		this.width	= 60;
		this.height	= 40;
		this.regX		= this.width/2;
		this.regY		= this.height/2;

		this.setBounds(  0, 0, this.width, this.height );
		//this.graphics.beginFill("red").drawCircle(0, 0, 40);
		this.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)").drawCircle(160,60,40);
		this.graphics.beginStroke("#FFF").beginFill("#bad").drawRect(0, 0, this.width, this.height);
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

	Sled.prototype.update = function(elapsed) {
		this.graphics = grSled;
	}




	return Sled;	
};
export default buildSled;