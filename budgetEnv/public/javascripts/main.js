/*global $*/
/*global ko*/
/*global Sammy*/

function formatCurrency( value ) {
	"use strict";

	return value.toFixed( 2 );
}

function haveAuthedUser() {
	if ( $( '#authUserGreeting' ).html().indexOf( 'hello,' ) >= 0 ) {
		return true;
	}
	return false;
}

function AccountsViewModel() {
	"use strict";

	var self = this;
	self.accounts = ko.observable();
	self.activeAccountName = ko.observable();
	self.accountsData = ko.observableArray();
	self.transactionData = ko.observableArray();
	self.accountSumData = ko.observable();

	//TODO: summaryTotalAmount not working
	self.summaryTotalAmount = ko.pureComputed( function () {
		var total = 0;
		$.each( self.accountsData(), function () {
			total += this.amount
		} )
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

	self.setAccountSumData = function ( accountId ) {
		if ( accountId >= 0 ) {
			$.post( "/accounts", {accountId: accountId}, function ( rows ) {
				self.accountSumData( rows[ 0 ] );
			}, 'json' );
		}
	};

	self.getTransactionData = function ( accountId, envelopeId ) {
		var d = [
			{
				id: 1,
				accountId: accountId,
				envelopeId: 1,
				postedDate: '2016-04-22 15:00:00',
				name: 'Paid Mortgage',
				amount: 1450.00,
				pending: 0,
				textColor: 'DarkBlue',
				useInStats: 1,
				isRefund: 0,
				isDeleted: 0,
				createdOn: '2016-03-03 13:00:00',
				createdBy: 1,
				modifiedOn: '2016-04-04 14:01:01',
				modifiedBy: 2
			},
			{
				id: 1,
				accountId: accountId,
				envelopeId: 2,
				postedDate: '2016-04-23 16:00:00',
				name: 'Paid NelNet',
				amount: 0,
				pending: - 150.55,
				textColor: 'DarkBlue',
				useInStats: 1,
				isRefund: 0,
				isDeleted: 0,
				createdOn: '2016-03-03 13:00:00',
				createdBy: 1,
				modifiedOn: '2016-04-04 14:01:01',
				modifiedBy: 2
			}
		];
		return {
			data: d
		};
	};

	self.clearData = function () {
		self.accounts( null );
		self.activeAccountName( null );
		self.accountsData( null );
		self.transactionData( null );
		self.accountSumData( null );
	};

	Sammy( function () {
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
				self.accountsData( null );
				var accountId = self.getAccountIdByName( this.params.account );
				self.setAccountSumData( accountId );
				self.transactionData( self.getTransactionData( accountId, - 1 ) );
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
			if ( haveAuthedUser() ) {
				self.setAccountTabs();
				self.setAccountsData();
				self.activeAccountName( null );
				self.accountSumData( null );
				self.transactionData( null );
			} else {
				self.clearData();
			}
		} );
	} ).run();
}

$( document ).ready( function () {
	"use strict";

	ko.applyBindings( new AccountsViewModel() );

	/*Width based classes*/
	function adjustStyle( width ) {
		$( "body" ).removeClass( "phone" );
		$( "body" ).removeClass( "tablet" );
		$( "body" ).removeClass( "medium" );
		$( "body" ).removeClass( "wide" );

		width = parseInt( width );
		if ( width < 600 ) {
			$( "body" ).addClass( "phone" );
		}
		else if ( width < 900 ) {
			$( "body" ).addClass( "tablet" );
		}
		else if ( width < 1200 ) {
			$( "body" ).addClass( "medium" );
		}
		else {
			$( "body" ).addClass( "wide" );
		}
	}

	$( function () {
		adjustStyle( $( this ).width() );
		$( window ).resize( function () {
			adjustStyle( $( this ).width() );
		} );
	} );
	/*END Width Based Classes*/
} );