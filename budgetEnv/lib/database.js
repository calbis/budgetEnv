var maria = require( 'mysql' );

var pool = maria.createPool( {
	connectionLimit: 100, //important
	host: 'localhost',
	user: 'www',
	password: 'Password123',
	database: 'accounts',
	debug: false
} );


exports.getRows = function ( queryString, values, successFn, errorFn ) {
	pool.getConnection( function ( err, connection ) {
		if ( err ) {
			connection.release();
			errorFn( {"code": 100, "message": "Error connecting to the database"} );
		}

		connection.query( queryString, values, function ( err, rows ) {
			connection.release();
			if ( ! err ) {
				successFn( rows );
			}
		} );

		connection.on( 'error', function ( err ) {
			errorFn( {"code": 100, "message": "Error in database connection"} );
		} );
	} );
}