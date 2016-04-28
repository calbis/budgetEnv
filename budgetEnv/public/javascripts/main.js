/*global $*/
/*global ko*/
/*global Sammy*/

function formatCurrency( value ) {
	"use strict";

	return value.toFixed( 2 );
}

function AccountsViewModel() {
	"use strict";

	var self = this;
	self.accounts = null;
	self.activeAccountName = ko.observable();
	self.accountsData = ko.observableArray();
	self.transactionData = ko.observableArray();
	self.accountSumData = ko.observableArray();

	//TODO: summaryTotalAmount not working
	self.summaryTotalAmount = ko.pureComputed( function () {
		var total = 0;
		$.each( self.accountsData(), function () {
			total += this.amount
		} )
		return total;
	} );

	self.goToAccount = function ( account ) {
		location.hash = account.name;
	};

	self.getAccountIndexByName = function ( accountName ) {
		for ( var a in self.accounts ) {
			if ( accountName === self.accounts[ a ].name ) {
				return a;
			}
		}

		return - 1;
	};

	self.setAccountTabs = function () {
		$.get( "/accounts", self.accounts, "json" );
	};

	self.getAccountsData = function () {
		var d = [
			{
				id: 1,
				name: 'Checking',
				amount: 111.11,
				pending: 0.11,
				textColor: 'DarkBlue'
			}, {
				id: 2,
				name: 'Savings',
				amount: 222.22,
				pending: 0.22,
				textColor: 'Purple'
			}, {
				id: 3,
				name: 'Credit',
				amount: 333.33,
				pending: 0.33,
				textColor: 'Red'
			}, {
				id: 4,
				name: 'Amazon',
				amount: 444.44,
				pending: 0.44,
				textColor: 'DarkOrange'
			}, {
				id: 5,
				name: 'Bangor',
				amount: 555.55,
				pending: 0.55,
				textColor: 'Green'
			}
		];
		return {
			data: d
		};
	};

	self.getAccountSumData = function ( accountId ) {
		var d = {
			accountId: accountId,
			accountName: 'Bangor',
			totalAmount: 555.55,
			totalPending: 0.10,
			totalGrand: 555.65,
			fromWebsite: 556.75,
			difference: 1.10,
			textColor: 'Green'
		};

		return d;
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

	Sammy( function () {
		this.get( '#:account', function () {
			self.activeAccountName( this.params.account );
			if ( self.accounts() == null ) {
				self.setAccountTabs();
			}
			self.accountsData( null );
			var accountId = self.getAccountIndexByName( this.params.account );    //self.transactionData(self.getTransactionData(accountId, -1));
			self.accountSumData( self.getAccountSumData( accountId ) );
			self.transactionData( self.getTransactionData( accountId, - 1 ) );
			//$.get("/mail", { folder: this.params.folder }, self.chosenFolderData);
		} );

		this.get( '#:account/:envelope', function () {
			self.activeAccountName( this.params.account.name );
			self.activeAccountData( null );
			//$.get("/mail", { mailId: this.params.mailId }, self.chosenMailData);
		} );

		this.get( '', function () {
			self.setAccountTabs();
			self.accountsData( self.getAccountsData() );
			self.activeAccountName( null );
			self.accountSumData( null );
			self.transactionData( null );
		} );
	} ).run();
}

$( document ).ready( function () {
	"use strict";

	ko.applyBindings( new AccountsViewModel() );
} );