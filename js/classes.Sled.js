var classes = classes || {}; // Giving a namespace to the class we're creating. It keeps things out of global.

//http://createjs.com/tutorials/Inheritance/
(function() {

	/*
	We're creating a temporary object that lives only during this anonymous setup function. Once it's built up and 
	ready, we will add it to our classes object to be used by an outside application.
	*/

	//function Sled(canvas, id, x, y, vx, vy, vr) {
	function Sled(settings) {
		this.Shape_constructor();
		// Assign properties from what is passed in.
		this.x				= settings.x || 0;
		this.y				= settings.y || 0;
		this.width			= 60;						// All of our squares will be the same size.
		this.height			= 40;
		this.regX			= this.width/2;				// Setting the registration point so we can rotate around the center of the square.
		this.regY			= this.height/2;
		this.radius			= 18;
		this.rotation		= 0;						// This is the default value anyway, but I wanted to set it here for readability.
		this.alpha			= 1;
		this.duration		= 350;						// This is the default value anyway, but I wanted to set it here for readability.
		this.ready			= false;

		this.setBounds(  0, 0, this.width, this.height ); 
		//this.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)").drawCircle(160,60,40);
		//this.graphics.beginStroke("#FFF").beginFill("#bad").drawRect(0, 0, this.width, this.height);
		this.graphics = grSled;
	}

	// extend() builds our temporary object up with the parent as it's prototype. It then returns the new prototype, 
	// so we could give this a shorter variable name if we wanted to.
	Sled.prototype = createjs.extend(Sled, classes.Mover);

	/*
	Now we're actually going to create the class and use it. Any methods we override will be renamed
	to prefix_methodName(), as in: Container_draw(). We're adding the resulting class to our classes
	object to avoid polluting the global namespace.
	*/
	
	classes.Sled = createjs.promote(Sled, classes.Mover);


	var grSled			=	new createjs.Graphics()
								.setStrokeStyle(2)
								.beginStroke("#ffffff")
								.drawRect(-30,-20,60,40)
									.moveTo(-24,0);




	var grSled2			=	new createjs.Graphics()
								.setStrokeStyle(1)
								.beginFill("#ffffff")
									.drawCircle(12, 10, 2)
								.endFill()
								.beginStroke("#ffffff")
									.moveTo(24,10)
										.lineTo(0,0)
										.lineTo(7,10)
										.lineTo(0,20)
										.lineTo(24,10);


	var grSledThrust	=	new createjs.Graphics()
								.setStrokeStyle(1)
								.beginFill("#ffffff")
									.drawCircle(12, 10, 2)
								.endFill()
								.beginStroke("#ffffff")
									.moveTo(24,10)
										.lineTo(0,0)
										.lineTo(7,10)
										.lineTo(0,20)
										.lineTo(24,10)


									.setStrokeStyle(3)
									.moveTo(2,7)
										.lineTo(2,13)
									.setStrokeStyle(2)
									.moveTo(2,10)
										.lineTo(-4,10)
									.setStrokeStyle(1)
									.moveTo(-4,10)
										.lineTo(-8,10)
									.endStroke();



	Sled.prototype.fadeIn = function(elapsed) {
		if (this.alpha < 1) {
			this.alpha += .7 * elapsed;
		}
		if (this.alpha >= 1) {
			this.alpha = 1;
			this.ready = true;
		}
	}

	Sled.prototype.reset = function() {
		this.x = GAME.canvas.width/2; 
		this.y = GAME.canvas.height/2;
		this.alpha = 0;
		this.rotation = 0;
		this.ready = false;
	}

	Sled.prototype.update = function(elapsed) {
		this.graphics = grSled;
	}

}());