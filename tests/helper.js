'use strict';

var needle = require( 'needle' );
var expect = require( "chai" ).expect;

var cookies = {};

exports.baseUrl = "http://localhost:3000/";
exports.username = "jack";
exports.password = "secret";


exports.getCookies = function() {
	return cookies;
};


exports.addCookie = function( key, value ) {
	cookies[ key ] = value;
};


exports.getCookie = function( cookieName ) {
	return cookies[ cookieName ];
};


exports.loginToApp = function( callBack ) {
	needle.post( exports.baseUrl + "login", {
		username: exports.username,
		password: exports.password
	}, {}, function( err, res ) {
		if ( res.statusCode === 302 ) {
			exports.addCookie( "connect.sid", res.cookies[ 'connect.sid' ] );
			callBack();
			return;
		} else {
			callBack( "Not able to login" );
			return;
		}
	} );
};


exports.logoutOfApp = function( callBack ) {
	needle.get( exports.baseUrl + "logout", function( err, res ) {
		cookies = {};
		callBack();
		return;
	} );
};


exports.CheckForProperAccount = function( account ) {
	expect( account ).to.have.property( 'Id' )
	                 .that.is.a( 'number' )
	                 .to.be.at.least( 1 );
	expect( account ).to.have.property( 'Name' )
	                 .that.is.a( 'string' )
	                 .to.have.length.of.at.least( 1 );
	expect( account ).to.have.property( 'TextColor' )
	                 .that.is.a( 'string' )
	                 .to.have.length.of.at.least( 1 );
	expect( account ).to.have.property( 'ExternalTotal' )
	                 .that.is.a( 'number' );
	expect( account ).to.have.property( 'AccountSum' )
	                 .that.is.a( 'number' );
	expect( account ).to.have.property( 'AccountPending' )
	                 .that.is.a( 'number' );
}