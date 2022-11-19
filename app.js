const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  "title": String,
  "content": String
});

const Article = mongoose.model("Article", articleSchema);


////////////////////////Requests Targeting all Article////////////////////////

app.route("/articles")

  .get(function(req, res) {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      };
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err)
      };
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      };
    });
  });


////////////////////////Requests Targeting a Specific Article////////////////////////

app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (!err) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No Articles matching that title was found.");
        };
      } else {
        res.send(err);
      };
    });
  })

  .put(function(req, res) {
    Article.updateOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        upsert: true
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated the Article.");
        } else {
          res.send(err);
        };
      }
    );
  })

  .patch(function(req, res) {
    Article.updateOne({
        title: req.params.articleTitle
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated article.")
        } else {
          res.send(err);
        };
      }
    );
  })

  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (!err) {
        res.send("Successfully deleted the article.");
      } else {
        res.send(err);
      };
    });
  });




const port = 3000;
app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
