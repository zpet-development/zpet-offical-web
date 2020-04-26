// zdog-demo.js
function isIntersect(point, circle) {
  return Math.sqrt((point.clientX-circle.x) ** 2 + (point.clientY - circle.y) ** 2) < circle.radius;
}
console.table(console);
var images = [];
function loadImage(name) { images[name] = new Image(); images[name].src = "textures/" + name + ".png"; }
for (var textry = 0;textry < lnz.texture.length; textry++){
loadImage(lnz.texture[textry]);
}
console.log(images[lnz.ballzInfo[0][7]]);
var mouseDown = 0;
var breathInc = 0.1;
var breathDir = 1;
var breathAmt = 0;
var breathMax = 1;
var currentFrame = [];
var dragged = 0;
var pet = {};
var anim = [];
var isSleeping = 0;
var petStats = {
sleepness: 30,
fillness: 100,
};
var tapes=[];
function f(x,y,s,e){
    //console.table(x-(s/2) , x+(s/2),y-(s/2),y+(s/2));
return ((e.clientX > x-(s/2) && e.clientX<x+(s/2)) &&(e.clientY > y-(s/2) && e.clientY < y+(s/2)));
}
//toys and decorations are saved here, later i'll inject php here to get
var toys
window.onmousedown = ()=>{
mouseDown=1;
console.log('uwo');
}
window.onmouseup = ()=>{
mouseDown=0;
}
window.ontouchstart = ()=>{
mouseDown=1;
}
window.ontouchend = ()=>{
mouseDown=0;
}

var petDirection =[];
//honestly not used to power up canvas, but prevents zpet from going further of course!
var cans = document.getElementById('illo');
/*if (!window.mobilecheck){
//cans.width = screen.width;
//cans.height =screen.height;
}else{
cans.width = screen.width/2;
cans.height =screen.height/2;
}*/
//cans.width = 600;
//cans.height =600;


//console.log(cans.width);
//cans.width = 100;
//cans.height = 100;
var totalPetz =1;
var petSpeciez = []; //for example when we pick pets, machine will understand the species using this variable
var mood = [];
var petX = [[0,0,0],[0,0,0],[0,0,0]];
var petAngle = 0.78125;
var isStopped = [];
var speed = [];
var angleToDir = [{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1}];
var rotateDir = [4,5,6,7,0,1,2,3];
var item=[];
var petAddBallz = [];
const TAU = Zdog.TAU;
console.log(Zdog.TAU);
// create illo
var isSpinning = true;
const elem = '.illo'; //Which canvas to pick?
var colors = {
'red': '#ff0000',
'green': '#00ff00',
'blue': '#0000ff'
}
function isset(_var){
     return !!_var; // converting to boolean.
}
function findBall(ballnum,arra,arranum){
var pickedArray;
for(var arras = 0; arras < arra.length; arra++){
console.log(arra[arras]);
if (arra[arras][0] == ballnum){
pickedArray = arra[arras][arranum];
}
}
if (pickedArray != 'undefined') return pickedArray; else return false;
}
console.log(-(cans.width/2));
function choose() {
  return arguments[Math.floor(Math.random() * arguments.length)];
}
cans.width = screen.width;
cans.height =screen.height-90;
let illo = new Zdog.Illustration({
  element: elem,
  zoom: 1,
  dragRotate: true,
  //centered: true,
//isFullscreen:true
//pixelRatio:1
});

