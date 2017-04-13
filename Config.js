function Config( baseConfig){

	let self = this;

	let form = document.forms.config
		,config = null;

	const setConfig = function( fields, save = true) {

		if( save){
			localStorage.config = JSON.stringify( fields);
		}
		config = fields;

		form.querySelector( '[name="testCasesCount.min"]').value = fields.testCasesCount.min;
		form.querySelector( '[name="testCasesCount.max"]').value = fields.testCasesCount.max;
		form.querySelector( '[name="directionsCount.min"]').value = fields.directionsCount.min;
		form.querySelector( '[name="directionsCount.max"]').value = fields.directionsCount.max;
		form.querySelector( '[name="instructionsCount.min"]').value = fields.instructionsCount.min;
		form.querySelector( '[name="instructionsCount.max"]').value = fields.instructionsCount.max;
		form.querySelector( '[name="walkLenght.min"]').value = fields.walkLenght.min;
		form.querySelector( '[name="walkLenght.max"]').value = fields.walkLenght.max;
		form.querySelector( '[name="startCoordinateMax"]').value = fields.startCoordinateMax;
	}

	//init config
	if( ! localStorage.config) {
		setConfig( baseConfig);
	} else {
		let fields = JSON.parse( localStorage.config);
		setConfig( fields, false);
	}

	//init form event
	this.submit = function(){

		let formData = new FormData( form);
		formData.forEach( ( val, key, arr) => {
			eval( `config.${key}=${val}`);
		});

		setConfig( config);
	}

	form.addEventListener( 'submit', function( e) {
		e.preventDefault();

		self.submit();
	});

	this.reset = function(){
		setConfig( baseConfig);
	}
	form.addEventListener( 'reset', function( e) {
		e.preventDefault();

		self.reset();
	});

	this.fields = function(){
		return config;
	}
}