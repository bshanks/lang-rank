
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

    var newLangs = {
      like: [],
      dislike: []
    };

    $('table table table').first().find('tr').each(function() {
      var langParts = this.find('font');
      if (langParts.length) {
        langParts = langParts.text().toLowerCase().split(' - ');
        newLangs[langParts[1]].push({ name: langParts[0] });
        return;
      }

      var score = this.find('.comhead span');
      if (score.length) {
        score = score.text().split(' ')[0];
        newLangs[next][newLangs[next].length - 1].score = +score;
        next = next === 'like' ? 'dislike' : 'like';
      }
    });


    a = []
    for (var lang in newLangs['like']) {
	l = []
	l['name'] = newLangs['like'][lang]['name']
	likes = newLangs['like'][lang]['score']
	dislikes = newLangs['dislike'][lang]['score']
	l['score'] = likes+dislikes
	a[lang] = l
    }
    newLangs['(like+dislike)'] = a

      


    a = []
    for (var lang in newLangs['like']) {
	l = []
	l['name'] = newLangs['like'][lang]['name']
	likes = newLangs['like'][lang]['score']
	dislikes = newLangs['dislike'][lang]['score']
	l['score'] = likes/dislikes
	a[lang] = l
    }
    newLangs['(like/dislike)'] = a

    a = []
    for (var lang in newLangs['like']) {
	l = []
	l['name'] = newLangs['like'][lang]['name']
	likes = newLangs['like'][lang]['score']
	dislikes = newLangs['dislike'][lang]['score']
	l['score'] = (likes/dislikes) * Math.log(likes)
	a[lang] = l
    }
    newLangs['( (like/dislike)*log(like) )'] = a


    a = []
    for (var lang in newLangs['like']) {
	l = []
	l['name'] = newLangs['like'][lang]['name']
	likes = newLangs['like'][lang]['score']
	dislikes = newLangs['dislike'][lang]['score']
	l['score'] = (likes/(likes+dislikes)) * Math.log(likes)
	a[lang] = l
    }
    newLangs['( (like/(like+dislike))*log(like) )'] = a


    // Dirichlet priors (e.g. psuedo-counts; see http://masanjin.net/blog/how-to-rank-products-based-on-user-input )
    mostUnpopularLanguage = 'other'
    mostUnpopularLanguageSum = Number.MAX_VALUE
    for (var lang in newLangs['like']) {
	if (newLangs['(like+dislike)'][lang]['score'] < mostUnpopularLanguageSum) {
	    mostUnpopularLanguage = lang
	    mostUnpopularLanguageSum = newLangs['(like+dislike)'][lang]['score']
        }
    }

    a = []
    for (var lang in newLangs['like']) {
	l = []
	l['name'] = newLangs['like'][lang]['name']
	likes = newLangs['like'][lang]['score']
	dislikes = newLangs['dislike'][lang]['score']
	likesDirichlet = likes + mostUnpopularLanguageSum/2.0
	dislikesDirichlet = dislikes + mostUnpopularLanguageSum/2.0
	l['score'] = (likesDirichlet/(likesDirichlet+dislikesDirichlet)) * Math.log(likesDirichlet)
	a[lang] = l
    }
    newLangs['( (likeDirichlet/(likeDirichlet+dislikeDirichlet))*log(likeDirichlet), where xDirichlet = x plus min_{over all languages}((like+dislike)/2) )'] = a


    a = []
    for (var lang in newLangs['like']) {
	l = []
	l['name'] = newLangs['like'][lang]['name']
	likes = newLangs['like'][lang]['score']
	dislikes = newLangs['dislike'][lang]['score']
	likesDirichlet = likes + mostUnpopularLanguageSum/2.0
	dislikesDirichlet = dislikes + mostUnpopularLanguageSum/2.0
	l['score'] = (likesDirichlet/(likesDirichlet+dislikesDirichlet))
	a[lang] = l
    }
    newLangs['( (likeDirichlet/(likeDirichlet+dislikeDirichlet)), where xDirichlet = x plus min_{over all languages}((like+dislike)/2) )'] = a



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
    for (var lang in newLangs['like']) {
	l = []
	l['name'] = newLangs['like'][lang]['name']
	likes = newLangs['like'][lang]['score']
	dislikes = newLangs['dislike'][lang]['score']
	l['score'] = ci(likes, likes + dislikes)
	a[lang] = l
    }
    newLangs['( lower bound of confidence interval at 95% level )'] = a

    for (var favour in newLangs) {
      newLangs[favour].sort(function (a, b) {
        return b.score - a.score;
      });
    }

    langs = newLangs;
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
