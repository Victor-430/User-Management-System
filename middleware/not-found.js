export const errorhandler = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: "internal server error" });
  }
};

export const routeError = (err, req, res, next) => {
  const error = new error("route not found");
  error.status = 404;
  next(error);
};
