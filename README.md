Node.js
=======

We would like you to provide a solution to the following task:

Implement a Node.js Express server which will provide two calls:
1) "/storeRepoDetails".
2) "/wordsForAuthors".

The first call will take a single parameter "repository" (either using GET or POST, the choice is up to you), which contains a link to a public http repository. The server will clone the repository on a local filesystem, and then extract information (date, author, commit message) about all the commits in the repository. This information then gets stored in a MongoDB database using Mongoose. Upon completion, the server returns a JSON file, either {"success" : true} if everything went through, or {"success" : false, "errorMessage" : "..."} with an explanatory error message in case there was a problem.

The second call will take a single parameter "author" (again using GET or POST), which contains a string representing an author of commits. The returned value will be a JSON array of strings containing all words that occur in author's commit messages. The list should not contain any repetitions.
