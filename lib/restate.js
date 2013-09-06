#!/usr/bin/env node

var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string'); // => true

var fs = require('fs'),
	wrench = require('wrench'),
    util = require('util');

var ext = require('./ext');

var cmd = process.argv[0];
var endsWithNode = _( cmd ).endsWith("node") || _( cmd ).endsWith("node.exe");
var args = _.rest(process.argv, endsWithNode ? 2 : 1 );

if (args.length === 0) {
	console.log( 'Standing in a folder, you can execute this:\n\trestate [path]/projectName\nThis will create a new subfolder with the given project name, and put everything you need in it.' );
	process.exit( 1 );
}

function cutVariables(file, token, newToken){
	var pgJSON = fs.readFileSync( file, {encoding: 'utf8'} );
	var npgJSON = pgJSON.replace( token, newToken );
	fs.writeFileSync( file, npgJSON );
}
function replaceVariables(file, token, newToken){
	var pgJSON = fs.readFileSync( file, {encoding: 'utf8'} );
	var npgJSON = pgJSON.replaceAll( token, newToken );
	fs.writeFileSync( file, npgJSON );
}

console.log('Working...');

console.log('Creating project structure... ' );

var preserveFiles =  _.contains(args, '--preserveFiles');

var aaNotNeeded =  _.contains(args, '--noAA');

var restNotNeeded =  _.contains(args, '--noREST');

var mongoNotNeeded =  _.contains(args, '--noMongo');

function removeBlocks( notNeeded, file, fileToBeRemoved, startToken, endToken, regexp, replaceToken ){
	if( !notNeeded ){
		replaceVariables( file, startToken, replaceToken );
		replaceVariables( file, endToken, replaceToken );
	} else {
		if( fileToBeRemoved )
			fs.unlinkSync( fileToBeRemoved );
		cutVariables( file, new RegExp( regexp ), replaceToken );
	}
}

wrench.copyDirRecursive( __dirname + '/../template/', args[0],
	{ forceDelete: preserveFiles, excludeHiddenUnix: false, preserveFiles: preserveFiles, inflateSymlinks: false},
function (err) {
	if (err) {
		wrench.rmdirSyncRecursive( args[0], true );
		throw err;
	} else{
		fs.chmodSync( args[0] + '/gruntRun.sh', 0755);
		fs.chmodSync( args[0] + '/buildDevelopment.sh', 0755);
		fs.chmodSync( args[0] + '/buildProduction.sh', 0755);

		replaceVariables( args[0] + '/package.json', 'projectName', args[0] );
		replaceVariables( args[0] + '/config/server.json', 'projectName', args[0] );
		replaceVariables( args[0] + '/config/serverDev.json', 'projectName', args[0] );

		removeBlocks(aaNotNeeded, args[0] + '/package.json', null, '-aa-', '-eoaa-', new RegExp( /\-aa\-[^\-]*\-eoaa\-/g ), '' );
		removeBlocks(aaNotNeeded, args[0] + '/server/server.js', args[0] + '/server/authenticator.js', '-aa-', '-eoaa-', new RegExp( /\-aa\-[^\-]*\-eoaa\-/g ), '' );

		removeBlocks(restNotNeeded, args[0] + '/package.json', null, '-rest-', '-eorest-', new RegExp( /\-rest\-[^\-]*\-eorest\-/g ), '' );
		removeBlocks(restNotNeeded, args[0] + '/server/server.js', args[0] + '/server/restMaker.js', '-rest-', '-eorest-', new RegExp( /\-rest\-[^\-]*\-eorest\-/g ), '' );

		removeBlocks(mongoNotNeeded, args[0] + '/package.json', null, '-mongo-', '-eomongo-', new RegExp( /\-mongo\-[^\-]*\-eomongo\-/g ), '' );
		removeBlocks(mongoNotNeeded, args[0] + '/server/server.js', null, '-mongo-', '-eomongo-', new RegExp( /\-mongo\-[^\-]*\-eomongo\-/g ), '' );

		removeBlocks(mongoNotNeeded, args[0] + '/package.json', null, '-ko-', '-eoko-', new RegExp( /\-ko\-[^\-]*\-eoko\-/g ), '' );
		removeBlocks(mongoNotNeeded, args[0] + '/views/head.jade', null, '-ko-', '-eoko-', new RegExp( /\-ko\-[^\-]*\-eoko\-/g ), '' );
		removeBlocks(mongoNotNeeded, args[0] + '/Gruntfile.js', null, '-ko-', '-eoko-', new RegExp( /\-ko\-[^\-]*\-eoko\-/g ), '' );
	}
});
