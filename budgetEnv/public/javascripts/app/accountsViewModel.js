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

		self.getData = function ( method, url, data, dataType, onSuccess ) {
			var request = $.ajax( {
				method: method,
				url: url,
				data: data,
				dataType: dataType
			} );

			request.done( function ( rows ) {
				onSuccess( rows );
			} );

			request.fail( function ( jqXHR, textStatus, errorThrown ) {
				//TODO: fill this out and replace ugly alerts with a flashy message to user
				switch ( jqXHR.status ) {
					case 302:
					case 303:
					case 304:
						break;
					case 400:
						alert( "bad request" );
						break;
					case 401:
						alert( "unauthorized" );
						window.location = "/";
						break;
					case 404:
						alert( "Not Found" );
						break;
					case 500:
						alert( "unhandled server error" );
						break;
				}
			} );
		};

		self.setAccountTabs = function () {
			self.getData( 'GET', "/accounts", null, "json", self.accounts, false );
		};

		self.setAccountsData = function () {
			self.getData( "GET", "/accounts", null, "json", function ( rows ) {
				self.accountsData( {data: rows} );
			} );
		};

		self.setEnvelopesSumData = function ( accountId, accountName ) {
			self.envelopeSumData( null );
			if ( accountId >= 0 || accountName.length > 0 ) {
				self.getData( "POST", "/envelopes", {
					accountId: accountId,
					accountName: accountName
				}, "json", function ( rows ) {
					if ( rows.length > 0 ) {
						self.envelopeSumData( {data: rows} );
					}
				} );
			}
		};

		self.setAccountSumData = function ( accountId, accountName ) {
			self.accountSumData( null );

			if ( accountId >= 0 || accountName.length > 0 ) {

				self.getData( "POST", "/accounts", {
						accountId: accountId,
						accountName: accountName
					}, "json", function ( rows ) {
						if ( rows.length > 0 ) {
							self.accountSumData( rows[ 0 ] );
						}
					}
				);
			}
		};

		self.setTransactionData = function ( accountName ) {
			self.transactionData( null );
			if ( accountName.length > 0 ) {
				self.getData( "POST", "/transactions", {accountName: accountName}, "json", function ( rows ) {
					if ( rows.length > 0 ) {
						self.transactionData( {data: rows} );
					}
				} );
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
				self.getData( "POST", "/login", {
					username: this.params.username,
					password: this.params.password
				}, "json", null );
				window.location = "/";
				return false;
			} );

			this.get( '#logout', function () {
				self.getData( "GET", "/logout", null, null, null );
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