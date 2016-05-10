var express = require( 'express' );
var db = require( '../lib/database.js' );
var router = express.Router();


router.post( '/', function ( req, res, next ) {
	if ( req.user ) {
		if ( ! isNaN( req.body.accountId ) ) {
			var q = "Select * From vw_envelope A Inner Join vw_account_sum S On A.Id = S.AccountId Where A.IsClosed = 0 And A.IsDeleted = 0 And A.Id = ?";
			db.getRows( q, [ req.body.accountId ], function ( rows ) {
				res.writeHead( 200, {'content-type': 'application/json'} );
				res.write( JSON.stringify( rows ) );
				res.end( '\n' );
			}, function ( status ) {
				res.writeHead( status.code, {'content-type': 'application/json'} );
				res.write( JSON.stringify( status.message ) );
				res.end( '\n' );
			} );
		} else {
			res.writeHead( 400, {'content-type': 'application/json'} );
			res.write( JSON.stringify( "Missing account id" ) );
			res.end( '\n' );
		}
	}
	else {
		res.redirect( 401, '/' );
	}
} );

module.exports = router;
