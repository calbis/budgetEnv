'use strict';

var moment = require( 'moment' );


exports.getSqlDateNow = function() {
	return moment().format( 'YYYY-MM-DD HH:mm:ss' );
};