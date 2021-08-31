const jwt = require('jsonwebtoken');

const checklogin = (req, res, next) => {
    const { authentication} = req.headers;
    try{
        const token = authentication.split(' ')[1];
        const decord = jwt.verify(token, process.env.JWT_SECRATE);

        const { username , userID } = decord;

        req.username = username;
        req.userID = userID;
        next();
    } catch{
        res.status(401).json({
            Error: "login Falied"
        })

    }
}

module.exports = checklogin;