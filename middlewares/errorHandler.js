const errorHandler = (error, req, res, next) => {
  const status = res.statusCode ? res.statusCode : 500; // server error
  console.log(error);
  return res.status(status).json({ message: error.message });
};

module.exports = errorHandler;
