var express = require( 'express' );
var db = require( '../lib/database.js' );
var router = express.Router();


function SendEnvelopeSumDataByAccountId( response, accountId ) {
	var q = "Select * From vw_envelope_sum_ext E Where E.AccountId = ?";
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
			SendEnvelopeSumDataByAccountId( res, req.body.accountId );
		} else if ( req.body.accountName.length > 0 ) {
			var q = "Select Id From account Where Name = ?";
			db.getRows( q, [ req.body.accountName ], function ( rows ) {
				if ( rows.length > 0 ) {
					SendEnvelopeSumDataByAccountId( res, rows[ 0 ].Id );
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
