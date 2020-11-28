// Retrieved from https://www.acuriousanimal.com/blog/2018/03/15/express-async-middleware
// HOF to apply DRY and avoid repeating try/catch blocks (catching error embeded)

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
