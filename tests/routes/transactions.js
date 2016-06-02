/* global describe, it, after */

'use strict';

var helper = require( '../helper.js' );
var expect = require( "chai" ).expect;
var needle = require( "needle" );
var moment = require( 'moment' );


describe( "Transactions Routes", function() {
	describe( "Unauthorized Access", function() {
		describe( "Transactions via Get method", function() {

			it( "With no arguments", function( done ) {
				needle.get( helper.baseUrl + "transactions",
					function( err, res ) {
						expect( res ).to.exist;
						expect( res.statusCode ).to.equal( 401 );
						done();
					} );
			} );

			it( "With an Account Id", function( done ) {
				var queryArgs = {
					accountId: 1
				};
				needle.get( helper.baseUrl + "transactions" + helper.constructQueryString( queryArgs ),
					function( err, res ) {
						expect( res ).to.exist;
						expect( res.statusCode ).to.equal( 401 );
						done();
					} );
			} );

			it( "With an Account Name", function( done ) {
				var queryArgs = {
					accountName: "Checking"
				};
				needle.get( helper.baseUrl + "transactions" + helper.constructQueryString( queryArgs ),
					function( err, res ) {
						expect( res ).to.exist;
						expect( res.statusCode ).to.equal( 401 );
						done();
					} );
			} );
		} );

		it( "Transactions via POST method", function( done ) {
			needle.post( helper.baseUrl + "transactions",
				{
					accountId: 1
				}, function( err, res ) {
					expect( res ).to.exist;
					expect( res.statusCode ).to.equal( 404 );
					done();
				} );
		} );

		it( "Transactions via Put Method", function( done ) {
			needle.put( helper.baseUrl + "transactions", new helper.transaction(),
				function( err, res ) {
					expect( res ).to.exist;
					expect( res.statusCode ).to.equal( 401 );
					done();
				} );
		} );

		it( "Transactions via the Delete Method", function( done ) {
			needle.delete( helper.baseUrl + "transactions",
				{
					Id: 1
				},
				function( err, res ) {
					expect( err ).to.not.exist;
					expect( res ).to.exist;
					expect( res.statusCode ).to.equal( 401 );

					done();
				} );
		} );
	} );

	describe( "Authorized Routes", function() {
		before( function( done ) {
			helper.loginToApp( done );
		} );

		describe( "Via GET method", function() {
			describe( "Expected Bad requests", function() {
				it( "No account id or name provided", function( done ) {
					needle.get( helper.baseUrl + "transactions",
						{
							cookies: helper.getCookies()
						}, function( err, res ) {
							expect( err ).to.not.exist;
							expect( res ).to.exist;
							expect( res.statusCode ).to.equal( 400 );
							done();
						} );
				} );

				it( "Negative account id provided", function( done ) {
					var queryArgs = {
						accountId: - 1
					};
					needle.get( helper.baseUrl + "transactions" + helper.constructQueryString( queryArgs ),
						{
							cookies: helper.getCookies()
						}, function( err, res ) {
							expect( err ).to.not.exist;
							expect( res ).to.exist;
							expect( res.statusCode ).to.equal( 400 );
							done();
						} );
				} );

				it( "Invalid account id provided", function( done ) {
					var queryArgs = {
						accountId: "abcxyz"
					};
					needle.get( helper.baseUrl + "transactions" + helper.constructQueryString( queryArgs ),
						{
							cookies: helper.getCookies()
						}, function( err, res ) {
							expect( err ).to.not.exist;
							expect( res ).to.exist;
							expect( res.statusCode ).to.equal( 400 );
							done();
						} );
				} );

				it( "Invalid account name provided", function( done ) {
						var queryArgs = {
							accountName: "boogers"
						};
						needle.get( helper.baseUrl + "transactions" + helper.constructQueryString( queryArgs ),
							{
								cookies: helper.getCookies()
							}, function( err, res ) {
								expect( err ).to.not.exist;
								expect( res ).to.exist;
								expect( res.statusCode ).to.equal( 400 );
								done();
							} );
					}
				);
			} );

			describe( "Valid requests", function() {
				it( "Proper account id provided", function( done ) {
					var queryArgs = {
						accountId: 1
					};
					needle.get( helper.baseUrl + "transactions" + helper.constructQueryString( queryArgs ),
						{
							cookies: helper.getCookies()
						}, function( err, res ) {
							expect( err ).to.not.exist;
							expect( res ).to.exist;
							expect( res.statusCode ).to.equal( 200 );

							expect( res.body ).to.be.an( 'array' );
							expect( res.body ).to.not.be.empty;
							helper.CheckForProperTransaction( res.body[ 0 ] );

							done();
						} );
				} );

				it( "Valid account name provided", function( done ) {
						var queryArgs = {
							accountName: "Checking"
						};
						needle.get( helper.baseUrl + "transactions" + helper.constructQueryString( queryArgs ),
							{
								cookies: helper.getCookies()
							}, function( err, res ) {
								expect( err ).to.not.exist;
								expect( res ).to.exist;
								expect( res.statusCode ).to.equal( 200 );

								expect( res.body ).to.be.an( 'array' );
								expect( res.body ).to.not.be.empty;
								helper.CheckForProperTransaction( res.body[ 0 ] );

								done();
							} );
					}
				);
			} );
		} );

		describe( "Via POST method", function() {
			it( "Not a valid route", function( done ) {
				needle.post( helper.baseUrl + "transactions", {
					cookies: helper.getCookies()
				}, function( err, res ) {
					expect( err ).to.not.exist;
					expect( res ).to.exist;
					expect( res.statusCode ).to.equal( 404 );
					done();
				} );
			} );
		} );

		describe( "Via Put Method", function() {
			describe( "Modifying Data", function() {
				describe( "Bad requests", function() {
					it( "Put an invalid request", function( done ) {
						var t = new helper.transaction( 1 );
						delete t.EnvelopeColor;
						delete t.EnvelopeName;
						delete t.AccountId;
						t.Name = "";
						t.Amount = null;
						t.Pending = null;
						t.UseInStats = null;
						t.IsRefund = null;
						t.PostedDate = null;
						t.EnvelopeId = null;

						needle.put( helper.baseUrl + "transactions",
							t,
							{
								cookies: helper.getCookies()
							},
							function( err, res ) {
								expect( err ).to.not.exist;
								expect( res ).to.exist
								expect( res.statusCode ).to.equal( 400 );
								expect( res.body ).to.contain( 'Name is invalid' );
								expect( res.body ).to.contain( 'PostedDate is invalid' );
								expect( res.body ).to.contain( 'Amount is invalid' );
								expect( res.body ).to.contain( 'Pending is invalid' );
								expect( res.body ).to.contain( 'Amount or Pending is required' );
								expect( res.body ).to.contain( 'UseInStats is invalid' );
								expect( res.body ).to.contain( 'IsRefund is invalid' );
								expect( res.body ).to.contain( 'EnvelopeId is invalid' );

								done();
							}
						);
					} );
				} );

				describe( "Valid Request", function() {
					it( "Put a valid transaction", function( done ) {
						var t = new helper.transaction( 1 );
						delete t.EnvelopeColor;
						delete t.EnvelopeName;
						delete t.AccountId;

						needle.put( helper.baseUrl + "transactions",
							t,
							{
								cookies: helper.getCookies()
							},
							function( err, res ) {
								expect( err ).to.not.exist;
								expect( res ).to.exist;
								if ( res.statusCode === 400 ) {
									console.log( "Errors: " + res.body );
								}
								expect( res.statusCode ).to.equal( 200 );

								var queryArgs = {
									accountId: 1
								};
								needle.get( helper.baseUrl + "transactions" + helper.constructQueryString( queryArgs ),
									{
										cookies: helper.getCookies()
									},
									function( err, res ) {
										expect( err ).to.not.exist;
										expect( res ).to.exist;
										expect( res.statusCode ).to.equal( 200 );

										expect( res.body ).to.be.an( 'array' );
										expect( res.body ).to.not.be.empty;

										var found = false;
										for ( var i in res.body ) {
											if ( res.body[ i ].Id === 1 ) {
												found = true;
												helper.CheckForProperTransaction( res.body[ i ] );
												expect( res.body[ i ].Name ).to.equal( 'Fuzzy bear' );
												expect( res.body[ i ].Amount ).to.equal( 10.99 );
												expect( res.body[ i ].Pending ).to.equal( - 1.88 );
												expect( res.body[ i ].UseInStats ).to.equal( 1 );
												expect( res.body[ i ].IsRefund ).to.equal( 0 );
												expect( moment( res.body[ i ].PostedDate ).dayOfYear ).to.equal( moment().dayOfYear );

												break;
											}
										}
										expect( found ).to.be.true;

										done();
									} );
							} );
					} );
				} );
			} );
		} );

		describe( "Via Delete Method", function() {
			it( "Delete a transaction", function( done ) {
				needle.delete( helper.baseUrl + "transactions",
					{
						Id: 1
					},
					{
						cookies: helper.getCookies()
					},
					function( err, res ) {
						expect( err ).to.not.exist;
						expect( res ).to.exist;
						expect( res.statusCode ).to.equal( 200 );

						var queryArgs = {
							accountId: 1
						};
						needle.get( helper.baseUrl + "transactions" + helper.constructQueryString( queryArgs ),
							{
								cookies: helper.getCookies()
							},
							function( err, res ) {
								expect( err ).to.not.exist;
								expect( res ).to.exist;
								expect( res.statusCode ).to.equal( 200 );

								expect( res.body ).to.be.an( 'array' );
								expect( res.body ).to.not.be.empty;

								var found = false;
								for ( var i in res.body ) {
									if ( res.body[ i ].Id === 1 ) {
										found = true;
										break;
									}
								}
								expect( found ).to.be.false;
							} );

						done();
					}
				)
			} );
		} );

		after( function( done ) {
			helper.logoutOfApp( done );
		} );
	} );
} )
;