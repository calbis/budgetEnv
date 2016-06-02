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
		} else {
			callBack( "Not able to login" );
		}
	} );
};


exports.logoutOfApp = function( callBack ) {
	needle.get( exports.baseUrl + "logout", function( err, res ) {
		cookies = {};
		callBack();
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
};


exports.CheckForProperEnvelope = function( envelope ) {
	expect( envelope ).to.have.property( 'EnvelopeId' )
	                  .that.is.a( 'number' )
	                  .to.be.at.least( 1 );
	expect( envelope ).to.have.property( 'EnvelopeName' )
	                  .that.is.a( 'string' )
	                  .to.have.length.of.at.least( 1 );
	expect( envelope ).to.have.property( 'EnvelopeColor' )
	                  .that.is.a( 'string' )
	                  .to.have.length.of.at.least( 1 );
	expect( envelope ).to.have.property( 'EnvelopeSum' )
	                  .that.is.a( 'number' );
	expect( envelope ).to.have.property( 'EnvelopePending' )
	                  .that.is.a( 'number' );
	expect( envelope ).to.have.property( 'StatsCost' )
	                  .that.is.a( 'number' );
	expect( envelope ).to.have.property( 'TimeLeft' )
	                  .that.is.a( 'number' );
	expect( envelope ).to.have.property( 'GoalDeposit' )
	                  .that.is.a( 'number' );
	expect( envelope ).to.have.property( 'BaseEnvelopeId' )
	                  .that.is.a( 'number' );
	expect( envelope ).to.have.property( 'AccountId' )
	                  .that.is.a( 'number' );
};


exports.transaction = function( Id, Name, PostedDate, Amount, Pending, UseInStats, IsRefund, EnvelopeId ) {
	this.Id = Id || null;
	this.Name = Name || "Fuzzy bear";
	this.PostedDate = PostedDate || new Date().toISOString();
	this.Amount = Amount || 10.99;
	this.Pending = Pending || - 1.88;
	this.UseInStats = UseInStats || 1;
	this.IsRefund = IsRefund || 0;
	this.CreatedOn = null;
	this.CreatedBy = null;
	this.ModifiedOn = null;
	this.ModifiedBy = null;
	this.EnvelopeId = EnvelopeId || 1;
	this.EnvelopeColor = null;
	this.EnvelopeName = null;
	this.AccountId = null;
};


exports.CheckForProperTransaction = function( transaction ) {
	expect( transaction ).to.have.property( 'Id' )
	                     .that.is.a( 'number' )
	                     .to.be.at.least( 1 );
	expect( transaction ).to.have.property( 'Name' )
	                     .that.is.a( 'string' )
	                     .to.have.length.of.at.least( 1 );
	expect( transaction ).to.have.property( 'PostedDate' )
	                     .that.is.a( 'string' );
	expect( transaction ).to.have.property( 'Amount' );
	expect( transaction ).to.have.property( 'Pending' )
	                     .that.is.a( 'number' );
	expect( transaction ).to.have.property( 'UseInStats' )
	                     .to.be.oneOf( [ 0, 1 ] );
	expect( transaction ).to.have.property( 'IsRefund' )
	                     .to.be.oneOf( [ 0, 1 ] );
	expect( transaction ).to.have.property( 'CreatedOn' )
	                     .that.is.a( 'string' );
	expect( transaction ).to.have.property( 'CreatedBy' )
	                     .that.is.a( 'number' )
	                     .that.is.at.least( 1 );
	expect( transaction ).to.have.property( 'ModifiedOn' )
	                     .that.is.a( 'string' );
	expect( transaction ).to.have.property( 'ModifiedBy' )
	                     .that.is.a( 'number' )
	                     .that.is.at.least( 1 );
	expect( transaction ).to.have.property( 'EnvelopeId' )
	                     .that.is.a( 'number' )
	                     .to.be.at.least( 1 );
	expect( transaction ).to.have.property( 'EnvelopeName' )
	                     .that.is.a( 'string' )
	                     .to.have.length.of.at.least( 1 );
	expect( transaction ).to.have.property( 'EnvelopeColor' )
	                     .that.is.a( 'string' )
	                     .to.have.length.of.at.least( 1 );
	expect( transaction ).to.have.property( 'AccountId' )
	                     .that.is.a( 'number' );
};

exports.constructQueryString = function( nameValuePairs ) {
	var qs = "";
	for ( var key in nameValuePairs ) {
		if ( nameValuePairs.hasOwnProperty( key ) ) {
			qs = qs + "&" + key + "=" + nameValuePairs[ key ];
		}
	}

	if ( qs.length > 1 ) {
		qs = "?" + qs.substr( 1 );
	}

	return qs;
};