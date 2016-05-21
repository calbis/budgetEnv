/* global describe, it */

'use strict';

var helper = require( './helper.js' );
var expect = require( "chai" ).expect;
var needle = require( "needle" );


describe( "Budget Env Back End", function () {
	describe( "Should get a response back from the server", function () {
		it( "servers response", function ( done ) {
			needle.get( helper.baseUrl, function ( err, res ) {
				expect( err ).to.not.exist;
				expect( res ).to.exist;

				done();
			} );
		} );
	} );

	describe( "Should get a 404 error when a valid route/file is not found", function() {
		it( "returns status 404", function( done ) {
			needle.get( helper.baseUrl + 'asdfg.hjk',
				function( err, res ) {
					expect( err ).to.not.exist;
					expect( res ).to.exist;
					expect( res.statusCode ).to.equal( 404 );

					done();
				} );
		} );
	} );
} );