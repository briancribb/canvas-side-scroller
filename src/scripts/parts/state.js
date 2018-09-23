let state = (GAME)=> {
  let classes = GAME.classes;

  return {
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
        //console.log('NEW_GAME.setup()');
        // Any one-time tasks that happen when we switch to this state.


        let bgGraphics = new createjs.Graphics().beginFill("#fff").drawRect(0, 0, GAME.props.width, GAME.props.height);
        GAME.background = new createjs.Shape(bgGraphics);
        GAME.stage.addChild(GAME.background);

        /* Make all the stuff that will always remain on the stage. */
        GAME.displayText.level = new createjs.Text("Level: " + GAME.level.current, "24px Arial", GAME.props.textColor);
        GAME.displayText.level.textAlign = "right";
        GAME.displayText.level.x = GAME.canvas.width - 10;
        GAME.displayText.level.y = 10;
        GAME.displayText.level.name = 'txtLevel';
        GAME.stage.addChild(GAME.displayText.level);

        GAME.displayText.sleds = new createjs.Text("Sleds: " + GAME.numSleds, "24px Arial", GAME.props.textColor);
        GAME.displayText.sleds.textAlign = "right";
        GAME.displayText.sleds.x = GAME.canvas.width - 10;
        GAME.displayText.sleds.y = 40;
        GAME.displayText.sleds.name = 'txtSleds';
        GAME.stage.addChild(GAME.displayText.sleds);

        GAME.displayText.fps = new createjs.Text("", "24px Arial", GAME.props.textColor);
        GAME.displayText.fps.textAlign = "right";
        GAME.displayText.fps.x = GAME.canvas.width - 10;
        GAME.displayText.fps.y = 70;
        GAME.displayText.fps.name = 'txtFPS';

        GAME.stage.addChild(GAME.displayText.fps);
      },
      frame : function(elapsed){
        //console.log(['-- NEW_GAME.frame()']);
        GAME.state.swap('NEW_LEVEL');
      },
      cleanup : function(){
        //console.log('---- NEW_GAME.cleanup()');
      }
    },
    NEW_LEVEL : {
      // Sets the level knobs
      setup : function(){
        //console.log('NEW_LEVEL.setup()');
        // Any one-time tasks that happen when we switch to this state.
        GAME.level.current ++;
      },
      frame : function(elapsed){
        //console.log('-- NEW_LEVEL.frame()');
        GAME.state.swap('PLAYER_START');
      },
      cleanup : function(){
        //console.log('---- NEW_LEVEL.cleanup()');
      }
    },
    PLAYER_START : {
      // Fades the player ship in from zero to full
      setup : function(){
        //console.log('PLAYER_START.setup()');
        // Any one-time tasks that happen when we switch to this state.

        // Dogs are 15 pixels wide.
        GAME.leadDog = new classes.Dog({name:'leadDog', color:'#BADA55'});
        GAME.swingDog = new classes.Dog({name:'swingDog', color:'#f00'});
        GAME.teamDog = new classes.Dog({name:'teamDog', color:'#0f0'});
        GAME.wheelDog = new classes.Dog({name:'wheelDog', color:'#00f'});

        GAME.sled = new classes.Sled({
          x: 50,
          y: GAME.rows[GAME.currentRow]
        });

        GAME.sledTeam = [
          GAME.leadDog,
          GAME.swingDog,
          GAME.teamDog,
          GAME.wheelDog,
          GAME.sled
        ];


        GAME.sled.team = GAME.sledTeam;

        // Place the dog team.
        for (var i = GAME.sledTeam.length - 2; i >= 0; i--) {
          let current = GAME.sledTeam[i],
              previous = GAME.sledTeam[i+1];

          current.x = previous.x + previous.width + 15;
          current.y = GAME.sled.y;
          GAME.stage.addChild(current);
        }
        GAME.stage.addChild(GAME.sled);

        // Get the length of the whole team
        GAME.teamWidth = (GAME.leadDog.x + GAME.leadDog.width) - GAME.sled.x

        GAME.utils.addObstacleSet(GAME.props.width + 10);
      },
      frame : function(elapsed){
        //console.log('-- PLAYER_START.frame()');
        GAME.utils.updateText(elapsed);
        GAME.state.swap('PLAY_LEVEL');
      },
      cleanup : function(){
        //console.log('---- PLAYER_START.cleanup()');
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
              if ( GAME.currentRow > 0 && GAME.sled.ready === true ) {
                GAME.currentRow --;
                GAME.sled.moveTeam( GAME.rows[GAME.currentRow] );
              }
              break;

            case GAME.props.keycodes.RIGHT: // right
              console.log('right');
              break;

            case GAME.props.keycodes.DOWN: // down
              console.log('down', GAME.sled);
              if ( GAME.currentRow < GAME.rows.length - 1 && GAME.sled.ready === true ) {
                GAME.currentRow ++;
                GAME.sled.moveTeam( GAME.rows[GAME.currentRow] );
              }
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
        for (var i = GAME.sledTeam.length - 1; i >= 0; i--) {
          GAME.sledTeam[i].update(elapsed);
        }
        GAME.utils.updateObstacles(elapsed);
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

};
export default state;