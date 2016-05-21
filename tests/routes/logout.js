/* global describe, it */

'use strict';

var helper = require( '../helper.js' );
var expect = require( "chai" ).expect;
var needle = require( "needle" );


describe( "Logout Routes", function() {

	it( "Post method not allowed", function( done ) {
		needle.post( helper.baseUrl + "logout", {},
			function( err, res ) {
				expect( res ).to.exist;
				expect( res.statusCode ).to.equal( 404 );

				done();
			} );
	} );

	describe( "Logout of application", function() {

		it( "Successful attempt to logout", function( done ) {
			needle.get( helper.baseUrl + "logout",
				function( err, res ) {
					expect( err ).to.not.exist;
					expect( res ).to.exist;
					expect( res.statusCode ).to.equal( 302 );

					done();
				} );
		} );
	} );
} );