let utils = (GAME)=> {
  let classes = GAME.classes;
  return {
    getRandom: function(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },
    resetListeners: function() {
      GAME.props.handlers.onkeydown = function(){return;};
      GAME.props.handlers.onkeyup = function(){return;};
    },
    updateText: function( elapsed ) {
      //console.log('updateText()');
      if (createjs.Ticker.getTicks() % 20 == 0) {
        GAME.displayText.fps.text = "FPS: " + GAME.getFPS(elapsed);
      }
      GAME.displayText.level.text = 'Level: ' + GAME.level.current;
    },
    addObstacle: function( x, y, type = null ) {
        var tempBlock = new classes.Obstacle({
          type: type, 
          x: x,
          y: y
        });
        GAME.obstacles.push(tempBlock);
        GAME.stage.addChild(tempBlock);
    },
    addObstacleSet: function(x) {
      let numObj = GAME.utils.getRandom(3) + 1;
      let positions = [].concat(GAME.rows);
      let yValues = [];

      for (var i = 0; i < numObj; i++) {
        let tempIndex = GAME.utils.getRandom(positions.length);
        //console.log('-- '+tempIndex);
        yValues.push(positions[tempIndex]);
        positions.splice(tempIndex,1);
      }

      for (var i = 0; i < yValues.length; i++) {
        GAME.utils.addObstacle(x,  yValues[i], 'regular');
      }
    },
    updateObstacles: function( elapsed ) {
      if (GAME.obstacles.length === 0) return;

      let speed = GAME.level.baseSpeed + GAME.level.knobs.speed;
      GAME.rightmostPoint = 0;
      for (var i = GAME.obstacles.length - 1; i >= 0; i--) {
        if ( GAME.obstacles[i].x < -(GAME.obstacles[i].width+10) ) {
          GAME.stage.removeChild(GAME.obstacles[i]);
          GAME.obstacles.splice(i, 1);
        } else {
          GAME.obstacles[i].update(elapsed, speed);
          let rightEdge = GAME.obstacles[i].x + GAME.obstacles[i].width;

          // Keep track of the furthest edge of an object.
          if (rightEdge > GAME.rightmostPoint) {
            GAME.rightmostPoint = rightEdge;
          }
        }
      };

      //console.log(GAME.rightmostPoint);
      if ( GAME.rightmostPoint < (GAME.props.width - GAME.teamWidth) ) {
        GAME.utils.addObstacleSet(GAME.props.width + 10);
      }
    },
    hitTestBox: function(object1, object2) {
      var bounds1  = object1.getTransformedBounds(),
          bounds2 = object2.getTransformedBounds();

      var left1  = bounds1.x,
          left2 = bounds2.x,
          right1  = bounds1.x + bounds1.width,
          right2  = bounds2.x + bounds2.width,
          top1    = bounds1.y,
          top2    = bounds2.y,
          bottom1 = bounds1.y + bounds1.height,
          bottom2 = bounds2.y + bounds2.height;

      if (bottom1 < top2) return(false);
      if (top1 > bottom2) return(false);

      if (right1 < left2) return(false);
      if (left1 > right2) return(false);

      return(true);
    },
    hitTestDistance: function(object1, object2) {
      var  bounds1  = object1.getTransformedBounds(),
          bounds2 = object2.getTransformedBounds();

      var dx = (bounds2.x + object2.regX) - (bounds1.x + object1.regX),
          dy = (bounds2.y + object2.regY) - (bounds1.y + object1.regY),
          dist = Math.sqrt(dx * dx + dy * dy);

      if ( dist < object1.radius + object2.radius ) {
          return true;
      }
      return false;
    },
    checkHits: function() {
    }
  }
};
export default utils;