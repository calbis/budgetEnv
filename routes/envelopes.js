'use strict';

var express = require( 'express' );
var db = require( '../lib/database.js' );
var router = express.Router();


function SendEnvelopeSumDataByAccountId( response, accountId ) {
	var q = "Select * From vw_envelope_sum_ext E Where E.AccountId = ?";
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
		if ( ! req.user ) {
			res.redirect( 401, '/' );
			return;
		}

		if ( ! isNaN( req.body.accountId ) && req.body.accountId >= 0 ) {
			SendEnvelopeSumDataByAccountId( res, req.body.accountId );
		} else if ( typeof req.body.accountName !== "undefined" && req.body.accountName.length > 0 ) {
			var q = "Select Id From account Where Name = ?";
			db.getRows( q, [req.body.accountName],
				function( rows ) {
					if ( rows.length > 0 ) {
						SendEnvelopeSumDataByAccountId( res, rows[0].Id );
					} else {
						res.status( 400 ).send( "Invalid account name" );
					}
				} );
		} else {
			res.status( 400 ).send( "Missing valid account id or name" );
		}
	} );

module.exports = router;
