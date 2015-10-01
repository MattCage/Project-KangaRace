// Dichiaro le variabili globali
var timer, betOK, betValue, money, betKanga, totalQuote, productQuote;
var betQuote = new Array( 4 );
var calcBetQuote = new Array( 4 );

// Dopo aver caricato la pagina, inizializzo le variabili
window.onload = initVars;

// Funzione che azzera le puntate
function clearBetFields() {
	
	var betFields = document.getElementById( 'bet-form' ).getElementsByTagName( 'input' );
	
	for( var i = 0; i < betFields.length - 1; i++ ) {
		betFields[ i ].value = '';
	}
	
}

// Funzione che inizializza le variabili principali
function initVars() {
	
	timer = 0; // Timer
	betOK = 0; // Variabile che si sincera che le puntate siano regolari
	money = 1000; // Capitale iniziale
	
	// Stampo a schermo il capitale
	document.getElementById( 'score' ).innerHTML = "Capitale = " + money.toString();
	
	// Calcolo le quotazioni
	setQuote();
	
	// Ripulisco i campi delle puntate
	clearBetFields();
	
}

// Funzione che decide le quotazioni di ogni canguro, quindi le sue probabilità di avanzare in corsia.

function setQuote() {
	
	var numKanga; // Variabile che distingue il canguro
	totalQuote = 0; // Totale delle Quote
	productQuote = 1; // Prodotto delle quote, inizializzato a 1 affinchè si possa moltiplicare
	
	// Per ogni canguro setto una quotazione casuale (da 1 a 5) e la aggiungo alla moltiplicazione del Prodotto delle Quote
	for( var i = 0; i < 4; i++ ) {
		
		numKanga = i + 1;
		betQuote[ i ] = Math.floor( Math.random() * 5 + 1 );
		document.getElementById( 'quote' + numKanga.toString() ).innerHTML = "Canguro " + numKanga.toString() + " quotato " + betQuote[ i ].toString() + " a 1";
		productQuote *= betQuote[ i ];
		
	}
	
	// Per ogni canguro calcolo le probabilità del canguro di avanzare in corsia. Casi favorevoli / Casi possibili.
	for( var i = 0; i < 4; i++ ) {
		
		// Probabilità di avanzamento del canguro. 1 / [Quotazione] * [Prodotto Quote]
		calcBetQuote[ i ] = ( 1 / betQuote[ i ] ) * productQuote;
		
		// Aumento il numero di casi possibili sommando la probabilità appena calcolata
		totalQuote += calcBetQuote[ i ];
		
	}
	
}

// Funzione che verifica la validità della puntata (funzione invocata onChange)
function checkBet( kanga ) {
	
	var betFields = document.getElementById( 'bet-form' ).getElementsByTagName( 'input' );
	
	for( var i = 0; i < 4; i++ ) {
		
		// Se l'indice è diverso dal canguro da verificare, azzero il campo
		if( i != kanga - 1 ) {	
			betFields[ i ].value = '';
		}
		// Altrimenti, il canguro è quello giusto quindi...
		else {
			
			//...se la puntata NON è un numero tra 0 e 1000...
			if( isNaN( betFields[ i ].value ) || betFields[ i ].value < 0 || betFields[ i ].value > 1000 ) {
				
				//...azzero il campo e mantengo la puntata invalida
				betFields[ i ].value = '';
				betOK = 0;
				
			}
			//...altrimenti la puntata è di un valore valido quindi...
			else {
				
				// Trasformo la puntata in un numero intero (per evitare decimali) e la salvo
				betFields[ i ].value = parseInt( betFields[ i ].value );
				betValue = betFields[ i ].value;
				
				// Salvo il numero del canguro
				betKanga = i + 1;
				
				// Convalido la puntata
				betOK = 1;
				
			}
			
		}
		
	}
	
}

// Funzione di wait (JS non ha tali funzioni).
// Thanks to Sean McManus
function pauseComp( millis ) {
	
	var date = new Date();
	var curDate = null;
	
	do {
		curDate = new Date();
	}
	while( (curDate - date ) < millis );
	
}

