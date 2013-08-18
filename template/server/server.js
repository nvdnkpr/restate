var connect = require('connect'),
	redirect = require('connect-redirection'),
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

connectivity.connectMongo( mongoose, config.mongodb, function( db ){
	var app = connect()
		.use( redirect() )
		.use( connect.static('./dist/www') )
		.use( connect.query() )
		.use( connect.cookieParser() )
		.use( connect.session( { key: config.server.name + '.sid',  secret: config.server.sessionHashSecret, cookie: { httpOnly: false } } ) )
	;

	global.db = db;


-aa-
	console.log('Auth services added...');
	authenticator.buildUpAA( config, authom, rest );
	app.use( rest.dispatcher( 'GET', '/auth/:service', authom.app ) );
-eoaa-

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