console.log(illo);
illo.element.style.cursor='move';
//                          ovo                                    //
// ------------------------------------------------------ model ------------------------------------------------ //
for(var ii = 0; ii < totalPetz; ii++){
petDirection[ii] = 4;
isStopped[ii] = 0;
speed[ii] = 0;
anim[ii]=0;
console.log(isStopped[ii]);
currentFrame[ii] = 0;
pet[ii] = new Zdog.Shape({
  addTo: illo,
  stroke: 0,
  color: 'red',
translate: {x:0,y: 0},
  //dragRotate: true,
});
console.log(pet[ii].translate);
for(var rr = 0; rr < miceConf.config.numBalls; rr++){
pet[ii][rr] = new Zdog.Shape({
  addTo: pet[ii],
  //stroke: 15,
fill: true,
  hasBorder: true,
  borderType:lnz.ballzInfo[rr][5],
  borderColor: lnz.ballzInfo[rr][6],
  //rotate: {x:0.5},
  translate: {},
  color: isset(lnz.ballzInfo[rr]) ? lnz.ballzInfo[rr][0] : 'grey',
  //dragRotate: true,
texture: isset(lnz.ballzInfo[rr][7]) ? images[lnz.ballzInfo[rr][7]]: false,
});


}
for(var oo = 1; oo <= lnz.addBallz.length; oo++){

petAddBallz[oo] = new Zdog.Shape({
  addTo: pet[ii][lnz.addBallz[oo-1][0]],
  stroke: lnz.addBallz[oo-1][5],
fill: true,
  borderType:lnz.addBallz[oo-1][6],
  borderColor: lnz.addBallz[oo-1][7],
  translate: {x:lnz.addBallz[oo-1][1],y:lnz.addBallz[oo-1][2],z:lnz.addBallz[oo-1][3]},
  color: lnz.addBallz[oo-1][4],
  //dragRotate: true,
texture: (lnz.addBallz[oo-1][8]!==-1) ? images[lnz.addBallz[oo-1][8]]: false
});

}
for(var ll = 0; ll < lnz.linez.length; ll++){
//linez
tapes[ll]=new Zdog.Tape({
//if ball isn't main one, count as add ball
startShape: ((lnz.linez[ll][0] <= 38) ? pet[ii][lnz.linez[ll][0]] : petAddBallz[lnz.linez[ll][0]-38]),
endShape:((lnz.linez[ll][1] <= 38) ? pet[ii][lnz.linez[ll][1]] : petAddBallz[lnz.linez[ll][1]-38]),
addTo:illo,
color: ((lnz.linez[ll][0] <= 38) ? pet[ii][lnz.linez[ll][0]].color : petAddBallz[lnz.linez[ll][0]-38].color),
texture:((lnz.linez[ll][0] <= 38) ? pet[ii][lnz.linez[ll][0]].texture : petAddBallz[lnz.linez[ll][0]-38].texture)
});
//console.log(pet[ii][lnz.linez[ll][0]].color);
}
}
//---------------------------------------addBallz--------------------------------//



// -------------------------------------------------------------- animate -------------------------------------------- //


function updateAnimation(ii) {

/*if (!isStopped[ii]){                      
currentFrame[ii] += 1;
}*/
currentFrame[ii] += 1;
if (currentFrame[ii] >= miceConf.ballz[anim[ii]].length) currentFrame[ii]=0;
//console.log(currentFrame[ii]);
}
function direction(dir,speed){
var x,y;
if (dir === 0){ x=speed; y=0; }else if (dir === 90){ x=0; y= -speed; }else if (dir === 180){ x= -speed; y=0; }else if (dir === 270){ x=0; y= -speed; }
//console.log(x,y);
return {x:x,y:y};
}

