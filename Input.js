//This constructor for generate test input only
function Input() {

	var self = this;

	/*
	 * https://open.kattis.com/problems/alldifferentdirections
	 * Example input:
	 *
	 * 3
	 * 87.342 34.30 start 0 walk 10.0
	 * 2.6762 75.2811 start -45.0 walk 40 turn 40.0 walk 60
	 * 58.518 93.508 start 270 walk 50 turn 90 walk 40 turn 13 walk 5
	 * 2
	 * 30 40 start 90 walk 5
	 * 40 50 start 180 walk 10 turn 90 walk 5
	 * 0
	 */
	this.gen = ( config) => {

		const genCoordinate = function(){

			var coordinate = ''
				+ randFloat( 0, config.startCoordinateMax, 4) //latitude
				+ ' '
				+ randFloat( 0, config.startCoordinateMax, 4); //longitude

			return coordinate;
		}

		const genInstruction = function( name){

			var val = null;
			if( ['turn', 'start'].indexOf( name) != -1) {
				val = randInt( -360, 360);
			} else { //name == 'walk'
				val = randInt( config.walkLenght.min, config.walkLenght.max);
			}

			var input = `${name} ${val}`;
			return input;
		}


		let input = [];

		let testCasesCount = randInt( config.testCasesCount.min, config.testCasesCount.max);
		for (let i = 0; i < testCasesCount; i++) {

			let datarows = []
				,directionsCount = randInt( config.directionsCount.min, config.directionsCount.max);

			//gen instructions
			let instructions = [];
			for(let i = 0; i < directionsCount; i++) {

				let instruction = genCoordinate()
					,instructionsCount = randInt( config.instructionsCount.min, config.instructionsCount.max);
				for(let i = 0; i < instructionsCount; i++) {

					//start => walk => turn => walk => turn => .....
					let name = '';
					if( i == 0) {
						name = 'start';
					} else if ( !isIntEven( i)){
						name = 'walk';
					} else {
						name = 'turn';
					}

					instruction+= ` ${genInstruction( name)}`;
				}

				instructions.push( instruction);
			}

			//collect case
			input.push( directionsCount);
			input = input.concat( instructions);
		}

		input.push( 0);
		input = input.join( '\n');

		return input;
	}


	this.parse = ( data) => {

		//case separator
		let testcases = [];
		var rows = data.split( '\n');
		for( let i = 0; i < rows.length; i++){

			let testcase = [];
			//The first line is the number of rows of data after it. Skip them.
			let datarowCount = parseInt( rows[i], 10);

			if( datarowCount == 0) { //end
				break;
			}

			if( datarowCount >= 25) { //max 25 step
				console.warn( 'Too much step!');
			}

			let nextCaseIdx = i + datarowCount;

			//instructions separator

			for( ;i < nextCaseIdx; i++){

				let row = rows[i+1].split( ' ')
					,instructions = [];

				//format start
				instructions.push( {
					type: 'start'
					,val: { //lat & lan
						x: parseFloat( row.shift(), 10)
						,y: parseFloat( row.shift(), 10)
					}
				});

				row[0] = 'turn'; //'start' exchange to 'turn'

				//other row
				while( row.length){
					instructions.push( {
						type: row.shift()
						,val: parseFloat( row.shift(), 10)
					});
				}

				testcase.push( instructions);
			}

			testcases.push( testcase);
		}

		return testcases;
	}
}