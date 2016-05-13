var helper = require( './helper.js' );
var expect = require( "chai" ).expect;
var request = require( "request" );


describe( "Budget Env Back End", function () {
	describe( "Should get a response back from the server", function () {
		it( "servers response", function ( done ) {
			request( helper.baseUrl, function ( error, response, body ) {
				expect( error ).to.equal( null );
				expect( response ).to.not.equal( null );
				expect( response ).to.not.equal( "undefined" );
				done();
			} );
		} );
	} );

	describe( "Should get a 404 error when a valid route/file is not found", function () {
		it( "returns status 404", function ( done ) {
			request( helper.baseurl + 'asdfg.hjk', function ( error, response, body ) {
				expect( error ).to.not.equal( '' );
				done();
			} );
		} );
	} );
} );