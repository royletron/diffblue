Node.js
=======

We would like you to provide a solution to the following task:

Implement a Node.js Express server which will provide two calls:
1) "/storeRepoDetails".
2) "/wordsForAuthors".

The first call will take a single parameter "repository" (either using GET or POST, the choice is up to you), which contains a link to a public http repository. The server will clone the repository on a local filesystem, and then extract information (date, author, commit message) about all the commits in the repository. This information then gets stored in a MongoDB database using Mongoose. Upon completion, the server returns a JSON file, either {"success" : true} if everything went through, or {"success" : false, "errorMessage" : "..."} with an explanatory error message in case there was a problem.

The second call will take a single parameter "author" (again using GET or POST), which contains a string representing an author of commits. The returned value will be a JSON array of strings containing all words that occur in author's commit messages. The list should not contain any repetitions.

Running Notes
=====

To run with `npm`

```bash
npm start
```

or straight up `node`

```bash
node server.js
```

On running you can set two env vars - 'PORT' your desired port number (defaults 3000), and 'MONGODB_URI' which is a mongo db uri (defaults to localhost/diffblue). If you have no DB running locally expect it to crash on run, I have provided a URI in the comments of the code that can be used if setting up a local MongoDB is too much trouble.

Usage
=====

As requested, you can `POST` to `/storeRepoDetails` with a URL to a public repository that you want processed as plain text body. For example

```bash
curl -X POST -H "Content-Type: text/plain" -d 'https://github.com/royletron/dungeon-advisor' "http://localhost:3000/storeRepoDetails"
```

Which will respond with an object of format `{status: 'ok' || 'error', message: 'relevant message appears here'}` for the above you should get

```javascript
{"status":"ok","message":"repo pulled and saved"}
```

Once there is some data in the DB for repos you can then get word data for a particular commiter using a `GET` to `/wordsForAuthors` with the email of the commiter sent as a query param. For example:

```bash
curl -X GET -H "Content-Type: text/javascript" "http://localhost:3000/wordsForAuthors?email=darren.royle@oup.com"
```
