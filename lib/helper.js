'use strict';

exports.WriteResponse = function ( response, statusCode, message ) {
	response.writeHead( statusCode, { 'content-type': 'application/json' } );
	response.write( JSON.stringify( message ) );
	response.end( '\n' );
};