var helper = require( '../helper.js' );
var expect = require( "chai" ).expect;
var request = require( "request" );

describe( "Accounts Routes", function () {
	describe( "Unauthorized Access", function () {

		it( "Accounts via GET method", function ( done ) {
			request( helper.baseUrl + "accounts", function ( error, response, body ) {
				try {
					expect( response ).to.exist;
					expect( response.statusCode ).to.equal( 401 );
				} catch ( e ) {
					done( e );
				}
			} );
			done();
		} );

		it( "Accounts via POST method", function ( done ) {
			request.post( helper.baseUrl + "accounts", { json: { accountId: 1 } }, function ( error, response, body ) {
				try {
					expect( response ).to.exist;
					expect( response.statusCode ).to.equal( 401 );
				} catch ( e ) {
					done( e );
				}
			} );
			done();
		} );

	} );

	describe( "Authorized Routes", function () {

	} );
} );