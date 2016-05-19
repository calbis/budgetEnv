var express = require( 'express' );
var db = require( '../lib/database.js' );
var router = express.Router();


function SendAccountSumDataById( response, accountId ) {
	var q = "Select A.Id, A.Name, A.Color As TextColor, A.ExternalTotal, S.AccountSum, S.AccountPending From account A Inner Join vw_account_sum S On A.Id = S.AccountId Where A.IsClosed = 0 And A.IsDeleted = 0 And A.Id = ?";
	db.getRows( q, [accountId], function ( rows ) {
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
			SendAccountSumDataById( res, req.body.accountId );
		} else if ( req.body.accountName.length > 0 ) {
			var q = "Select Id From account Where Name = ?";
			db.getRows( q, [req.body.accountName], function ( rows ) {
				if ( rows.length > 0 ) {
					SendAccountSumDataById( res, rows[0].Id );
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

/* GET accounts json. */
router.get( '/', function ( req, res, next ) {
	if ( req.user ) {
		var q = "Select A.Id, A.Name, A.Color As TextColor, A.ExternalTotal, S.AccountSum, S.AccountPending From account A Inner Join vw_account_sum S On A.Id = S.AccountId Where A.IsClosed = 0 And A.IsDeleted = 0";
		db.getRows( q, null, function ( rows ) {
			res.writeHead( 200, {'content-type': 'application/json'} );
			res.write( JSON.stringify( rows ) );
			res.end( '\n' );
		}, function ( status ) {
			res.writeHead( status.code, {'content-type': 'application/json'} );
			res.write( JSON.stringify( status.message ) );
			res.end( '\n' );
		} );
	}
	else {
		res.redirect( 401, '/' );
	}
} );

module.exports = router;
