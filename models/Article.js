const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    photoCover: {
      filename: String,
      contentType: String,
      metadata: String,
    }, // untuk ngestore foto cover artikel
    photoArticle: [
      {
        filename: String,
        contentType: String,
        metadata: String,
      },
    ],
    likes: {
      type: Map,
      of: Boolean,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;