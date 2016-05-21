/* global describe, it, after */

'use strict';

var helper = require( '../helper.js' );
var expect = require( "chai" ).expect;
var needle = require( "needle" );


describe( "Envelope Routes", function() {

	describe( "Unauthorized Actions", function() {

		it( "Get method not allowed", function( done ) {
			needle.get( helper.baseUrl + "envelopes",
				function( err, res ) {
					expect( res ).to.exist;
					expect( res.statusCode ).to.equal( 404 );

					done();
				} );
		} );

		it( "Post method not allowed", function() {
			needle.post( helper.baseUrl + "envelopes", {}, {},
				function( err, res ) {
					expect( res ).to.exist;
					expect( res.statusCode ).to.be.equal( 401 );
				} );
		} );

	} );

	describe( "Authorized Actions", function() {
		before( function( done ) {
			helper.loginToApp( done );
		} );

		describe( "Getting Data", function() {
			describe( "Expected bad requests", function() {

				it( "No account id or name provided", function( done ) {
					needle.post( helper.baseUrl + "envelopes", null,
						{
							cookies: helper.getCookies()
						},
						function( err, res ) {
							expect( err ).to.not.exist;
							expect( res ).to.exist;
							expect( res.statusCode ).to.equal( 400 );

							done();
						} );
				} );

				it( "Negative account id provided", function( done ) {
					needle.post( helper.baseUrl + "envelopes",
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
					needle.post( helper.baseUrl + "envelopes",
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
						needle.post( helper.baseUrl + "envelopes",
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
					needle.post( helper.baseUrl + "envelopes",
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
							helper.CheckForProperEnvelope( res.body[0] );

							done();
						} );
				} );

				it( "Valid account name provided", function( done ) {
						needle.post( helper.baseUrl + "envelopes",
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
								helper.CheckForProperEnvelope( res.body[0] );

								done();
							} );
					}
				);
			} );
		} );

		after( function( done ) {
			helper.logoutOfApp( done );
		} );
	} );
} );