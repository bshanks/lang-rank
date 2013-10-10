
var cheerio = require('cheerio'),
  cron = require('cron').CronJob,
  request = require('request');

var langs = {
  like: [],
  dislike: []
};

var next = 'like';

var refresh = function () { console.log('running')
  request('http://news.ycombinator.com/item?id=6527104', function (err, res, body) {
    var $ = cheerio.load(body);

    langsLoved = {
      like: [],
      dislike: []
    };

    $('table table table').first().find('tr').each(function() {
      var langParts = this.find('font');
      if (langParts.length) {
        langParts = langParts.text().toLowerCase().split(' - ');
        langsLoved[langParts[1]].push({ name: langParts[0] });
        return;
      }

      var score = this.find('.comhead span');
      if (score.length) {
        score = score.text().split(' ')[0];
        langsLoved[next][langsLoved[next].length - 1].score = +score;
        next = next === 'like' ? 'dislike' : 'like';
      }
    });



    langsLovedWithLog = {
      like: [],
      dislike: []
    };

    $('table table table').first().find('tr').each(function() {
      var langParts = this.find('font');
      if (langParts.length) {
        langParts = langParts.text().toLowerCase().split(' - ');
        langsLovedWithLog[langParts[1]].push({ name: langParts[0] });
        return;
      }

      var score = this.find('.comhead span');
      if (score.length) {
        score = score.text().split(' ')[0];
        langsLovedWithLog[next][langsLovedWithLog[next].length - 1].score = +score;
        next = next === 'like' ? 'dislike' : 'like';
      }
    });



    langsHated = {
      like: [],
      dislike: []
    };

    $('table table table').first().find('tr').each(function() {
      var langParts = this.find('font');
      if (langParts.length) {
        langParts = langParts.text().toLowerCase().split(' - ');
        langsHated[langParts[1]].push({ name: langParts[0] });
        return;
      }

      var score = this.find('.comhead span');
      if (score.length) {
        score = score.text().split(' ')[0];
        langsHated[next][langsHated[next].length - 1].score = +score;
        next = next === 'like' ? 'dislike' : 'like';
      }
    });



    langsHatedWithLog = {
      like: [],
      dislike: []
    };

    $('table table table').first().find('tr').each(function() {
      var langParts = this.find('font');
      if (langParts.length) {
        langParts = langParts.text().toLowerCase().split(' - ');
        langsHatedWithLog[langParts[1]].push({ name: langParts[0] });
        return;
      }

      var score = this.find('.comhead span');
      if (score.length) {
        score = score.text().split(' ')[0];
        langsHatedWithLog[next][langsHatedWithLog[next].length - 1].score = +score;
        next = next === 'like' ? 'dislike' : 'like';
      }
    });



    langsWellknown = {
      like: [],
      dislike: []
    };

    $('table table table').first().find('tr').each(function() {
      var langParts = this.find('font');
      if (langParts.length) {
        langParts = langParts.text().toLowerCase().split(' - ');
        langsWellknown[langParts[1]].push({ name: langParts[0] });
        return;
      }

      var score = this.find('.comhead span');
      if (score.length) {
        score = score.text().split(' ')[0];
        langsWellknown[next][langsWellknown[next].length - 1].score = +score;
        next = next === 'like' ? 'dislike' : 'like';
      }
    });






    a = []
    for (var lang in langsWellknown['like']) {
	l = []
	l['name'] = langsWellknown['like'][lang]['name']
	likes = langsWellknown['like'][lang]['score']
	dislikes = langsWellknown['dislike'][lang]['score']
	l['score'] = likes+dislikes
	a[lang] = l
    }
    langsWellknown['(like+dislike)'] = a

      


    a = []
    for (var lang in langsLoved['like']) {
	l = []
	l['name'] = langsLoved['like'][lang]['name']
	likes = langsLoved['like'][lang]['score']
	dislikes = langsLoved['dislike'][lang]['score']
	l['score'] = likes/dislikes
	a[lang] = l
    }
    langsLoved['(like/dislike)'] = a



    a = []
    for (var lang in langsLoved['like']) {
	l = []
	l['name'] = langsLoved['like'][lang]['name']
	likes = langsLoved['like'][lang]['score']
	dislikes = langsLoved['dislike'][lang]['score']
	l['score'] = dislikes/likes
	a[lang] = l
    }
    langsHated['(dislike/like)'] = a



    a = []
    for (var lang in langsLovedWithLog['like']) {
	l = []
	l['name'] = langsLovedWithLog['like'][lang]['name']
	likes = langsLovedWithLog['like'][lang]['score']
	dislikes = langsLovedWithLog['dislike'][lang]['score']
	l['score'] = (likes/dislikes) * Math.log(likes)
	a[lang] = l
    }
    langsLovedWithLog['( (like/dislike)*log(like) )'] = a


    a = []
    for (var lang in langsLovedWithLog['like']) {
	l = []
	l['name'] = langsLovedWithLog['like'][lang]['name']
	likes = langsLovedWithLog['like'][lang]['score']
	dislikes = langsLovedWithLog['dislike'][lang]['score']
	l['score'] = (likes/(likes+dislikes)) * Math.log(likes)
	a[lang] = l
    }
    langsLovedWithLog['( (like/(like+dislike))*log(like) )'] = a



    a = []
    for (var lang in langsLovedWithLog['like']) {
	l = []
	l['name'] = langsLovedWithLog['like'][lang]['name']
	likes = langsLovedWithLog['like'][lang]['score']
	dislikes = langsLovedWithLog['dislike'][lang]['score']
	l['score'] = (dislikes/likes) * Math.log(dislikes)
	a[lang] = l
    }
    langsHatedWithLog['( (dislike/like)*log(dislike) )'] = a


    a = []
    for (var lang in langsLovedWithLog['like']) {
	l = []
	l['name'] = langsLovedWithLog['like'][lang]['name']
	likes = langsLovedWithLog['like'][lang]['score']
	dislikes = langsLovedWithLog['dislike'][lang]['score']
	l['score'] = (dislikes/(likes+dislikes)) * Math.log(dislikes)
	a[lang] = l
    }
    langsHatedWithLog['( (dislike/(like+dislike))*log(dislike) )'] = a



    // Dirichlet priors (e.g. psuedo-counts; see http://masanjin.net/blog/how-to-rank-products-based-on-user-input )
    mostUnpopularLanguage = 'other'
    mostUnpopularLanguageSum = Number.MAX_VALUE
    for (var lang in langsLoved['like']) {
	if (langsWellknown['(like+dislike)'][lang]['score'] < mostUnpopularLanguageSum) {
	    mostUnpopularLanguage = lang
	    mostUnpopularLanguageSum = langsWellknown['(like+dislike)'][lang]['score']
        }
    }



    a = []
    for (var lang in langsLovedWithLog['like']) {
	l = []
	l['name'] = langsLovedWithLog['like'][lang]['name']
	likes = langsLovedWithLog['like'][lang]['score']
	dislikes = langsLovedWithLog['dislike'][lang]['score']
	likesDirichlet = likes + mostUnpopularLanguageSum/2.0
	dislikesDirichlet = dislikes + mostUnpopularLanguageSum/2.0
	l['score'] = (likesDirichlet/(likesDirichlet+dislikesDirichlet)) * Math.log(likesDirichlet)
	a[lang] = l
    }
    langsLovedWithLog['( (likeDirichlet/(likeDirichlet+dislikeDirichlet))*log(likeDirichlet), where xDirichlet = x plus min_{over all languages}((like+dislike)/2) )'] = a



    a = []
    for (var lang in langsLoved['like']) {
	l = []
	l['name'] = langsLoved['like'][lang]['name']
	likes = langsLoved['like'][lang]['score']
	dislikes = langsLoved['dislike'][lang]['score']
	likesDirichlet = likes + mostUnpopularLanguageSum/2.0
	dislikesDirichlet = dislikes + mostUnpopularLanguageSum/2.0
	l['score'] = (likesDirichlet/(likesDirichlet+dislikesDirichlet))
	a[lang] = l
    }
    langsLoved['( (likeDirichlet/(likeDirichlet+dislikeDirichlet)), where xDirichlet = x plus min_{over all languages}((like+dislike)/2) )'] = a




    a = []
    for (var lang in langsLovedWithLog['like']) {
	l = []
	l['name'] = langsLovedWithLog['like'][lang]['name']
	likes = langsLovedWithLog['like'][lang]['score']
	dislikes = langsLovedWithLog['dislike'][lang]['score']
	likesDirichlet = likes + mostUnpopularLanguageSum/2.0
	dislikesDirichlet = dislikes + mostUnpopularLanguageSum/2.0
	l['score'] = (dislikesDirichlet/(likesDirichlet+dislikesDirichlet)) * Math.log(dislikesDirichlet)
	a[lang] = l
    }
    langsHatedWithLog['( (dislikeDirichlet/(likeDirichlet+dislikeDirichlet))*log(dislikeDirichlet), where xDirichlet = x plus min_{over all languages}((like+dislike)/2) )'] = a



    a = []
    for (var lang in langsLoved['like']) {
	l = []
	l['name'] = langsLoved['like'][lang]['name']
	likes = langsLoved['like'][lang]['score']
	dislikes = langsLoved['dislike'][lang]['score']
	likesDirichlet = likes + mostUnpopularLanguageSum/2.0
	dislikesDirichlet = dislikes + mostUnpopularLanguageSum/2.0
	l['score'] = (dislikesDirichlet/(likesDirichlet+dislikesDirichlet))
	a[lang] = l
    }
    langsHated['( (dislikeDirichlet/(likeDirichlet+dislikeDirichlet)), where xDirichlet = x plus min_{over all languages}((like+dislike)/2) )'] = a




    // http://www.evanmiller.org/how-not-to-sort-by-average-rating.html
    // thanks https://gist.github.com/honza/5050540
    function ci(pos, n) {
	  var z, phat;
	  z = 1.96;
	  if (n == 0) {return 0} else {
	      phat = 1 * pos / n;
	      return (phat + z*z/(2*n) - z * Math.sqrt((phat*(1-phat)+z*z/(4*n))/n))/(1+z*z/n);
	  }
    }


    a = []
    for (var lang in langsLoved['like']) {
	l = []
	l['name'] = langsLoved['like'][lang]['name']
	likes = langsLoved['like'][lang]['score']
	dislikes = langsLoved['dislike'][lang]['score']
	l['score'] = ci(likes, likes + dislikes)
	a[lang] = l
    }
    langsLoved['( lower bound of confidence interval at 95% level )'] = a



    a = []
    for (var lang in langsLoved['like']) {
	l = []
	l['name'] = langsLoved['like'][lang]['name']
	likes = langsLoved['like'][lang]['score']
	dislikes = langsLoved['dislike'][lang]['score']
	l['score'] = ci(dislikes, likes + dislikes)
	a[lang] = l
    }
    langsHated['( lower bound of confidence interval at 95% level )'] = a


    delete langsLoved['dislike']
    delete langsLovedWithLog['like']
    delete langsLovedWithLog['dislike']
    delete langsWellknown['like']
    delete langsWellknown['dislike']
    delete langsHated['like']
    delete langsHatedWithLog['like']
    delete langsHatedWithLog['dislike']


    for (var favour in langsLoved) {
      langsLoved[favour].sort(function (a, b) {
        return b.score - a.score;
      });
    }

    for (var favour in langsLovedWithLog) {
      langsLovedWithLog[favour].sort(function (a, b) {
        return b.score - a.score;
      });
    }

    for (var favour in langsHated) {
      langsHated[favour].sort(function (a, b) {
        return b.score - a.score;
      });
    }


    for (var favour in langsHatedWithLog) {
      langsHatedWithLog[favour].sort(function (a, b) {
        return b.score - a.score;
      });
    }





    console.log('done')
  });
};

new cron('*/30 * * * * *', refresh, null, true);
refresh();

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { langs: langs });
};
