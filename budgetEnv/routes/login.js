var express = require( 'express' );
var router = express.Router();

var passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' ).Strategy;

router.post( '/', passport.authenticate( 'local', { successRedirect: '/' } ) );

module.exports = router;