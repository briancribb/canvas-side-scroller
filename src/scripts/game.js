let buildGame = function(targetID, classes) {
  "use strict"
  // The targetID variable is available to the entire file.

  let GAME = {
    props: {
      width:600,    // Used when creating the canvas and testing its bounds.
      height:400,
      textColor: '#FFFD8A',
      keycodes: {
        p:    80, 
        n:    78,
        SPACE:  32,
        LEFT: 37,
        RIGHT:  39,
        UP:   38, 
        DOWN: 40
      },
      handlers: {
        onkeydown:function(){return;},
        onkeyup:function(){return;}
      }
    },
    displayText :  {
      fps: {},
      level: {}
    },
    sled : {},
    numSleds : 3,
    level:{
      current:0,
      knobs: {
      }
    },
    pause: function() {
      createjs.Ticker.paused = true;
    },
    play: function() {
      createjs.Ticker.paused = false;
    },
    init: function() {
      console.log('GAME.init()');
      /* Setting strings to match vendor visibility names. */
      if (typeof document.hidden !== "undefined") {
        GAME.hidden = "hidden", GAME.visibilityChange = "visibilitychange", GAME.visibilityState = "visibilityState";
      } else if (typeof document.mozHidden !== "undefined") {
        GAME.hidden = "mozHidden", GAME.visibilityChange = "mozvisibilitychange", GAME.visibilityState = "mozVisibilityState";
      } else if (typeof document.msHidden !== "undefined") {
        GAME.hidden = "msHidden", GAME.visibilityChange = "msvisibilitychange", GAME.visibilityState = "msVisibilityState";
      } else if (typeof document.webkitHidden !== "undefined") {
        GAME.hidden = "webkitHidden", GAME.visibilityChange = "webkitvisibilitychange", GAME.visibilityState = "webkitVisibilityState";
      }
      // We'll check this string against the document in the listener function.
      GAME.document_hidden = document[GAME.hidden];


      /* Setup */
      GAME.setup.createCanvas(targetID);
      GAME.state.swap('LOADING', true);
      GAME.setup.addListeners();
      GAME.play();
    },
    setup: {
      createCanvas: function() {
        GAME.canvas = document.createElement('canvas');
        GAME.canvas.width = GAME.props.width;
        GAME.canvas.height = GAME.props.height;
        GAME.context = GAME.canvas.getContext('2d');
        document.getElementById(targetID).appendChild(GAME.canvas);

        GAME.stage = new createjs.Stage(GAME.canvas);

        // Setting bounds so CreateJS doesn't keep calculating them.
        GAME.stage.setBounds(0, 0, GAME.props.width, GAME.props.height);
      },
      addListeners: function() {
        // Visibility API
        document.addEventListener(GAME.visibilityChange, function() {
          if(GAME.document_hidden !== document[GAME.hidden]) {
          if(document[GAME.hidden]) {
            // Pause the animation when the document is hidden.
            GAME.pause();
          } else {
            // When the document is visible, play the animation.
            GAME.play();
          }
          GAME.document_hidden = document[GAME.hidden];
          }
        });

        // http://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery
        document.onkeydown = function(event) {
          GAME.props.handlers.onkeydown( event || window.event );
          event.preventDefault(); // prevent the default action (scroll / move caret)
        };
        document.onkeyup = function(event) {
          GAME.props.handlers.onkeyup( event || window.event );
          event.preventDefault(); // prevent the default action (scroll / move caret)
        };

        // CreateJS Ticker
        createjs.Ticker.on("tick", GAME.tick);
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
      }
    },
    tick: function(event) {
      if ( createjs.Ticker.paused === false ) {
        //console.log('GAME.tick()');
        GAME.state.current.frame( createjs.Ticker.getEventTime() );
        GAME.stage.update(event); // important!!
      }
    },
    getFPS: function(elapsed) {
      return parseInt(createjs.Ticker.getMeasuredFPS());
    },
    utils: {
      resetListeners: function() {
        GAME.props.handlers.onkeydown = function(){return;};
        GAME.props.handlers.onkeyup = function(){return;};
      },
      updateText: function( elapsed ) {
        //console.log('updateText()');
        if (createjs.Ticker.getTicks() % 20 == 0) {
          GAME.displayText.fps.text = GAME.getFPS(elapsed);
        }
        GAME.displayText.level.text = 'Level: ' + GAME.level.current;
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
    },
    state: {
      current : null,
      //update  : null,
      swap : function(newState, init = false){
        if (init !== true) {
            GAME.utils.resetListeners();
            GAME.state.current.cleanup();
        }
        GAME.state.current = GAME.state[newState];
        GAME.state.current.setup();
      },
      LOADING : {
        setup : function(elapsed){
          // Any one-time tasks that happen when we switch to this state.
          //console.log('LOADING.setup()');
        },
        frame : function(elapsed){
          // State function to run on each tick.
          //console.log('-- LOADING.frame()');
          GAME.state.swap('TITLE');
        },
        cleanup : function(elapsed){
          // Anything that needs to be removed at the end of this state.
          //console.log('---- LOADING.cleanup()');
        }
      },
      TITLE : {
        setup : function(elapsed){
          //console.log('TITLE.setup()');
          GAME.props.handlers.onkeyup = function(event) {
            switch(event.which || event.keyCode) {
              case GAME.props.keycodes.SPACE:
                GAME.state.swap('NEW_GAME');
              break;
                default: return; // exit this handler for other keys
            }
          }

          /* Creating the title screen. */
          var title = new createjs.Text( 'Some Kind of Game-type Thing', '18px Arial', '#ffffff' );
          title.textAlign = "center";
          title.x = GAME.canvas.width/2;
          title.y = GAME.canvas.height/2 - 20;
          title.name = 'title';
          GAME.stage.addChild(title);

          var subtitle = new createjs.Text( 'Press spacebar to continue...', '12px   Arial', '#ffffff' );
          subtitle.textAlign = "center";
          subtitle.x = GAME.canvas.width/2;
          subtitle.y = GAME.canvas.height/2 + 10;
          subtitle.name = 'subtitle';
          GAME.stage.addChild(subtitle);
          GAME.state.swap('NEW_GAME');
        },
        frame : function(elapsed){
          //console.log('-- TITLE.frame()');
        },
        cleanup : function(elapsed){
          //console.log('---- TITLE.cleanup()');
          GAME.stage.removeChild( GAME.stage.getChildByName('title') );  
          GAME.stage.removeChild( GAME.stage.getChildByName('subtitle') );
        }
      },
      NEW_GAME : {
        // Sets defaults to zero and clears everything out.
        setup : function(){
          console.log('NEW_GAME.setup()');
          // Any one-time tasks that happen when we switch to this state.

          /* Make all the stuff that will always remain on the stage. */
          GAME.displayText.fps = new createjs.Text("FPS", "14px Arial", GAME.props.textColor);
          GAME.displayText.fps.textAlign = "right";
          GAME.displayText.fps.x = GAME.canvas.width - 10;
          GAME.displayText.fps.y = 10;
          GAME.displayText.fps.name = 'txtFPS';
          GAME.stage.addChild(GAME.displayText.fps);

          /* Make all the stuff that will always remain on the stage. */
          GAME.displayText.level = new createjs.Text("Level: " + GAME.level.current, "14px Arial", GAME.props.textColor);
          GAME.displayText.level.textAlign = "right";
          GAME.displayText.level.x = GAME.canvas.width - 10;
          GAME.displayText.level.y = 30;
          GAME.displayText.level.name = 'txtLevel';
          GAME.stage.addChild(GAME.displayText.level);
        },
        frame : function(elapsed){
          //console.log(['-- NEW_GAME.frame()']);
          GAME.state.swap('NEW_LEVEL');
        },
        cleanup : function(){
          console.log('---- NEW_GAME.cleanup()');
        }
      },
      NEW_LEVEL : {
        // Sets the level knobs
        setup : function(){
          console.log('NEW_LEVEL.setup()');
          // Any one-time tasks that happen when we switch to this state.
          GAME.level.current ++;
        },
        frame : function(elapsed){
          //console.log('-- NEW_LEVEL.frame()');
          GAME.state.swap('PLAYER_START');
        },
        cleanup : function(){
          console.log('---- NEW_LEVEL.cleanup()');
        }
      },
      PLAYER_START : {
        // Fades the player ship in from zero to full
        setup : function(){
          console.log('PLAYER_START.setup()');
          // Any one-time tasks that happen when we switch to this state.


          GAME.leadDog = new classes.Dog({
            x:GAME.canvas.width/2,
            y:GAME.canvas.height/2
          });
          GAME.stage.addChild(GAME.leadDog);




        },
        frame : function(elapsed){
          //console.log('-- PLAYER_START.frame()');
          GAME.utils.updateText(elapsed);
          GAME.state.swap('PLAY_LEVEL');
        },
        cleanup : function(){
          console.log('---- PLAYER_START.cleanup()');
        }
      },
      PLAY_LEVEL : {
        // Everything is active and the player can play
        setup : function(){
          console.log('PLAY_LEVEL.setup()');
          // Any one-time tasks that happen when we switch to this state.
          GAME.props.handlers.onkeydown = function(event) {
            switch(event.which || event.keyCode) {
              case GAME.props.keycodes.p: // p
                if (createjs.Ticker.paused === true) {
                  GAME.play();
                } else {
                  GAME.pause();
                }
                break;

              case GAME.props.keycodes.LEFT: // left
                console.log('left');
                break;

              case GAME.props.keycodes.UP: // up
                console.log('up');
                break;

              case GAME.props.keycodes.RIGHT: // right
                console.log('right');
                break;

              case GAME.props.keycodes.DOWN: // down
                console.log('down');
                break;

              case GAME.props.keycodes.SPACE: // space
                console.log('space');
                break;

              default: return; // exit this handler for other keys
            }
          }
          GAME.props.handlers.onkeyup = function(event) {
            switch(event.which || event.keyCode) {
              case GAME.props.keycodes.UP: // up
                break;
              case GAME.props.keycodes.LEFT: // left
                break;
              case GAME.props.keycodes.RIGHT: // right
                break;
              default: return; // exit this handler for other keys
            }
          }
        },
        frame : function(elapsed){
          // console.log('-- PLAY_LEVEL.frame()');
          // move 100 pixels per second: 
          // (elapsedTimeInMS / 1000msPerSecond * pixelsPerSecond):
          GAME.utils.updateText();
          // GAME.state.swap('PLAYER_DIE');
        },
        cleanup : function(){
          console.log('---- PLAY_LEVEL.cleanup()');
          GAME.utils.resetListeners();
        }
      },
      PLAYER_DIE : {
        // The player ship blows up and returns to PLAYER_START, if the player has ships.
        setup : function(){
          console.log('PLAYER_DIE.setup()');
        },
        frame : function(elapsed){
          console.log('-- PLAYER_DIE.frame()');
          GAME.state.swap('GAME_OVER');
        },
        cleanup : function(){
          console.log('---- PLAYER_DIE.cleanup()');
        }
      },
      GAME_OVER : {
        // The player is out of ships, so display the final score.
        setup : function(){
          console.log('GAME_OVER.setup()');
          GAME.props.handlers.onkeyup = function(event) {
            switch(event.which || event.keyCode) {
              case GAME.props.keycodes.n: // left
                GAME.state.swap('TITLE');
                break;
              default: return; // exit this handler for other keys
            }
          }

          /* Creating the title screen. */
          var title = new createjs.Text( 'GAME OVER', '24px Arial', '#ffffff' );
          title.textAlign = "center";
          title.x = GAME.canvas.width/2;
          title.y = GAME.canvas.height/2 - 20;
          title.name = 'title';
          GAME.stage.addChild(title);

          var subtitle = new createjs.Text( "Hit the 'n' for a new game.", '12px Arial', '#ffffff' );
          subtitle.textAlign = "center";
          subtitle.x = GAME.canvas.width/2;
          subtitle.y = GAME.canvas.height/2 + 10;
          subtitle.name = 'subtitle';
          GAME.stage.addChild(subtitle);
        },
        frame : function(elapsed){
          //console.log('-- GAME_OVER.frame()');
          GAME.utils.updateText();
        },
        cleanup : function(){
          console.log('---- GAME_OVER.cleanup()');
          GAME.utils.resetListeners();
          GAME.stage.removeAllChildren();
        }
      }
    }
   }
   console.log([targetID, classes, GAME]);
   return GAME;
}; // End of buildGame()
export default buildGame;