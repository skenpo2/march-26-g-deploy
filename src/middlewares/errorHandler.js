const errorHandler = (err, req, res, next) => {
  const message = err.message || 'Internal Server Error';
  const statusCode = err.statusCode || 500;

  console.error(err.stack);
  res.status(statusCode).json({ error: message });
};

export default errorHandler;