// Fuznione che avvia la gara (invocata OnClick).
function startRace() {
	
	// Se le puntatae non sono valide, esci dalla funzione
	if( betOK == 0 ) {
		return;
	}
	
	// Setto il campo di gara e lo mostro a schermo
	var field = document.getElementById( 'field' );
	field.style.display = 'block';
	
	// Sottraggo la puntata al capitale e aggiorno il valore a schermo
	money = money - betValue;
	document.getElementById( 'score' ).innerHTML = "Capitale = " + money.toString();
	
	// Nascondo la finestra delle puntate
	document.getElementById( 'bet-form' ).style.display = 'none';
	
	// Evidenzio il canguro puntato
	document.getElementById( 'k' + betKanga.toString() ).style.backgroundColor = '#FFFF00';
	
	// Avvio un timer di un decimo di secondo
	timer = setInterval( advanceKanga, 100 );
	
}

// Funzione che fa avanzare i canguri, gestisce la gara e decreta un vincitore
function advanceKanga() {
	
	var kNewPos, chooseKanga; // Prossima posizione del canguro, Canguro da muovere
	var r = Math.floor( 1 + ( Math.random() * totalQuote ) ); // Valore randomico tra 1 e Casi Possibili
	
	// Seleziono il canguro da avanzare seconda questo schema:
	// se il "numero fortunato" è tra 1 e Probabilità del primo canguro, avanzo lui;
	// se il "numero fortunato" è tra Probabilità del primo canguro e Probabilità del secondo canguro, avanzo lui;
	// e cosi via.
	if( r <= calcBetQuote[ 0 ] ) {
		chooseKanga = 1;	
	}
	else if( r <= calcBetQuote[ 0 ] + calcBetQuote[ 1 ] ) {
		chooseKanga = 2;	
	}
	else if( r <= calcBetQuote[ 0 ] + calcBetQuote[ 1 ] + calcBetQuote[ 2 ] ) {
		chooseKanga = 3;	
	}
	else {
		chooseKanga = 4;
	}
	
	// Setto il canguro prescelto
	var k = document.getElementById( 'k' + chooseKanga.toString() );
	var kImg = document.getElementById( 'kImg' + chooseKanga.toString() );
	
	// Ciclo che anima il canguro
	for( var i = 0; i < 3; i++ ) {
		
		// Setto il "frame" attuale secondo il contatore
		kImg.src = 'img/kangaimg' + (i + 1).toString() + '.png';		
		
		// Aggiungo alla posizione del canguro 4 pixel
		kNewPos = k.offsetLeft + 4;
		k.style.left = kNewPos.toString() + "px";
		
		// Aspetto 2 decimi di secondo
		pauseComp( 200 );
		
	}
	
	// Se la nuova posizione del canguro va oltre la pista...
	if( kNewPos >= 736 ) {
		
		//...azzero il timer
		clearInterval( timer );
		
		// Se il canguro puntato equivale a quello prescelto...
		if( betKanga == chooseKanga ) {
			
			// 'Ttana ha vinto!
			alert( "Hai vinto con il canguro " + betKanga.toString() + "!" );
			money = money + betValue * betQuote[ betKanga - 1 ];
			document.getElementById( 'score' ).innerHTML = "Capitale = " + money.toString();
			
		}
		else {
			
			// Altrimenti no big money
			alert( "Hai perso. Il canguro vincente è il numero " + chooseKanga.toString() );
			
		}
		
		// Ciclo tra i canguri li riporto a 0px
		for( var j = 1; j <= 4; j++ ) {
			
			k = document.getElementById( 'k' + j.toString() );
			k.style.left = "0px";
			k.firstChild.src = "kangaimg3.png";
			
		}
		
		// Mostrola finestra delle puntate, nascondo il campo e ricoloro la corsia del canguro scelto del colore originale
		document.getElementById( 'field' ).style.display = "none";
		document.getElementById( 'bet-form' ).style.display = "block";
		document.getElementById( 'k' + betKanga.toString() ).style.backgroundColor = "#e8e8e8";
		
		// Calcolo nuove quotazioni
		setQuote();
		
		// Per sicurezza svuoto i campi delle puntate
		clearBetFields();
		
	}
	
}