// HSV to RGB color conversion by Bjorn Tipling
// http://www.sharewonders.com/archives/2006/04/13/javascript-hsl-and-rgb-conversion-functions/
function Hue_2_RGB( v1, v2, vH )
{
    //formula from easyrgb.com converted to JavaScript by me 
    //Function Hue_2_RGB
    if( vH < 0 ){
        vH += 1;
    }
    if( vH > 1 ){
        vH -= 1;
    }
    if(( 6 * vH ) < 1 ){
        return ( v1 + ( v2 - v1 ) * 6 * vH );
    }
    if(( 2 * vH ) < 1 ){
        return v2;
    }
    if(( 3 * vH ) < 2 ){
        return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );
    }
    return v1;
}

function hsl_to_rgb(H,S,L){
    //formula from easyrgb.com converted to JavaScript by me
    var R;
    var G;
    var B;
    var var_1;
    var var_2;
    var returnObject;

    returnObject = new Object;

    if( S == 0 ){
        //HSL values = 0 to 1
	R = L * 255; //RGB results = 0 ? 255
	G = L * 255;
	B = L * 255;
    }else{
	if( L < (1/2) ){
	    var_2 = (L * ( 1 + S ));
        }else{
            var_2 = (( L + S ) - ( S * L ));
        }

        var_1 = ((2 * L) - var_2);

	R = 255 * Hue_2_RGB( var_1, var_2, (H + ( 1 / 3 )) );
	G = 255 * Hue_2_RGB( var_1, var_2, H );
	B = 255 * Hue_2_RGB( var_1, var_2, (H - ( 1 / 3 )) );
    }

    returnObject['r'] = R;
    returnObject['g'] = G;
    returnObject['b'] = B;

    return returnObject;
}

function hsl_to_webColor(h,s,l) {
    //converting HSL to RGB webcolor
    //does not prefix a '#’
    var rgbObject;
    var rgb;
    var r_dec;
    var g_dec;
    var b_dec;
    var r_hex;
    var g_hex;
    var b_hex;
    var concat_pad = "0";

    //calling function with converted formula from easyrbg.com
    rgbObject = hsl_to_rgb(h,s,l);
    r_dec = Math.abs(Math.floor(rgbObject['r']));
    g_dec = Math.abs(Math.floor(rgbObject['g']));
    b_dec = Math.abs(Math.floor(rgbObject['b']));

    if(r_dec > 255){
	 r_dec = r_dec - 255;
    }
    else if(r_dec < 0){
	 r_dec = 0;
    }

    if(g_dec > 255){
	 g_dec = g_dec - 255;
    }
    else if(g_dec < 0){
	 g_dec = 0;
    }

    if(b_dec > 255){
        b_dec = b_dec - 255;
    }else if(b_dec < 0){
    b_dec = 0;
    }
    r_hex = r_dec.toString(16); //converting to hex
    if(r_hex.length < 2){
        r_hex = concat_pad.concat(r_hex);
    }
    g_hex = g_dec.toString(16); //converting to hex
    if(g_hex.length < 2){
        g_hex = concat_pad.concat(g_hex);
    }
    b_hex = b_dec.toString(16); //converting to hex
    if(b_hex.length < 2){
        b_hex = concat_pad.concat(b_hex);
    }
    rgb = r_hex + g_hex + b_hex;
    return rgb;
}

// Munching Squares, this implementation by Jean-Alain Le Borgne
// http://jalb.fr
var squaresBits= 8;
var squaresDimension= 1 << squaresBits;
var squaresXMask= squaresDimension - 1;
var number= 0;
var squaresSeed= 0;
var squaresMask= (squaresDimension * squaresDimension) - 1;

var timer;
var timerActive= false;

var ctx;
var midi;

function InitMunchingSquares() {
    squaresMax= squaresDimension * squaresDimension;

    ieCanvasInit();

    midi= document.getElementById('MIDI');
    console.log('midi: ', midi);
}

function StopTimer() {
    clearInterval(timer);
    timer= null;
    timerActive= false;
}

var inAnimate= false;

function Animate() {
    var x= number & squaresXMask;
    var y= (number >> squaresBits) ^ x;
    var color= "#" + hsl_to_webColor(number / squaresMax, 1, 0.5);

    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(x,y);
    ctx.fillRect(0,0,1,1);
    ctx.restore();

    var delay = 0;
    var note = x;
    var velocity = 127;
    midi.setVolume(0, 127);
    midi.noteOn(0, note, velocity, delay);
    midi.noteOff(0, note, delay + 0.75);

    number= (number + squaresSeed) & squaresMask;
    //log.debug("number: " + number + ", x: " + x + ", y: " + y + ", color: " + color);
    if (number == 0) {
	StopTimer();
    }
}

function StopMunchingSquares() {
	if (timerActive) {
		StopTimer();
	}
}

function StartMunchingSquares(seed) {
    squaresSeed= parseInt(seed);
    StopMunchingSquares();

    var canvas = document.getElementById('canvas');
    ctx= canvas.getContext("2d");
    ctx.clearRect(0, 0, squaresDimension, squaresDimension);

    number= 0;
    if (!timerActive) {
	    timerActive= true;
	    timer = setInterval(Animate, 1);
	}
}

if(window.addEventListener) {
	window.addEventListener('load', function(evt) {
		InitMunchingSquares( );
	}, false);
}
else if(window.attachEvent) {
	window.attachEvent('onload', function(evt) {
		InitMunchingSquares( );
	});
}
