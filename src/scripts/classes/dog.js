let buildDog = function(classes) {
	function Dog(settings = {}) {
		this.Shape_constructor();
		this.x		= settings.x || 0;
		this.y		= settings.y || 0;
		this.width	= 15;
		this.height	= 10;
		this.regX		= this.width/2;
		this.regY		= this.height/2;

		this.setBounds(  0, 0, this.width, this.height );
		//this.graphics.beginFill("red").drawCircle(0, 0, 40);
		this.graphics.beginFill("#BADA55").drawRect(-this.width/2, -this.height/2, this.width, this.height);
		//this.graphics = grDog;
		console.log(['Dog()', this]);
	};

	Dog.prototype = createjs.extend(Dog, classes.Mover);

	/*
	var grSled = new createjs.Graphics()
							.setStrokeStyle(2)
							.beginStroke("#ffffff")
							.drawRect(-(this.width/2),-(this.height/2),this.width,this.height);
	*/

	Dog.prototype.update = function(elapsed) {
		//this.graphics = grDog;
	}




	return Dog;	
};
export default buildDog;