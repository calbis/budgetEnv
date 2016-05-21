/* global describe, it, expect, after */

'use strict';

var helper = require( '../helper.js' );
var expect = require( "chai" ).expect;
var needle = require( "needle" );


describe( "Accounts Routes", function() {
	describe( "Unauthorized Access", function() {

		it( "Accounts via GET method", function( done ) {
			needle.get( helper.baseUrl + "accounts", function( err, res ) {
				expect( res ).to.exist;
				expect( res.statusCode ).to.equal( 401 );
				done();
			} );
		} );

		it( "Accounts via POST method", function( done ) {
			needle.post( helper.baseUrl + "accounts",
				{
					accountId: 1
				}, function( err, res ) {
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
			it( "Properly formatted request", function( done ) {
				needle.get( helper.baseUrl + "accounts", {
					cookies: helper.getCookies()
				}, function( err, res ) {
					expect( err ).to.not.exist;
					expect( res ).to.exist;
					expect( res.statusCode ).to.equal( 200 );

					expect( res.body ).to.be.an( 'array' );
					expect( res.body ).to.not.be.empty;
					helper.CheckForProperAccount( res.body[ 0 ] );

					done();
				} );
			} );
		} );

		describe( "Via POST method", function() {
			describe( "Expected Bad requests", function() {
				it( "No account id or name provided", function( done ) {
					needle.post( helper.baseUrl + "accounts",
						null, {
							cookies: helper.getCookies()
						}, function( err, res ) {
							expect( err ).to.not.exist;
							expect( res ).to.exist;
							expect( res.statusCode ).to.equal( 400 );
							done();
						} );
				} );

				it( "Negative account id provided", function( done ) {
					needle.post( helper.baseUrl + "accounts",
						{
							accountId: - 1
						}, {
							cookies: helper.getCookies()
						}, function( err, res ) {
							expect( err ).to.not.exist;
							expect( res ).to.exist;
							expect( res.statusCode ).to.equal( 400 );
							done();
						} );
				} );

				it( "Invalid account id provided", function( done ) {
					needle.post( helper.baseUrl + "accounts",
						{
							accountId: "abcxyz"
						}, {
							cookies: helper.getCookies()
						}, function( err, res ) {
							expect( err ).to.not.exist;
							expect( res ).to.exist;
							expect( res.statusCode ).to.equal( 400 );
							done();
						} );
				} );

				it( "Invalid account name provided", function( done ) {
						needle.post( helper.baseUrl + "accounts",
							{
								accountName: "boogers"
							}, {
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
					needle.post( helper.baseUrl + "accounts",
						{
							accountId: 1
						}, {
							cookies: helper.getCookies()
						}, function( err, res ) {
							expect( err ).to.not.exist;
							expect( res ).to.exist;
							expect( res.statusCode ).to.equal( 200 );

							expect( res.body ).to.be.an( 'array' );
							expect( res.body ).to.not.be.empty;
							helper.CheckForProperAccount( res.body[ 0 ] );

							done();
						} );
				} );

				it( "Valid account name provided", function( done ) {
						needle.post( helper.baseUrl + "accounts",
							{
								accountName: "Checking"
							}, {
								cookies: helper.getCookies()
							}, function( err, res ) {
								expect( err ).to.not.exist;
								expect( res ).to.exist;
								expect( res.statusCode ).to.equal( 200 );

								expect( res.body ).to.be.an( 'array' );
								expect( res.body ).to.not.be.empty;
								helper.CheckForProperAccount( res.body[ 0 ] );

								done();
							} );
					}
				);
			} );

			after( function( done ) {
				helper.logoutOfApp( done );
			} );
		} );
	} );
} );