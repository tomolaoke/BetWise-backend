const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Admin? Go ahead!
  } else {
    res.status(403).json({ message: 'Only admins allowed here!' });
  }
};

module.exports = { admin };