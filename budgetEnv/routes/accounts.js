var express = require( 'express' );
var db = require( '../lib/database.js' );
var router = express.Router();


/* GET accounts json. */
router.get( '/', function ( req, res, next ) {
	if(req.user) {
		var q = "Select A.Id, A.Name, A.Color As TextColor, A.ExternalTotal, S.AccountSum, S.AccountPending From account A Inner Join vw_account_sum S On A.Id = S.AccountId Where A.IsClosed = 0 And A.IsDeleted = 0";
		db.getRows( q, function ( rows ) {
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
		res.redirect(401, '/');
	}
} );

module.exports = router;
