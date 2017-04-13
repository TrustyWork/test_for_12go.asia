//init
var baseConfig = {
	testCasesCount: {
		min: 2
		,max: 25
	}
	,directionsCount: {
		min: 1
		,max: 25
	}
	,instructionsCount: {
		min: 2
		,max: 10
	}
	,walkLenght: {
		min: 10
		,max: 100
	}
	,startCoordinateMax: 100
};
var config = new Config( baseConfig);
var render = new Render();
var input = new Input();

let form = document.forms.config;
//multi events
[ 'submit', 'reset'].forEach( ( val, key, arr) => {
	form.addEventListener( val, function( e) {
		e.preventDefault();
		run();
	})
})


const run = function(){
	let data = input.gen( config.fields()); //for test
	document.querySelector( '[data-name="output"]').innerHTML = data;

	//parse
	let testcases = input.parse( data);
	let form = document.forms.testcase;

	const rend = function( idx){
		let directions = testcases[ idx];

		if( ! directions) {
			console.warn( `no testcase ${idx}`);
			return;
		}

		render.rendDirections( directions);
	}

	form.addEventListener( 'submit', function( e) {
		e.preventDefault();

		let idx = ( form.querySelector( '[name="no"]').value - 1);
		rend( idx);
	});

	form.querySelector( '[name="no"]').value = 1;
	rend( 0);
}
run();