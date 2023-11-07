const asyncHandler = require("express-async-handler");
const Article = require("../models/Article");

const createArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const files = req.files;

  const authorId = req.user.userId;

  const filearr = files.map((file) => {
    const arr = {
      filename: file.filename,
      contentType: file.mimetype,
      metadata: "Photo Article",
    };
    return arr;
  });

  console.log(filearr);

  const newArticle = new Article({
    title,
    content,
    photoArticle: filearr,
    likes: {},
    authorId: authorId,
  });
  await newArticle.save();

  res.status(201).json({ msg: "New Article is saved", newArticle});
});

const uploadThumbnail = asyncHandler(async (req, res) => {
  const { file } = req;

  const article = await Article.findOne({ _id: req.params.articleId });

  const photoCover = {
    filename: file.filename,
    contentType: file.mimetype,
    metadata: "article photo cover",
  };

  article.photoCover = photoCover;

  res.status(201).json({ msg: "Thumbnail is save", article });
});

module.exports = {
  createArticle,
  uploadThumbnail,
};
