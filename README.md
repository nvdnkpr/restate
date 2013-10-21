restate
=======

[restate](https://github.com/imrefazekas/restate) is a simple framework aiding the creation of REST-based nodejs applications.

Just a quick generator for projects using technologies: [connect](http://www.senchalabs.org/connect/), [jade](http://jade-lang.com), [less](http://lesscss.org) and [connect-rest](https://github.com/imrefazekas/connect-rest).

Generates everything you need: build files, ready-to-serve server code, project folder structure, basic deployment stage-levels


# Installation

	$ npm install -g restate


# Usage

Step into a folder where you want to create your new project folder and execute the following from command line:

	$ restate projectName [--preserveFiles] [--noAA] [--noREST] [--noMongo]

This will create the project structure and scripts for it allowing you to build into 2 different stages: development and production. 

[restate](https://github.com/imrefazekas/restate) finishes in an instant and you are ready to go! (have a running local mongo!)

	$ ./buildDevelopment.sh

And open browser:

	http://localhost:8080/

Done. :)


# Configuration

	--preserveFiles 
	Will try not to override any existing files.

	--noAA
	Removes the built-in A&A tempalte code from the server-side.

	--noREST
	Removes the built-in RESTful tempalte code from the server-side.

	--noMongo
	Removes the built-in MongoDB tempalte code from the services-side


# Project structure

	.gitignore --- usual
	buildDevelopment.sh --- shorthand for gruntRun.sh
	buildProduction.sh --- shorthand for gruntRun.sh
	config/ --- json config files configuring server and db connectivity
	Gruntfile.js --- grunt file and plugins
	gruntRun.sh --- runs grunt with a parameter specifying the stage level
	less/ --- folder for less files
	package.json --- usual
	server/ --- js files of the server. RESTful services, connect server, A&A services, Mongo connectivity
	views/ --- folder for the jade files
	www/ --- static files' folder

Every build will be put into the created __'dist'__ folder.


Feel free to add requests to extend the capabilities of this utility!