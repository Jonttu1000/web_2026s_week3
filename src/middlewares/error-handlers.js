import {validationResult} from 'express-validator';

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const status =
    Number(err.status || err.statusCode) ||
    (err.code === 'LIMIT_FILE_SIZE' ? 400 : 500);
  const safeStatus = status >= 400 && status < 500 ? status : 500;
  const message = safeStatus === 500 ? 'Internal server error' : err.message;

  res.status(safeStatus).json({
    error: {
      message,
      status: safeStatus,
    },
  });
};

const validationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
    return;
  }

  const error = new Error('Validation failed');
  error.status = 400;
  error.details = errors.array();
  next(error);
};

export {notFoundHandler, errorHandler, validationErrors};
