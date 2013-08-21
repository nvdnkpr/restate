function buildUpAA( config, authom, rest ){
	authom.on("auth", function(req, res, data) {
		req.session.provider = 'ToBeFilled';

		res.redirect( '/index.html?res=1' );
	});

	authom.on("error", function(req, res, data) {
		res.redirect( '/index.html?err=1' );
	});
}

exports.buildUpAA = buildUpAA;
