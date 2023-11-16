const jsonValidator = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.message.includes('JSON')) {
      res.status(400).json({ message: 'Bad request | Invalid JSON format' });
    } else {
      next();
    }
  };
  
  module.exports = jsonValidator;