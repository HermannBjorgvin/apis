var request = require('request'),
  app = require('../../server'),
  cheerio = require('cheerio'),
  _ = require('underscore');

app.get('/hospital', function(req, res){
  request.get({ url: 'http://www.landspitali.is/' }, function(err, response, body) {
    if(err || response.statusCode !== 200)
      return res.json(500,{error: 'www.landspitali.is refuses to respond or give back data'});

    var $;
    try {
        $ = cheerio.load( body );
    } catch (e) {
    	return res.json(500, { error: 'An error occured when parsing the data from landspitali.is' });
    }
    
    var data = {};
    _.each($('.activityNumbers.activityNumbersNew').children('div'), function(elem) {
	data[elem.attribs.class] = parseInt($(elem).children().eq(1).html());
    });
    return res.cache(3600).json({ results: [data] });	// Cache for a hour.
  });
});
