var express = require( 'express' );
var db = require( '../lib/database.js' );
var router = express.Router();


function SendTransactionsByAccountId( response, accountId ) {
	var q = "Select * From vw_transaction T Where T.AccountId = ?";
	db.getRows( q, [ accountId ], function ( rows ) {
		response.writeHead( 200, {'content-type': 'application/json'} );
		response.write( JSON.stringify( rows ) );
		response.end( '\n' );
	}, function ( status ) {
		response.writeHead( status.code, {'content-type': 'application/json'} );
		response.write( JSON.stringify( status.message ) );
		response.end( '\n' );
	} );
}


router.post( '/', function ( req, res, next ) {
	if ( req.user ) {
		if ( ! isNaN( req.body.accountId ) && req.body.accountId >= 0 ) {
			SendTransactionsByAccountId( res, req.body.accountId );
		} else if ( req.body.accountName.length > 0 ) {
			var q = "Select Id From account Where Name = ?";
			db.getRows( q, [ req.body.accountName ], function ( rows ) {
				if ( rows.length > 0 ) {
					SendTransactionsByAccountId( res, rows[ 0 ].Id );
				}
			} );
		} else {
			res.writeHead( 400, {'content-type': 'application/json'} );
			res.write( JSON.stringify( "Missing valid account id or name" ) );
			res.end( '\n' );
		}
	}
	else {
		res.redirect( 401, '/' );
	}
} );

module.exports = router;
