var Render = function() {

	let self = this;

	let area = document.querySelector( '#render [data-name=area]')
		,ctx = area.getContext("2d");

	let areaIndents = 30;

	const grid = function() {

		let width = ( areaSize.x.min * -1) + areaSize.x.max + ( areaIndents * 2);
		let height = ( areaSize.y.min * -1) + areaSize.y.max + ( areaIndents * 2);

		ctx.canvas.width = width;
		ctx.canvas.height = height;

		ctx.beginPath();

		ctx.font = "12px Arial";
		ctx.fillStyle = '#22F';
		let posZero = decardToCanvasCoor( 0, 0);
		ctx.fillText( 0, posZero.x + 10, posZero.y - 10);

		let pos = decardToCanvasCoor( -1000, 0);
		ctx.moveTo( pos.x, pos.y);
		pos = decardToCanvasCoor( 1000, 0);
		ctx.lineTo( pos.x, pos.y);
		pos = decardToCanvasCoor( 0, -1000);
		ctx.moveTo( pos.x, pos.y);
		pos = decardToCanvasCoor( 0, 1000);
		ctx.lineTo( pos.x, pos.y);
		ctx.strokeStyle = "#22F";
		ctx.lineWidth = 1;
		ctx.stroke();

		for ( let x = posZero.x - 1000; x < 1000; x+= 50) {
			ctx.moveTo( x, 0);
			ctx.lineTo( x, 1000);

			if( x == posZero.x) { continue;}
			ctx.font = "8px Arial";
			ctx.fillStyle = '#22F';
			ctx.fillText( (x - posZero.x).toFixed(0), x, posZero.y - 5);
		}

		ctx.strokeStyle = "#eee";
		ctx.lineWidth = 0.5;
		ctx.stroke();

		ctx.closePath();
	}

	const clear = function(){
		ctx.clearRect(0, 0, area.width, area.height);
	}

	const calculateTurn = function( angle, turn = 0){

		/*
		 * Angles of area
		 *      ↑ N 90deg
		 *      |
		 * <====|====> E 0deg
		 *      |
		 *      ↓
		 */

		angle = angle + turn;

		if( angle > 360 || angle < -360){
			angle = angle % 360;
		}

		if( angle < 0){
			angle = 360 + angle;
		}

		return angle;
	}

	const calculatePoint = function( angle, h, x, y){
		x = parseFloat( x, 10);
		y = parseFloat( y, 10);

		/*
		 * See the theorem of Pythagoras
		 * ↑x  |\
		 * |   | \
		 * |   |  \ h (Hypotenuse)
		 * |   |   \
		 * |   |____\ angleA( not angle in arguments!)
		 * |
		 * |===========> y
		 */

		let point = [ null, null];

		/*
		 *        /|      |\        |"/A     A\"|
		 *   1. A/_|   2. |_\A   3. |/     4.  \|
		 */
		let angleA = null;
		if( angle < 90) {
			angleA = angle;
		} else if( angle < 180) {
			angleA = 180 - angle;
		} else if( angle < 270) {
			angleA = angle - 180;
		} else {
			angleA = 360 - angle;
		}

		let deltaX = h * Math.cos( angleA);
		let deltaY = h * Math.sin( angleA);

		if( angle < 90) {

		} else if( angle < 180) {
			deltaX = deltaX * -1;
		} else if( angle < 270) {
			deltaX = deltaX * -1;
			deltaY = deltaY * -1;
		} else {
			deltaY = deltaY * -1;
		}

		x+= deltaX;
		y+= deltaY;

		x = +x.toFixed( 4); //toFixed convert float to string =_= fuck. 2 hours to find a bug!
		y = +y.toFixed( 4);

		return { x: x, y: y}
	}

	const rend = function(){

		clear();
		grid();

		for( let line of lines){
			ctx.beginPath();
			let points = line.points;

			for( let idx in points){

				let point = points[ idx]
					,decPos = decardToCanvasCoor( point.x, point.y);

				if( idx == 0){
					ctx.moveTo( decPos.x, decPos.y);
				}

				ctx.lineTo( decPos.x, decPos.y)
			}


			ctx.lineWidth = ( 1 / lines.length) * line.lengthWeight;
			ctx.strokeStyle = randColor();
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			let endPoint = points[ points.length -1]
				,decEndPos = decardToCanvasCoor( endPoint.x, endPoint.y);
			ctx.arc( decEndPos.x, decEndPos.y, 4, 0, 2 * Math.PI);
			ctx.fillStyle = '#22F';
			ctx.fill();
			ctx.closePath();
		}

		//central point
		ctx.beginPath();
		ctx.strokeStyle = randColor();
		ctx.lineWidth = 2;
		ctx.stroke();

		let decCenterEnd = decardToCanvasCoor( centerEnd.x, centerEnd.y);
		ctx.arc( decCenterEnd.x, decCenterEnd.y, 5, 0, 2 * Math.PI);
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#0F0';
		ctx.stroke();

		ctx.arc( decCenterEnd.x, decCenterEnd.y, 5, 0, 2 * Math.PI);
		ctx.arc( decCenterEnd.x, decCenterEnd.y, 7, 0, 2 * Math.PI);
		ctx.lineWidth = 0.5;
		ctx.strokeStyle = '#000';
		ctx.stroke();

		ctx.closePath();

		//best end point
		ctx.beginPath();
		let decBestEndPoint = decardToCanvasCoor( bestEndPoint.x, bestEndPoint.y);
		ctx.arc( decBestEndPoint.x, decBestEndPoint.y, 2, 0, 2 * Math.PI);
		ctx.lineWidth = 0.5;
		ctx.strokeStyle = '#FFF';
		ctx.stroke();

		ctx.closePath();
	}

	const decardToCanvasCoor = function( x, y){

		/*
		 * Decard coordinate      Canvas coordinate
		 *         ↑ +y            |==============> +x
		 *         |               |zero
		 * -x =====|====> +x       |
		 *         |               |
		 *         | -y            ↓ +y
		 */

		//unsigned
		x+= ( areaSize.x.min * -1) + areaIndents;
		y+= ( areaSize.y.min * -1) + areaIndents;

		//minor y
		let height = ( areaSize.y.min * -1) + areaSize.y.max + ( areaIndents * 2);
		y = height - y;

		return {x: x, y: y}
	}

	let lines = null
		,centerEnd = { x: null, y: null}
		,bestEndPoint = { x: null, y: null}
		,areaSize = {
			x: { min:0, max: 0}
			,y: { min:0, max: 0}
		}

	this.rendDirections = function( directions) {
		lines = [];

		//calculate lines
		for( let direction of directions) {

			let line = []
				,lengthWeight = 0
				,current = {
					pos: { x: 0, y: 0}
					,angle: 0
				}

			for( let point of direction) {

				if( point.type == 'turn') {

					let turn = point.val;
					current.angle = calculateTurn( current.angle, turn);
					continue
				}

				if( point.type == 'walk') {

					let walk = point.val;
					current.pos = calculatePoint( current.angle, walk, current.pos.x, current.pos.y);
				} else { //point.type == 'start'
					current.pos.x = point.val.x;
					current.pos.y = point.val.y;
				}

				/*
				 * theorem of Pythagoras
				 * => a1^2 + b1^2 =/= a2^2 + b2^2 <= is lengthWeight
				 */
				lengthWeight+= Math.pow( current.pos.x, 2) + Math.pow( current.pos.y, 2);
				line.push( { x: current.pos.x, y: current.pos.y});

				if( areaSize.x.min > current.pos.x) { areaSize.x.min = current.pos.x}
				if( areaSize.x.max < current.pos.x) { areaSize.x.max = current.pos.x}
				if( areaSize.y.min > current.pos.y) { areaSize.y.min = current.pos.y}
				if( areaSize.y.max < current.pos.y) { areaSize.y.max = current.pos.y}
			}

			lines.push( { points: line, lengthWeight: lengthWeight});
		}

		//minimize lengthWeight number
		lines.sort( ( a, b) => {
			if( a.lengthWeight > b.lengthWeight){
				return -1;
			}
			return 1;
		});
		for( let idx in lines){
			lines[ idx].lengthWeight = idx + 1;
		}


		//calculate line weights
		centerEnd = { x: null, y: null};
		for( let line of lines){
			let lastIdx = line.points.length - 1;

			centerEnd.x+= line.points[ lastIdx].x;
			centerEnd.y+= line.points[ lastIdx].y;
		}
		centerEnd.x = ( centerEnd.x / lines.length);
		centerEnd.y = ( centerEnd.y / lines.length);

		//best end point
		bestEndPoint.x = 0;
		bestEndPoint.y = 0;

		for( let line of lines){
			let lastIdx = line.points.length - 1
				,endPoint= line.points[ lastIdx];

			let bestEndPointweight = Math.pow( bestEndPoint.x, 2) + Math.pow( bestEndPoint.y, 2);
			let weight = Math.pow( endPoint.x, 2) + Math.pow( endPoint.y, 2);

			if( bestEndPointweight < weight){
				bestEndPoint.x = endPoint.x;
				bestEndPoint.y = endPoint.y;
			}
		}


		rend();
	}
}