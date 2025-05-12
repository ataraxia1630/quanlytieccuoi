//Xử lý lỗi toàn cục
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({ error: err.message, stack: err.stack });
  } else {
    res.status(500).send("Something went wrong!");
  }
};
