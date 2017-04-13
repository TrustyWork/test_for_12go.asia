'use strict';

function randInt( min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randColor() {
	return "#"+((1<<24)*Math.random()|0).toString(16);
}

function randFloat( min, max, fix){
	return ((Math.random() * (max - min)) + min).toFixed( fix);
}

function randValInArr( arr){
	var key = randInt( 0, arr.length)
		,val = arr[ key];

	return val;
}

function isIntEven( val){
	 return !(val % 2);
}

