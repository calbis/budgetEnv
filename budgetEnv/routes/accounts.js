var express = require( 'express' );
var db = require( '../lib/database.js' );
var router = express.Router();


/* GET accounts json. */
router.get( '/', function ( req, res, next ) {
	var q = "Select Id, Name, Color As TextColor From account Where IsClosed = 0 And IsDeleted = 0";
	db.getRows( q, function ( rows ) {
		res.writeHead( 200, {'content-type': 'application/json'} );
		res.write( JSON.stringify( rows ) );
		res.end( '\n' );
	}, function ( status ) {
		res.writeHead( status.code, {'content-type': 'application/json'} );
		res.write( JSON.stringify( status.message ) );
		res.end( '\n' );
	} );

} );

module.exports = router;
