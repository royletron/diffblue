var mongoose = require('mongoose');
var Commit = require('./Commit');
var async = require('async');
var _ = require('underscore');

var RepositorySchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  added: {
    type: Date,
    default: Date.now()
  },
  commits: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Commit'
  }]
})

RepositorySchema.statics.createUpdateAndFind = function(url, cb) {
  Repository.update(
    {url: url},
    {url: url},
    {upsert: true, setDefaultsOnInsert: true},
    function(err, result) {
      if(err) return cb(err);
      Repository.findOne({url: url}, cb);
    });
}

RepositorySchema.statics.createFromRaw = function(url, commits, cb) {
  Repository.createUpdateAndFind(url, function(err, repo){
    if(err) return cb(err);
    async.mapSeries(commits, function iterator(commit, callback) {
      Commit.createUpdateAndFind(_.extend(commit, {repository: repo._id}), callback)
    }, function done(err, results){
      if(err) {
        cb(err)
      } else {
        repo.commits = results;
        repo.save(cb);
      }
    })
  })
}

var Repository = mongoose.model('Repository', RepositorySchema);

module.exports = Repository;
