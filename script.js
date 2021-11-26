const mode = [
	{
		'id' : 'max',
		'label' : 'Seleziona il numero <span class="mode-label">più grande</span>',
	},
	{
		'id' : 'min',
		'label' : 'Seleziona il numero più <span class="mode-label">piccolo</span>',
	},
];


let bgPlay = false;
let audio = document.getElementById("bg-audio");
let audioOK = document.getElementById("audio-ok");
let audioFail = document.getElementById("audio-fail");
let audioFlip = document.getElementById("audio-flip");
let audioIntro = document.getElementById("audio-intro-text");
let audioBooster = document.getElementById("audio-booster");
let audioBoosterLost = document.getElementById("audio-booster-lost");
let audioNewLevel = document.getElementById("audio-new-level");
let audioGood = document.getElementById("audio-good");
let audioOps = document.getElementById("audio-ops");

let selectedMode = Math.floor( Math.random() * mode.length );
let level = 3;
let game = 0;
let cardsValues = [];
let levelText = document.getElementById('level-text');
let errors = 0;
let multiplyScore = 1;
let multiplyScoreCountRate = 3;
let multiplyScoreCount = 0;

function randomCard( mode, number ) {

	let random = Math.floor( Math.random() * 100 );
	while( cardsValues.includes( random ) ) {
		random = Math.floor( Math.random() * 100 );
	}

	let cardsContainer = document.getElementById( 'cards-container' );
	const card = document.createElement( 'div' );
	card.classList.add('card', 'card-' + number );
	card.innerHTML = '<div class="card__face card__face--front"><span id="card-' + number +'" class="card-suit" data-card-value="' + random + '" data-mode="' + mode + '">' + random + '</span></div><div class="card__face card__face--back"></div>';
	const scene = document.createElement('div');
	scene.classList.add('scene', 'scene--card' );
	scene.appendChild(card);
	cardsContainer.appendChild(scene);

	return random;

}
function initGame( selectedMode, level ){

	if( bgPlay === false) {
		bgPlay = true;
		audioIntro.play();
		setTimeout( function(){
			audio.play();
			audio.volume = 0.2;
		}, 1000 );
		document.getElementById('intro-text').classList.toggle('d-none');
		document.getElementById('points-container').classList.toggle('d-none');
	}

	game++;

	for (let s = 1; s < level; s++) {

		cardsValues[s-1] = randomCard( mode[ selectedMode ].id, s );

	}

	let gameElem = document.getElementById( 'game' );
	gameElem.innerHTML = game;

	let modeTitle = document.getElementById( 'mode' );
	modeTitle.innerHTML = mode[ selectedMode ].label;
	let cards = document.querySelectorAll( ".scene--card" );
	for ( let i = 0 ; i < cards.length; i++ ) {
		cards[ i ].addEventListener( 'click' , endGame , false ) ;
		cards[ i ].addEventListener( 'mouseenter' , function(){
			audioFlip.play();
		} , false ) ;
	}

}

function endGame( e ) {

	let cards = document.querySelectorAll( ".scene--card" );
	for ( let i = 0 ; i < cards.length; i++ ) {
		cards[ i ].removeEventListener( 'click' , endGame , false ) ;
	}

	let pointsElem = document.getElementById( 'points' );
	let errorElem = document.getElementById( 'errors' );

	let points = parseInt( pointsElem.innerHTML );

	let card = event.target;
	let cardContainer = card.closest('.card');

	const choice = card.innerHTML;
	let results = false;

	if ( mode[ selectedMode ].id === 'min' ) {

		results = parseInt( choice ) === parseInt( Math.min(...cardsValues) );


	} else if ( mode[ selectedMode ].id === 'max' ) {

		results = parseInt( choice ) === parseInt( Math.max(...cardsValues) );

	}

	cardContainer.classList.toggle('is-flipped');
	let resultText = results === true ? 'BRAVA' : 'OPS';
	cardContainer.querySelector('.card__face--back').innerHTML = resultText;

	if( results === true ){

		multiplyScoreCount++;

		if( multiplyScoreCount%multiplyScoreCountRate === 0 ){

			multiplyScore++;
			points = parseInt(points)+parseInt(multiplyScore);
			audioBooster.play();
			showTextLevelMessage( 'Moliplicatore Punteggio x'+multiplyScore+' attivato!' );

		}else if( multiplyScore > 1 ){
			points = parseInt(points)+parseInt(multiplyScore);
		}else{
			points++;
		}

		audioOK.play();

		if( points%20 === Math.floor( Math.random() * 9 ) ){

			setTimeout( function(){
				audioGood.play();
			}, 2000 );

		}

	}else{
		if ( multiplyScore > 0 ){
			audioBoosterLost.play();
			showTextLevelMessage( 'Moliplicatore Punteggio x'+multiplyScore+' perso!' );
		}
		multiplyScoreCount = 0;
		multiplyScore = 1;

		errors++;
		errorElem.innerHTML = parseInt(errors);

		audioFail.play();

		if( errors%3 === 0){

			setTimeout( function(){
				audioOps.play();
			}, 2000 );
		}

	}

	pointsElem.innerHTML = points;

	setTimeout( function(){

		restartGame( points, results );

	}, 3000 );

}
function showTextLevelMessage(msg){

	levelText.innerHTML = msg;
	levelText.classList.toggle('d-none');
	setTimeout(function(){
		levelText.classList.toggle('d-none');
	}, 2000 );

}
function restartGame( points, results ) {

	audioFlip.play();

	if( results === true && parseInt(points) > 0 && parseInt(points%5) === 0 ){
		level++;
		audioNewLevel.play();
		showTextLevelMessage( 'Livello ' + (parseInt(level-2)) );
	}

	let cardsContainer = document.getElementById( 'cards-container' );
	cardsContainer.innerHTML = '';

	selectedMode = Math.floor( Math.random() * mode.length );
	initGame( selectedMode, level );

}

let startButton = document.getElementById( 'start-game' );
startButton.addEventListener( 'click' , function(){

	initGame( selectedMode, level );
	startButton.classList.toggle('d-none');

} , false ) ;
