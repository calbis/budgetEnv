'use strict';

var express = require( 'express' );
var db = require( '../lib/database.js' );
var router = express.Router();


function SendTransactionsByAccountId( response, accountId ) {
	var q = "Select * From vw_transaction T Where T.AccountId = ?";
	db.getRows( q, [accountId],
		function( rows ) {
			response.status( 200 ).send( rows );
		},
		function( status ) {
			response.status( status.code ).send( status.message );
		} );
}


router.post( '/',
	function( req, res ) {
		if ( req.user ) {
			if ( ! isNaN( req.body.accountId ) && req.body.accountId >= 0 ) {
				SendTransactionsByAccountId( res, req.body.accountId );
			} else if ( req.body.accountName.length > 0 ) {
				var q = "Select Id From account Where Name = ?";
				db.getRows( q, [req.body.accountName],
					function( rows ) {
						if ( rows.length > 0 ) {
							SendTransactionsByAccountId( res, rows[0].Id );
						}
					} );
			} else {
				res.status( 400 ).send( "Missing valid account id or name" );
			}
		}
		else {
			res.redirect( 401, '/' );
		}
	} );

module.exports = router;
