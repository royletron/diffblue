var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var Git = require('nodegit');
var uuid = require('uuid');
var _ = require('underscore');
var mongoose = require('mongoose');
var Repository = require('./Repository');
var Commit = require('./Commit');
var path = require('path');
var rimraf = require('rimraf');

function cleanUp(directory) {
  rimraf(directory, {}, function() {
    console.log('directory '+directory+' removed');
  })
}

app.use(bodyParser.text());

app.post('/storeRepoDetails', function(req, res, next){
  var id = uuid.v1();
  var dir = path.join(__dirname, '/tmp/', id);
  Git.Clone(req.body, dir)
    .then(function(repo) {
      repo.getMasterCommit()
        .then(function(firstCommitOnMaster){
          if(firstCommitOnMaster) {
            var history = firstCommitOnMaster.history(Git.Revwalk.SORT.Time);
            history.on('end', function(commits) {
              var records = _.map(commits, function(commit){
                var author = commit.author();
                return {
                  sha: commit.sha(),
                  message: commit.message(),
                  date: new Date(commit.date()),
                  author: {
                    name: author.name(),
                    email: author.email()
                  }
                }
              })
              cleanUp(dir);
              Repository.createFromRaw(req.body, records, function(err, result){
                if(err) return next(new Error('Problem creating record for repository and commits'));
                res.send({status: 'ok', message: 'repo pulled and saved'});
              })
            });
            history.on('error', function(error) {
              cleanUp(dir);
              return next(new Error('having a problem with a commit'));
            });
            history.start();
          } else {
            cleanUp(dir);
            return next(new Error('no first commit'));
          }
        })
        .catch(function(err) {
          cleanUp(dir);
          return next(new Error('cannot get master commit'));
        })
    })
    .catch(function(err){
      cleanUp(dir);
      return next(new Error('failed to clone repository'));
    })
});

app.get('/wordsForAuthors', function(req, res, next) {
  var email = req.query.email;
  if(!email || email === '') {
    return next(new Error('you need to provide an email as a param'))
  } else {
    Commit.find({'author.email': email}, function(err, commits) {
      if(err) return next(new Error('problem with finding records'));
      var words = _.chain(commits)
                   .map(function(commit) {
                     return _.map(commit.message.replace(/\r?\n|\r/g, '').split(' '), function(word) { return word.toLowerCase() })
                   })
                   .flatten()
                   .unique();
      res.send(words);
    })
  }
})

app.use(function(err, req, res, next) {
  res.status(500).send({status: 'error', message: err.message});
});
// If you can't find a DB handy feel free to use
// mongodb://diffblue:diffblue@ds019986.mlab.com:19986/diffblue
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/diffblue')

// listen for requests :)
listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
