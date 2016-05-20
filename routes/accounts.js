'use strict';

var express = require( 'express' );
var db = require( '../lib/database.js' );
var router = express.Router();


function SendAccountSumDataById( response, accountId ) {
	var q = "Select A.Id, A.Name, A.Color As TextColor, A.ExternalTotal, S.AccountSum, S.AccountPending From account A Inner Join vw_account_sum S On A.Id = S.AccountId Where A.IsClosed = 0 And A.IsDeleted = 0 And A.Id = ?";
	db.getRows( q, [accountId], function ( rows ) {
		response.send( rows );
	}, function ( status ) {
		response.status( status.code ).send( status.message );
	} );
}


router.post( '/', function ( req, res ) {
	if ( ! req.user ) {
		res.redirect( 401, '/' );
		return;
	}
	if ( ! isNaN( req.body.accountId ) && req.body.accountId >= 0 ) {
		SendAccountSumDataById( res, req.body.accountId );
	} else if ( typeof req.body.accountName !== "undefined" && req.body.accountName.length > 0 ) {
		var q = "Select Id From account Where Name = ?";
		db.getRows( q, [req.body.accountName], function ( rows ) {
			if ( rows.length > 0 ) {
				SendAccountSumDataById( res, rows[0].Id );
			} else {
				res.status( 400 ).send( "Invalid account name provided" );
			}
		} );
	} else {
		res.status( 400 ).send( "Missing valid account id or name" );
	}
} );

/* GET accounts json. */
router.get( '/', function ( req, res ) {
	if ( ! req.user ) {
		res.redirect( 401, '/' );
		return;
	}

	var q = "Select A.Id, A.Name, A.Color As TextColor, A.ExternalTotal, S.AccountSum, S.AccountPending From account A Inner Join vw_account_sum S On A.Id = S.AccountId Where A.IsClosed = 0 And A.IsDeleted = 0";
	db.getRows( q, null, function ( rows ) {
		res.send( rows );
	}, function ( status ) {
		res.status( status.code ).send( status.message );
	} );
} );

module.exports = router;
