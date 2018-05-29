let buildObstacle = function(classes) {
	function Obstacle(settings = {}) {
		this.Shape_constructor();
		this.name	= settings.name || '';
		this.x		= settings.x || 0;
		this.y		= settings.y || 0;
		this.width	= 25;
		this.height	= 15;
		this.regX	= settings.regX || 0;
		this.regY	= settings.regY || 0;
		this.color	= settings.color || '#fff';

		this.setBounds(  0, 0, this.width, this.height );
		//this.graphics.beginFill("red").drawCircle(0, 0, 40);
		//this.graphics.beginFill("#FFF").drawRect(0, -this.height, this.width, this.height);
		this.graphics = this.setType('blah', this);
		//console.log(['Obstacle()', this]);
	};

	Obstacle.prototype = createjs.extend(Obstacle, createjs.Shape);

	/*
	var grObstacle = new createjs.Graphics()
							.setStrokeStyle(2)
							.beginStroke("#ffffff")
							.drawRect(-(this.width/2),-(this.height/2),this.width,this.height);
	*/

	Obstacle.prototype.setType = function(strType, that) {
		console.log('*** setType()');
		var tempGr = new createjs.Graphics();
		tempGr.beginFill(that.color);
        switch(strType) {
			case 'blah':
				tempGr.drawRect(0, -that.height, that.width, that.height);
				break;
			default:
				tempGr.drawRect(0, -that.height, that.width, that.height);
		}
		return tempGr;
	}

	Obstacle.prototype.update = function(elapsed) {

	}




	return Obstacle;	
};
export default buildObstacle;