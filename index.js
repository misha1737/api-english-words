require('dotenv').config();
let express = require("express");
let app = express();
let server = require("http").createServer(app);
var cors = require("cors");
const routes = require("./routes");
//sesions
server.listen(process.env.PORT || 5000, ()=> {
    console.log(`listening on *http://localhost:${process.env.PORT}`);
  });
const bodyParser = require("body-parser");
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type: 'application/json'}));
//routes  
app.post("/api/auth", routes.authorization);
app.post("/api/registration", routes.registration); 
