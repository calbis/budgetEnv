var express = require( 'express' );
var router = express.Router();

var passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' ).Strategy;

router.get( '/', function ( req, res, next ) {
	res.render( 'login', {title: 'Login'} );
} );

router.post( '/', passport.authenticate( 'local', {failureRedirect: '/login', successRedirect: '/'} ) );

module.exports = router;