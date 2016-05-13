var helper = require( '../helper.js' );
var expect = require( "chai" ).expect;
var request = require( "request" );


describe( "Login Routes", function () {
	it( "GET method not allowed", function ( done ) {
		request.get( helper.baseUrl + "login", function ( error, res, body ) {
			try {
				expect( res ).to.exist;
				expect( res.statusCode ).to.equal( 404 );
			} catch ( e ) {
				done( e );
				return;
			}

			done();
		} );
	} );

	describe( "Login to application", function () {
		it( "Failed attempt to login", function ( done ) {
			request.post( helper.baseUrl + "login", {
				json: {
					username: 'garbage',
					password: 'trash'
				}
			}, function ( error, res, body ) {
				try {
					expect( error ).to.be.null;
					expect( res ).to.exist;
					expect( res.statusCode ).to.equal( 401 );
				} catch ( e ) {
					done( e );
					return;
				}

				done();
			} );
		} );

		it( "Successful attempt to login", function ( done ) {
			request.post( helper.baseUrl + "login", {
				json: {
					username: helper.username,
					password: helper.password
				}
			}, function ( error, res, body ) {
				try {
					expect( error ).to.be.null;
					expect( res ).to.exist;
					expect( res.statusCode ).to.equal( 302 );
				} catch ( e ) {
					done( e );
					return;
				}

				done();
			} );
		} );
	} );
} );