/*global jq*/
/*global ko*/
/*global Sammy*/


define( [ 'jquery', 'knockout', 'sammy' ], function ( $, ko, sammy ) {
	return function accountsViewModel() {
		"use strict";

		var self = this;
		self.accounts = ko.observable();
		self.activeAccountName = ko.observable();
		self.accountsData = ko.observableArray();
		self.transactionData = ko.observableArray();
		self.accountSumData = ko.observable();
		self.envelopeSumData = ko.observableArray();

		//TODO: summaryTotalAmount not working
		self.summaryTotalAmount = ko.pureComputed( function () {
			var total = 0;
			$.each( self.accountsData(), function () {
				total += this.amount
			} );
			return total;
		} );

		self.goToAccount = function ( account ) {
			location.hash = account.Name;
		};

		self.getAccountIdByName = function ( accountName ) {
			for ( var a in self.accounts() ) {
				if ( accountName === self.accounts()[ a ].Name ) {
					return self.accounts()[ a ].Id;
				}
			}

			return - 1;
		};

		self.setAccountTabs = function () {
			$.get( "/accounts", self.accounts, "json" );
		};

		self.setAccountsData = function () {
			$.get( "/accounts", function ( rows ) {
				self.accountsData( {data: rows} );
			}, "json" );
		};

		self.setEnvelopesSumData = function ( accountId, accountName ) {
			self.envelopeSumData( null );
			if ( accountId >= 0 || accountName.length > 0 ) {
				$.post( "/envelopes", {accountId: accountId, accountName: accountName}, function ( rows ) {
					if ( rows.length > 0 ) {
						self.envelopeSumData( {data: rows} );
					}
				}, "json" );
			}
		};

		self.setAccountSumData = function ( accountId, accountName ) {
			self.accountSumData( null );

			if ( accountId >= 0 || accountName.length > 0 ) {
				$.post( "/accounts", {accountId: accountId, accountName: accountName}, function ( rows ) {
					if ( rows.length > 0 ) {
						self.accountSumData( rows[ 0 ] );
					}
				}, 'json' );
			}
		};

		self.setTransactionData = function ( accountName ) {
			self.transactionData( null );
			if ( accountName.length > 0 ) {
				$.post( "/transactions", {accountName: accountName}, function ( rows ) {
					if ( rows.length > 0 ) {
						self.transactionData( {data: rows} );
					}
				}, "json" );
			}
		};

		self.clearData = function () {
			self.accounts( null );
			self.activeAccountName( null );
			self.accountsData( null );
			self.transactionData( null );
			self.accountSumData( null );
			self.envelopeSumData( null );
		};

		sammy( function () {
			this.post( '#/login', function () {
				$.post( '/login', {username: this.params.username, password: this.params.password}, "json" );
				window.location = "/";
				return false;
			} );

			this.get( '#logout', function () {
				$.get( '/logout' );
				window.location = "/";
				return false;
			} );

			this.get( '#:account', function () {
				if ( haveAuthedUser() ) {
					self.activeAccountName( this.params.account );
					if ( self.accounts() == null ) {
						self.setAccountTabs();
					}
					self.setEnvelopesSumData( - 1, this.params.account );
					self.accountsData( null );
					self.setAccountSumData( - 1, this.params.account );
					self.setTransactionData( this.params.account );
				} else {
					self.clearData();
				}
			} );

//		this.get( '#:account/:envelope', function () {
//			if ( haveAuthedUser() ) {
//				self.activeAccountName( this.params.account.Name );
//				self.activeAccountData( null );
//			} else {
//				self.clearData();
//			}
//		} );

			this.get( '', function () {
				self.clearData();
				if ( haveAuthedUser() ) {
					self.setAccountTabs();
					self.setAccountsData();
					self.activeAccountName( null );
					self.accountSumData( null );
					self.transactionData( null );
				}
			} );
		} ).run();
	}
} );