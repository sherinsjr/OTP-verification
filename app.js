const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDatabase = require("./config/database");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//config
dotenv.config({path:"config/.env"});

//Connecting to the database
connectDatabase()

const user = require("./routes/userRoutes");
app.use("/api/v1",user)




let port = process.env.PORT

 app.listen(port,() => {
    console.log(`Server is working on http://localhost:${port}`);
  });