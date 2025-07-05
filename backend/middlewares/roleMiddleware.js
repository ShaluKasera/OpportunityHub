const authorizeRoles = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({success:false, message: "Unauthorized: User not authenticated" });
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({success:false, message: "Unauthorized Access! You are not authorized to access this resource." });
      }
      next();
    } catch (error) {
      console.error( `authorizeRoles error: ${error}` );
      res.status(500).json({ success:false, message: `authorizeRoles error: ${error}` });
    }
  };
};

module.exports = { authorizeRoles };
