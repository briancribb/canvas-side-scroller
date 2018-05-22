import buildMover from './scripts/classes/mover';
import buildSled from './scripts/classes/sled';
import buildDog from './scripts/classes/dog';
import buildGame from './scripts/game';
let classes = {};
classes.Mover = createjs.promote(buildMover(), "Shape");
classes.Sled = createjs.promote(buildSled(classes), classes.Mover);
classes.Dog = createjs.promote(buildDog(classes), classes.Mover);
let UglyDogs = buildGame("canvasContainer", classes);
UglyDogs.init();
//console.log(['index.js', classes, UglyDogs]);


/*
import _ from 'lodash';

function component() {
  var element = document.createElement('div');

  // Lodash, now imported by this script and blah.
  element.innerHTML = _.join(['Hello', 'webpack!!!!'], ' ');
  return element;
}

document.body.appendChild(component());
*/
