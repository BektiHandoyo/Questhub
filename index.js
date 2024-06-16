const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const db = require('./config/Database.js');
const models = require('./models/autoload.js');
const {pageRouter} = require('./routes/webpage.js');
const {authRouter} = require('./routes/auth.js');
const {uploadRoute} = require('./routes/upload.js');
const { roomRouter } = require('./routes/room.js');

dotenv.config();
const port = process.env.PORT || 5000;

const app = express()


async function main(){
     
    try {
        await db.authenticate()
        for(let model of models){
            await model.sync();
        }
    } catch (error) {
        console.log(error);
    }

    app.use(express.json());
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/public'))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({
        secret : process.env.REFRESH_TOKEN_SECRET,
        resave : false,
        saveUninitialized : true,
        cookie : {
            secure : 'auto', 
            maxAge :  (1000 * 60 * 60 * 24),
        },
    }))
    app.use(flash());
    app.use(pageRouter);
    app.use(authRouter);
    app.use(uploadRoute);
    app.use(roomRouter);
 
    app.listen(port, () => {
        console.log(`Server Running on http://localhost:${port}`);
    })
}

main()