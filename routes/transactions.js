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


function validateTransaction( shouldExist, user, transaction, onGood, onBad ) {
	var err = "";
	if ( typeof transaction !== 'object' ) {
		return "Unknown transaction object";
	}
	if ( shouldExist && (
			! transaction.Id ||
			isNaN( transaction.Id ) ||
			transaction.Id <= 0
		) ) {
		err += ", Id is invalid";
	}
	if ( ! transaction.Name ||
	     transaction.Name.length <= 0 ) {
		err += ", Name is invalid";
	}
	if ( ! transaction.PostedDate || ! moment().isValid( transaction.PostedDate ) ) {
		err += ", PostedDate is invalid";
	}
	if ( ! transaction.Amount ||
	     isNaN( transaction.Amount ) ) {
		err += ", Amount is invalid";
	}
	if ( ! transaction.Pending ||
	     isNaN( transaction.Pending ) ) {
		err += ", Pending is invalid";
	}
	if ( ! transaction.Amount && ! transaction.Pending ) {
		err += ", One of Amount or Pending is required";
	}
	if ( ! transaction.EnvelopeId ||
	     isNaN( transaction.EnvelopeId ) ||
	     transaction.EnvelopeId <= 0 ) {
		err += ", EnvelopeId is invalid";
	}
	if ( '' === transaction.UseInStats ||
	     null === transaction.UseInStats ||
	     isNaN( transaction.UseInStats ) ||
	     transaction.UseInStats < 0 ||
	     transaction.UseInStats > 1 ) {
		err += ", UseInStats is invalid";
	}
	if ( '' === transaction.IsRefund ||
	     null === transaction.IsRefund ||
	     isNaN( transaction.IsRefund ) ||
	     transaction.IsRefund < 0 ||
	     transaction.IsRefund > 1 ) {
		err += ", IsRefund is invalid";
	}

	if ( err.length === 0 ) {
		doesTransactionExist( transaction.Id, function( doesExist ) {
			if ( shouldExist && doesExist || ! shouldExist && ! doesExist ) {
				onGood( user, transaction, onBad );
			} else if ( typeof onBad === 'function' ) {
				if ( shouldExist ) {
					onBad( "Transaction does not exist, but it should" );
				} else {
					onBad( "Transaction exists, but it shouldn't" );
				}
			}
		} );
	} else if ( typeof onBad === 'function' ) {
		onBad( err.substr( 2 ) );
	}
}


function insertTransaction( user, transaction, onGood, onBad ) {
	var t = transaction;
	delete t.Id;
	t.CreatedBy = user.id;
	t.CreatedOn = helper.getSqlDateNow();
	t.ModifiedBy = user.id;
	t.ModifiedOn = helper.getSqlDateNow();
	var q = "Insert Into transaction Set ?";
	db.insertRow( q, [ t ], onGood,
		function( error ) {
			if ( typeof onBad === 'function' ) {
				onBad( error.message );
			}
		} );
}


function updateTransaction( user, transaction ) {
	var id = transaction.Id;
	var t = transaction;
	delete t.Id;
	delete t.CreatedBy;
	delete t.CreatedOn;
	t.ModifiedBy = user.id;
	t.ModifiedOn = helper.getSqlDateNow();
	var q = "Update transaction Set ? Where ?";
	db.updateRow( q, [ t, { Id: id } ], null, null );
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


router.post( '/',
	function( req, res ) {
		if ( ! req.user ) {
			res.redirect( 401, '/' );
			return;
		}
		var t = req.body.Transactions;
		if ( ! Array.isArray( t ) || t.length <= 0 ) {
			res.status( 400 ).send( "Expected to get an array of transaction(s)" );
			return;
		}

		if ( t.length === 1 ) {
			validateTransaction( false, req.user, t[ 0 ],
				function() {
					insertTransaction( req.user, t[ 0 ],
						function() {
							res.status( 201 ).send( "Transaction created successfully" );
						},
						function( error ) {
							res.status( 400 ).send( error );
						} );
				},
				function( error ) {
					res.status( 400 ).send( error );
				} );
		} else {
			for ( var i = 0; i < t.length; i = i + 1 ) {
				validateTransaction( false, req.user, t[ i ], insertTransaction, null );
			}

			res.status( 202 ).send( "Processing transaction creation" );
		}
	} );


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

		validateTransaction( true, req.user, req.body, updateTransaction );

		res.status( 202 ).send( "Processing Update" );
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
