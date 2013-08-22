var connect = require('connect'),
	redirect = require('connect-redirection'),
	FileStore = require('connect-session-file'),
	http = require('http');

-rest-
var rest = require('connect-rest');
var restMaker = require('./restMaker');
-eorest-

var connectivity = require('./connectivity');

-aa-
var authom = require("authom");
var authenticator = require("./authenticator");
-eoaa-

var mongoose = require('mongoose');
require('mongoose-function')(mongoose);
var schemagen = require('mongoose-schemagen');

var Puid = require('puid');
var puid = new Puid();

var config = {};
config = require('jsonconfig');

config.load( [
	(process.env['DEVELOPMENT_MODE'] ? './config/serverDev.json' : './config/server.json')
] );

connectivity.connectMongo( mongoose, config.mongodb, function( err, db ){
	if( err ){
		console.error( err );
		process.exit(1);
	}

	var app = connect()
		.use( connect.static('./dist/www') )
		.use( connect.query() )
		.use( connect.cookieParser() )
		.use( connect.session( {
			key: config.server.name + '.sid',
			secret: config.server.sessionHashSecret,
			cookie: { httpOnly: false },
			store: new FileStore({
				db: './sessions.db'
			})
		} ) )
		.use( redirect() )
	;

	global.db = db;


-aa-
	console.log('Auth services added...');
	authenticator.buildUpAA( config, authom, rest );
	app.use( rest.dispatcher( 'GET', '/auth/:service', authom.app ) );
-eoaa-

	console.log('API security added...');
	app.use( function(req, res, next){
		if( !req.session || !req.session.provider ){
			console.log( req.session, req.session.provider );
			if(req.session)
				req.session.destroy();
			res.redirect( '/viesa.html?err=1' );
		}
		else next();
	} );

-rest-
	var options = {
		context: '/api',
		logger:{ name: config.server.name, level: 'debug' }
	};
	app.use( rest.rester( options ) );
	console.log('Rest services added...');
	restMaker.buildUp( rest );
-eorest-

	console.log('Server setting up...');
	var port = process.env.PORT || config.server.port || 8080;
	http.createServer(app).listen( port, function() {
		console.log('Running on http://localhost:' + port);
	});
} );
