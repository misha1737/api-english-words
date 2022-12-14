const jwt = require('jsonwebtoken');
module.exports = function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        let tokenData = jwt.decode(token)
        if (tokenData && tokenData.userId) {
            req.userId = tokenData.userId
        }
        if (!req.userId) return res.sendStatus(500).send("token error")
        next()
    })
}