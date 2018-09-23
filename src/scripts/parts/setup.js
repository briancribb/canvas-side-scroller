let setup = (GAME)=> {
  return {
    createCanvas: function(targetID) {
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
  }
};
export default setup;