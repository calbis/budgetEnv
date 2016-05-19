var express = require( 'express' );
var path = require( 'path' );
var favicon = require( 'serve-favicon' );
var logger = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );
var passport = require( 'passport' );
var Strategy = require( 'passport-local' ).Strategy;
var users = require( './lib/users.js' );
var helmet = require( 'helmet' );
var session = require( 'express-session' );

var routes = require( './routes/index' );
var accounts = require( './routes/accounts' );
var envelopes = require( './routes/envelopes' );
var transactions = require( './routes/transactions' );
var login = require( './routes/login' );
var logout = require( './routes/logout' );

passport.use( new Strategy(
	function ( username, password, cb ) {
		users.findByUsername( username, function ( err, user ) {
			if ( err ) {
				return cb( err );
			}
			if ( ! user ) {
				return cb( null, false );
			}
			if ( user.password != password ) {
				return cb( null, false );
			}
			return cb( null, user );
		} );
	} ) );

passport.serializeUser( function ( user, cb ) {
	cb( null, user.id );
} );

passport.deserializeUser( function ( id, cb ) {
	users.findById( id, function ( err, user ) {
		if ( err ) {
			return cb( err );
		}
		cb( null, user );
	} );
} );


var app = express();

app.use( helmet() );

var sessionValues = {
	secret: 'change-me',
	resave: false,
	saveUninitialized: true,
	cookie: {
		name: 'session',
		httpOnly: true,
		domain: 'localhost',
		path: '/'
	}
};
if ( app.get( 'env' ) === 'production' ) {
	app.set( 'trust proxy', 1 );
	sessionValues.cookie.secure = true;
}
app.use( session( sessionValues ) );


// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'jade' );

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( require( 'express-session' )( { secret: 'change me', resave: false, saveUninitialized: false } ) );

app.use( passport.initialize() );
app.use( passport.session() );

app.use( '/', routes );
app.use( '/accounts', accounts );
app.use( '/envelopes', envelopes );
app.use( '/transactions', transactions );
app.use( '/login', login );
app.use( '/logout', logout );

// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
	var err = new Error( 'Not Found' );
	err.status = 404;
	next( err );
} );

// error handlers

// development error handler
// will print stacktrace
if ( app.get( 'env' ) === 'development' ) {
	app.use( function ( err, req, res, next ) {
		res.status( err.status || 500 );
		res.render( 'error', {
			message: err.message,
			error: err
		} );
	} );
}

// production error handler
// no stacktraces leaked to user
app.use( function ( err, req, res, next ) {
	res.status( err.status || 500 );
	res.render( 'error', {
		message: err.message,
		error: {}
	} );
} );


module.exports = app;