// update & render
//illo.updateRenderGraph();
function animate() {
illo.updateRenderGraph();
  // animate next frame
//requestAnimationFrame( animate );
}
// start animation
animate();
setInterval(function(){
//animate();
//  if ( isSpinning ) {
//updateBreath();
for(var ii = 0; ii < totalPetz; ii++){
updateAnimation(ii);
}
//---------------------------------------------------------------------------//
requestAnimationFrame( animate );
//animate();
//illo.updateRenderGraph();
for(var ii = 0; ii < totalPetz; ii++){
//console.log(pet[ii].rotate.y);
//console.log(petDirection[ii]);
//console.log(petDirection[ii]);
//pet[ii].translate.x += !isStopped[ii] ? (angleToDir[petDirection[ii]].x *speed[ii]) : 0;
//pet[ii].translate.y += !isStopped[ii] ? (angleToDir[petDirection[ii]].y *speed[ii]): 0;
//pet[ii].translate.z
pet[ii].rotate.y = petDirection[ii] * petAngle;
//pet[ii].rotate.y = petAngle * 4;
for(var rr = 0; rr < miceConf.config.numBalls; rr++){
  //console.log(currentFrame[ii]);
//console.log(((findBall(rr,lnz.move,1) != 'undefined') ? findBall(rr,lnz.move,1) : 0));
pet[ii][rr].translate.x = miceConf.ballz[anim[ii]][currentFrame[ii]][rr][1] + lnz.ballzInfo[rr][2];
pet[ii][rr].translate.y = miceConf.ballz[anim[ii]][currentFrame[ii]][rr][2] + lnz.ballzInfo[rr][3];
pet[ii][rr].translate.z = miceConf.ballz[anim[ii]][currentFrame[ii]][rr][3] + lnz.ballzInfo[rr][4];
//pet[ii][rr].color = isset(lnz.ballzInfo[rr]) ? lnz.ballzInfo[rr][0] : 'grey';
pet[ii][rr].borderType = lnz.ballzInfo[rr][5];
pet[ii][rr].borderColor = lnz.ballzInfo[rr][6];
pet[ii][rr].rotate.x = miceConf.ballz[anim[ii]][currentFrame[ii]][rr][6];
pet[ii][rr].rotate.y = miceConf.ballz[anim[ii]][currentFrame[ii]][rr][7];
pet[ii][rr].rotate.z = miceConf.ballz[anim[ii]][currentFrame[ii]][rr][8];
//console.log(isset(lnz.ballzInfo[36][0]));
pet[ii][rr].stroke = ((miceConf.ballz[anim[ii]][currentFrame[ii]][rr][4] + (isset(lnz.ballzInfo[rr]) ? lnz.ballzInfo[rr][1] : 0)) > 0) ? (miceConf.ballz[anim[ii]][currentFrame[ii]][rr][4] + (isset(lnz.ballzInfo[rr]) ? lnz.ballzInfo[rr][1] : 0)) : 0;
//console.log( miceConf.ballz[currentFrame][rr][2]);
//console.log( currentFrame);
//pet[ii][rr].translate.x = miceConf.ballz[currentFrame][rr][1];

}
for(var ll = 0; ll < lnz.linez.length; ll++){
//linez
tapes[ll].startShape= ((lnz.linez[ll][0] <= 38) ? pet[ii][lnz.linez[ll][0]] : petAddBallz[lnz.linez[ll][0]-38]);
tapes[ll].endShape=((lnz.linez[ll][1] <= 38) ? pet[ii][lnz.linez[ll][1]] : petAddBallz[lnz.linez[ll][1]-38]);
tapes[ll].addTo=illo;
tapes[ll].color= ((lnz.linez[ll][0] <= 38) ? pet[ii][lnz.linez[ll][0]].color : petAddBallz[lnz.linez[ll][0]-38].color);
tapes[ll].texture=((lnz.linez[ll][0] <= 38) ? pet[ii][lnz.linez[ll][0]].texture : petAddBallz[lnz.linez[ll][0]-38].texture);
//console.log(pet[ii][lnz.linez[ll][0]].color);
}
for(var oo = 1; oo <= lnz.addBallz.length; oo++){
//linez
petAddBallz[oo].translate= {x:lnz.addBallz[oo-1][1],y:lnz.addBallz[oo-1][2],z:lnz.addBallz[oo-1][3]},
//pet[ii][rr].color = lnz.addBallz[oo-1][4];
petAddBallz[oo].borderType = lnz.addBallz[oo-1][6];
petAddBallz[oo].borderColor = lnz.addBallz[oo-1][7];
//if (lnz.addBallz[oo-1][8]!=-1){petAddBallz[oo].texture=images[lnz.addBallz[oo-1][8]];}
}
}

//cans.width = window.innerWidth;
//cans.height = window.innerHeight;
//cans.style.width = cans.width+'px';
//cans.style.height = cans.height+'px';
//console.log(cans.style.height);


//event handler
//console.log(mouseDown);
if (dragged) isStopped[ii]=1;
//illoPic.drawImage(images['owo'],1,1);
cans.width = screen.width;
cans.height =screen.height-90;
//cans.width = window.innerWidth;
//cans.height = window.innerHeight;
if (illo.pixelRatio !=1) illo.pixelRatio=1;
},50);
function c(a,b,d){
for(var ii = 0; ii < totalPetz; ii++){
for(var rr = 0; rr < miceConf.config.numBalls; rr++){
if (lnz.ballzInfo[rr][8] == a){ pet[ii][rr].color=b;
if (d!=false){ pet[ii][rr].texture=images[d]; }else{
pet[ii][rr].texture=false;
}
}
}
for(var oo = 1; oo <= lnz.addBallz.length; oo++){
//console.log(lnz.addBallz[oo-1][9]);
if (lnz.addBallz[oo-1][9] ==a) { petAddBallz[oo].color=b;
if (d!=false){ petAddBallz[oo].texture=images[d]; console.log(d);}else{
petAddBallz[oo].texture=false;
}
console.log(petAddBallz[oo].texture==0);
}

}
}
}

console.log(cans.width);