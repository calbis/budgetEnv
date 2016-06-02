'use strict';

var express = require( 'express' );
var db = require( '../lib/database.js' );
var helper = require( '../lib/helper.js' );
var router = express.Router();
var moment = require( 'moment' );


function SendTransactionsByAccountId( response, accountId ) {
	var q = "Select * From vw_transaction T Where T.AccountId = ?";
	db.getRows( q, [ accountId ],
		function( rows ) {
			response.status( 200 ).send( rows );
		},
		function( status ) {
			response.status( status.code ).send( status.message );
		} );
}


function doesTransactionExist( transactionId, callback ) {
	var q = "Select Count(Id) As theCount From transaction Where ID = ?";
	db.getRows( q, [ transactionId ],
		function( rows ) {
			callback( rows.length > 0 && rows[ 0 ].theCount > 0 );
		} );
}

function validateTransaction( transaction, callback ) {
	var err = "";
	if ( typeof transaction !== 'object' ) {
		return "Unknown transaction object";
	}
	if ( '' === transaction.Amount ||
	     isNaN( transaction.Amount ) ||
	     transaction.Id <= 0 ) {
		err += ", Id is invalid";
	}
	if ( '' === transaction.Name ||
	     transaction.Name.length <= 0 ) {
		err += ", Name is invalid";
	}
	if ( '' === transaction.PostedDate || ! moment().isValid( transaction.PostedDate ) ) {
		err += ", PostedDate is invalid";
	}
	if ( '' === transaction.Amount ||
	     isNaN( transaction.Amount ) ) {
		err += ", Amount is invalid";
	}
	if ( '' === transaction.Pending ||
	     isNaN( transaction.Pending ) ) {
		err += ", Pending is invalid";
	}
	if ( '' === transaction.Amount &&
	     '' === transaction.Pending ) {
		err += ", One of Amount or Pending is required";
	}
	if ( '' === transaction.EnvelopeId ||
	     isNaN( transaction.EnvelopeId ) ||
	     transaction.EnvelopeId <= 0 ) {
		err += ", EnvelopeId is invalid";
	}
	if ( '' === transaction.UseInStats ||
	     isNaN( transaction.UseInStats ) ||
	     transaction.UseInStats < 0 ||
	     transaction.UseInStats > 1 ) {
		err += ", UseInStats is invalid";
	}
	if ( '' === transaction.IsRefund ||
	     isNaN( transaction.IsRefund ) ||
	     transaction.IsRefund < 0 ||
	     transaction.IsRefund > 1 ) {
		err += ", IsRefund is invalid";
	}

	if ( err.length > 2 ) {
		callback( err.substring( 2 ) );
	} else {
		doesTransactionExist( transaction.Id, function( exists ) {
			if ( ! exists ) {
				callback( "Transaction by that Id does not exist" );
			} else {
				callback( "" );
			}
		} );
	}
}

function saveTransaction( user, transaction, callback ) {
	var id = transaction.Id;
	var t = transaction;
	delete t.Id;
	delete t.CreatedBy;
	delete t.CreatedOn;
	t.ModifiedBy = user.id;
	t.ModifiedOn = helper.getSqlDateNow();
	var q = "Update transaction Set ? Where ?";
	db.updateRow( q, [ t, { Id: id } ],
		function( rows ) {
			callback( rows );
		},
		function( error ) {
			console.log( "Update Transaction Error: " + error.message );
			callback( false );
		} );
}


function deleteTransaction( transactionId, callback ) {
	var q = "Delete From transaction Where ?";
	db.updateRow( q, { Id: transactionId },
		function() {
			callback( "" );
		},
		function( error ) {
			console.log( "Delete Transaction Error: " + error.message );
			callback( error.message );
		} );
}


router.get( '/',
	function( req, res ) {
		if ( ! req.user ) {
			res.redirect( 401, '/' );
			return;
		}

		if ( ! isNaN( req.query.accountId ) && req.query.accountId >= 0 ) {
			SendTransactionsByAccountId( res, req.query.accountId );
		} else if ( typeof req.query.accountName !== "undefined" && req.query.accountName.length > 0 ) {
			var q = "Select Id From account Where Name = ?";
			db.getRows( q, [ req.query.accountName ],
				function( rows ) {
					if ( rows.length > 0 ) {
						SendTransactionsByAccountId( res, rows[ 0 ].Id );
					} else {
						res.status( 400 ).send( "Invalid account name provided" );
					}
				} );
		} else {
			res.status( 400 ).send( "Missing valid account id or name" );
		}
	} );


router.put( '/',
	function( req, res ) {
		if ( ! req.user ) {
			res.redirect( 401, '/' );
			return;
		}
		var t = req.body;
		validateTransaction( t, function( errors ) {
			if ( errors.length > 0 ) {
				res.status( 400 ).send( "Invalid Transaction Object: " + errors );
				return;
			}
			saveTransaction( req.user, t, function( saved ) {
				if ( saved.length > 0 ) {
					res.status( 500 ).send( "Unable to save the transaction: " + saved );
				} else {
					res.status( 200 ).send( "Save successful" );
				}
			} );
		} );
	} );


router.delete( '/',
	function( req, res ) {
		if ( ! req.user ) {
			res.redirect( 401, '/' );
			return;
		}

		if ( '' === req.body.Id || isNaN( req.body.Id ) || req.body.Id <= 0 ) {
			res.status( 400 ).send( "Invalid transaction Id to delete" );
			return;
		}

		doesTransactionExist( req.body.Id, function( exist ) {
			if ( ! exist ) {
				res.status( 400 ).send( "Transaction, " + req.body.Id + ", does not exist" );
			} else {
				deleteTransaction( req.body.Id, function( error ) {
					if ( error.length !== 0 ) {
						res.status( 500 ).send( "Problem deleting transaction id, " + req.body.Id + ", with error: " + error );
					} else {
						res.status( 200 ).send( "Transaction id, " + req.body.Id + ", has been deleted" );
					}
				} );
			}
		} );
	} );

module.exports = router;
