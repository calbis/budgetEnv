/* global describe, it */

'use strict';

var helper = require( '../helper.js' );
var expect = require( "chai" ).expect;
var needle = require( "needle" );


describe( "Login Routes", function () {
	it( "GET method not allowed", function ( done ) {
		needle.get( helper.baseUrl + "login", function ( err, res ) {
			expect( res ).to.exist;
			expect( res.statusCode ).to.equal( 404 );

			done();
		} );
	} );

	describe( "Login to application", function () {
		it( "Failed attempt to login", function ( done ) {
			needle.post( helper.baseUrl + "login", {
				username: 'garbage',
				password: 'trash'
			}, function ( err, res ) {
				expect( err ).to.not.exist;
				expect( res ).to.exist;
				expect( res.statusCode ).to.equal( 401 );

				done();
			} );
		} );

		it( "Successful attempt to login", function ( done ) {
			needle.post( helper.baseUrl + "login", {
				username: helper.username,
				password: helper.password
			}, function ( err, res ) {
				expect( err ).to.not.exist;
				expect( res ).to.exist;
				expect( res.statusCode ).to.equal( 302 );

				done();
			} );
		} );
	} );
} );