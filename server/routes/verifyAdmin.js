module.exports = function (req, res, next) {
    // req.user was added by the previous verifyToken middleware
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access Denied: Admins Only" });
    }
    next();
};