'use strict';

var needle = require( 'needle' );

var cookies = {};

exports.baseUrl = "http://localhost:3000/";
exports.username = "jack";
exports.password = "secret";


exports.getCookies = function () {
	return cookies;
};


exports.addCookie = function ( key, value ) {
	cookies[key] = value;
};


exports.getCookie = function ( cookieName ) {
	return cookies[cookieName];
};


exports.loginToApp = function ( callBack ) {
	needle.post( exports.baseUrl + "login", {
		username: exports.username,
		password: exports.password
	}, {}, function ( err, res ) {
		if ( res.statusCode === 302 ) {
			exports.addCookie( "connect.sid", res.cookies['connect.sid'] );
			callBack();
			return;
		} else {
			callBack( "Not able to login" );
			return;
		}
	} );
};


exports.logoutOfApp = function ( callBack ) {
	needle.get( exports.baseUrl + "logout", function ( err, res ) {
		cookies = {};
		callBack();
		return;
	} );
};