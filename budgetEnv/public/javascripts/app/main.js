requirejs( [ 'knockout', '../app/accountsViewModel', 'domReady!' ], function ( ko, accountsViewModel ) {
	"use strict";

	ko.applyBindings( new accountsViewModel() );
} );

requirejs( [ 'jquery', 'domReady!' ], function ( $ ) {
	"use strict";
	/*Width based classes*/
	function adjustStyle( width ) {
		$( "body" ).removeClass( "phone" );
		$( "body" ).removeClass( "tablet" );
		$( "body" ).removeClass( "medium" );
		$( "body" ).removeClass( "wide" );

		width = parseInt( width );
		if ( width < 600 ) {
			$( "body" ).addClass( "phone" );
		}
		else if ( width < 900 ) {
			$( "body" ).addClass( "tablet" );
		}
		else if ( width < 1200 ) {
			$( "body" ).addClass( "medium" );
		}
		else {
			$( "body" ).addClass( "wide" );
		}
	}

	$( function () {
		adjustStyle( $( this ).width() );
		$( window ).resize( function () {
			adjustStyle( $( this ).width() );
		} );
	} );
	/*END Width Based Classes*/
} );


function formatDate( date ) {
	if ( date == null || date.length < 10 ) {
		return '&nbsp;';
	}

	return date.substr( 0, 10 );
}


function formatCurrency( value ) {
	"use strict";
	return value.toFixed( 2 );
}


function formatCurrencyNoZeros( value ) {
	"use strict";
	if ( value == null || value === 0 ) {
		return '&nbsp;';
	}

	return value.toFixed( 2 );
}

function haveAuthedUser() {
	if ( $( '#authUserGreeting' ).html().indexOf( 'hello,' ) >= 0 ) {
		return true;
	}
	return false;
}
