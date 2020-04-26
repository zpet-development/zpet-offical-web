/**
 * Tape
 */
//this is a gnarly mess at the moment

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./vector'),
        require('./path-command'), require('./anchor') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Tape = factory( Zdog, Zdog.Vector, Zdog.PathCommand, Zdog.Anchor );
  }
}( this, function factory( utils, Vector, PathCommand, Anchor ) {

var Tape = Anchor.subclass({
	startShape: null,
	endShape: null,

  stroke: 0,
  fill: true,
  color: '#333',
  closed: true,
  visible: true,
  path: [ {} ],
  front: { z: 1 },
  texture: false
});

Tape.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  this.updatePath();
  // front
  this.front = new Vector( options.front || this.front );
  this.renderFront = new Vector( this.front );
  this.renderNormal = new Vector();
};

var actionNames = [
  'move',
  'line',
  'bezier',
  'arc',
];

Tape.prototype.updatePath = function() {
  this.setPath();
  this.updatePathCommands();
};

// place holder for Ellipse, Rect, etc.
Tape.prototype.setPath = function() {};

// parse path into PathCommands
Tape.prototype.updatePathCommands = function() {
  var previousPoint;
  this.pathCommands = this.path.map( function( pathPart, i ) {
    // pathPart can be just vector coordinates -> { x, y, z }
    // or path instruction -> { arc: [ {x0,y0,z0}, {x1,y1,z1} ] }
    var keys = Object.keys( pathPart );
    var method = keys[0];
    var points = pathPart[ method ];
    // default to line if no instruction
    var isInstruction = keys.length == 1 && actionNames.indexOf( method ) != -1;
    if ( !isInstruction ) {
      method = 'line';
      points = pathPart;
    }
    // munge single-point methods like line & move without arrays
    var isLineOrMove = method == 'line' || method == 'move';
    var isPointsArray = Array.isArray( points );
    if ( isLineOrMove && !isPointsArray ) {
      points = [ points ];
    }


		//this is 3d and doesnt seem to get called on draw?

		//ok should we rewrite this for stuff to send to the renderer? idk

    // first action is always move
    method = i === 0 ? 'move' : method;
    // arcs require previous last point
    var command = new PathCommand( method, points, previousPoint );
    // update previousLastPoint
    previousPoint = command.endRenderPoint;
    return command;
  });
};

// ----- update ----- //

Tape.prototype.reset = function() {

};

Tape.prototype.transform = function( translation, rotation, scale ) {
	//do something here??? for children attached to midpoint?
};

Tape.prototype.updateSortValue = function() {
	//putting it juuust behind the backmost dot
	this.sortValue = this.endShape.renderOrigin.z-0.01;
  if (this.startShape.renderOrigin.z < this.endShape.renderOrigin.z){
		this.sortValue = this.startShape.renderOrigin.z-0.01;
	}
};

// ----- render ----- //

Tape.prototype.render = function( ctx, renderer ) {
  var length = this.pathCommands.length;
  if ( !this.visible || !length ) {
    return;
  }
  if ( !renderer ) {
    throw new Error( 'Zdog renderer required. Set to ' + renderer );
  }

	//yeah
	if ( renderer.isCanvas){
  	this.renderCanvasTape( ctx, renderer );
	} else {
		//svg render function????
		this.renderPath(ctx, renderer);
	}

};

var TAU = utils.TAU;
// Safari does not render lines with no size, have to render circle instead

Tape.prototype.tapePoints = function( ctx ) {
	var start = this.startShape;
	var startRadius = start.stroke/2;
	var startPos = start.renderOrigin.copy();
	var end = this.endShape;
	var endRadius = end.stroke/2;
	var endPos = end.renderOrigin.copy();
	//get direction between dots
	var direction = new Vector({x:startPos.x-endPos.x,
                              y:startPos.y-endPos.y});
	direction.normalise();
	//get perpendicular of direction
	var perp = new Vector({x:-direction.y,
                          y:direction.x});
	 
	var points = [];
	points.push(perp.copy().multiply(startRadius).add(startPos));
	points.push(perp.copy().multiply(endRadius).add(endPos));
	points.push(perp.copy().multiply(-endRadius).add(endPos));
	points.push(perp.copy().multiply(-startRadius).add(startPos));

	return points;
}

Tape.prototype.renderCanvasTape = function( ctx ) {
	//JUST DO EVERYTHING IN HERE AND RENAME IT LATER
if (this.texture != false){this.pattern = ctx.createPattern(this.texture, "repeat");}
  ctx.fillStyle = (this.texture!=false)?this.pattern:this.color;

  ctx.beginPath();


	ctx.lineWidth = 10;
	ctx.lineCap = "round";

	var points = this.tapePoints();
	
	//maybe we should figure out how to send this off to the renderer instead
	ctx.moveTo(points[0].x,points[0].y);
	ctx.lineTo(points[1].x,points[1].y);
	ctx.lineTo(points[2].x,points[2].y);
	ctx.lineTo(points[3].x,points[3].y);
	ctx.closePath();

  ctx.fill();

	
};

//vector functions for the stuff you know
Vector.prototype.divide = function(scalar) {
	this.x /= scalar;
	this.y /= scalar;
	this.z /= scalar;
	return this;
}
Vector.prototype.normalise = function() {
	this.divide(this.magnitude2d());
	return this;
}


Tape.prototype.getLineWidth = function() {
  if ( !this.stroke ) {
    return 0;
  }
  if ( this.stroke == true ) {
    return 1;
  }
  return this.stroke;
};



Tape.prototype.renderPath = function( ctx, renderer ) {
	//gonna need to write some shit here for svg
	//wait didnt i already write the svg code??

  var elem = this.getRenderElement( ctx, renderer );
  var isTwoPoints = this.pathCommands.length == 2 &&
    this.pathCommands[1].method == 'line';
  var isClosed = true;
  var color = this.color;

  //renderer.renderPath( ctx, elem, this.pathCommands, isClosed );

	var points = this.tapePoints();
	elem.setAttribute( 'd', 'M'+points[0].x + ' '+points[0].y
												+	'L'+points[1].x + ' '+points[1].y 
												+	'L'+points[2].x + ' '+points[2].y 
												+	'L'+points[3].x + ' '+points[3].y 
												+	'Z');

  renderer.stroke( ctx, elem, this.stroke, color, this.getLineWidth() );
	var isFill = true;
  renderer.fill( ctx, elem, isFill, color );
  renderer.end( ctx, elem );
};

var svgURI = 'http://www.w3.org/2000/svg';

Tape.prototype.getRenderElement = function( ctx, renderer ) {
  if ( !renderer.isSvg ) {
    return;
  }
  if ( !this.svgElement ) {
    // create svgElement
    this.svgElement = document.createElementNS( svgURI, 'path');
    this.svgElement.setAttribute( 'stroke-linecap', 'round' );
    this.svgElement.setAttribute( 'stroke-linejoin', 'round' );
  }
  return this.svgElement;
};

return Tape;

}));
