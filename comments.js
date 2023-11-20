// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./models/comment');
var seedDB = require('./seeds');

// Connect to mongodb
mongoose.connect('mongodb://localhost/yelp_camp_v4', {useMongoClient: true});
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// seedDB();

app.get('/', function(req, res) {
    res.render('landing');
});

// INDEX - show all comments
app.get('/comments', function(req, res) {
    // Get all comments from DB
    Comment.find({}, function(err, allComments) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/index', {comments: allComments});
        }
    });
});

// CREATE - add new comment to DB
app.post('/comments', function(req, res) {
    // Get data from form and add to comments array
    var author = req.body.author;
    var text = req.body.text;
    var newComment = {author: author, text: text};
    // Create a new comment and save to DB
    Comment.create(newComment, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // Redirect back to comments page
            res.redirect('/comments');
        }
    });
});

// NEW - show form to create new comment
app.get('/comments/new', function(req, res) {
    res.render('comments/new');
});

// SHOW - shows more info about one comment
app.get('/comments/:id', function(req, res) {
    // Find the comment with provided ID
    Comment.findById(req.params.id).exec(function(err, foundComment) {
        if (err) {
            console.log(err);
        } else {
            // Render show template with that comment
            res.render('comments/show', {comment: foundComment});
        }
    });
});

app.listen(3000, function() {
    console.log('Server has started!');
});