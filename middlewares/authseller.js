const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        if (!token) {
            console.log(req.headers);
            res.status(403).json({ error: "NotLogin" });
        }
        else {
            console.log(token);
            const decodedToken = jwt.verify(token, process.env.JWT_secret_token);
            if (user.type !== "seller") {
                res.status(403).json({ message: "Not Login as Seller" });

            }
            else {
                req.user = decodedToken;
                return next();
            }
        }
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "NotLogin" });
    }
}