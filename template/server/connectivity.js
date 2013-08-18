exports.connectMongo = function(mongoose, options, callback) {
	var host = process.env.MONGODB_DEVELOPMENT_HOST || options.host || 'localhost';
	var port = process.env.MONGODB_DEVELOPMENT_PORT || options.port || 27017;
	var poolSize = options.poolSize || 5;
	var user = process.env.MONGODB_DEVELOPMENT_USER || options.user;
	var pass = process.env.MONGODB_DEVELOPMENT_PASSWORD || options.pass;
	var dbName = process.env.MONGODB_DEVELOPMENT_DB || options.name || 'division';

	var uri = 'mongodb://' + (user ? user + ':' + pass + '@' : '' )  + host + ':' + port + '/' + dbName;

	var opts = { server: { auto_reconnect: true, poolSize: poolSize }, db:{ safe:true, fsync:true }, user: user, pass: pass };

	mongoose.connect( uri, opts );

	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));
	db.on('open', function() {
		console.log('Connected to MongoDB');

		if(callback)
			callback( db );
	});

	exports.db = db;
};