var mongoose = require('mongoose');

var CommitSchema = mongoose.Schema({
  repository: {
    type: mongoose.Schema.ObjectId, 
    ref: 'Repository'
  },
  message: String,
  sha: String,
  date: Date,
  author: {
    name: String,
    email: String
  }
})

CommitSchema.statics.createUpdateAndFind = function(data, cb) {
  if(!data.sha) {
    return cb({message: 'You need to provide a SHA'});
  }
  Commit.update(
    {sha: data.sha}, 
    data, 
    {upsert: true, setDefaultsOnInsert: true}, 
    function(err, result) {
      if(err) return cb(err);
      Commit.findOne({sha: data.sha}, cb);
    });
}
var Commit = mongoose.model('Commit', CommitSchema);

module.exports = Commit;