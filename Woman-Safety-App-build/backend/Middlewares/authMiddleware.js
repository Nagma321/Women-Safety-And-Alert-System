
const Authenticated = (req, res, next) => {
    const token = req.cookies.jwt;
  
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({
        authenticated: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username
        }
      });
      next();
    } catch (error) {
      res.status(401).json({ authenticated: false });
    }
  }

  export {Authenticated}