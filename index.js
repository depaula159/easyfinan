// Express

const express = require("express");
const app = express();

// CORS

const cors = require("cors")
app.use(cors())

// dotEnv

require('dotenv').config()

// Body Parser

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Mongoose

const mongoose = require("mongoose");

mongoose
  .connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Banco conectado com sucesso!");
  })
  .catch((err) => {
    console.log(
      "Houve um erro ao se conectar com o banco de dados" + " / " + err
    );
  });

// Schema Mongo DB - Admin User

const adminSchema = mongoose.Schema({
  user: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const adminUser = mongoose.model("admin", adminSchema);

// Schema Mongo DB - New Article

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  url: {
    type: String,
    require: true,
  },
});

const article = mongoose.model("articles", articleSchema);

// Save article MongoDB

app.post("/send-article", (req, res) => {
  let newArticle = new article({
    title: req.body.title,
    description: req.body.description,
    url: req.body.url
  })
  newArticle.save()
  res.redirect("/")
});

// login

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

// Authenticate user/admin

app.post("/blog-auth", (req, res) => {
  let username = req.body.user;
  let password = req.body.password;
  adminUser.findOne({ user: username, password: password }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    if (!user) {
      return res.status(404).send();
    }
    return res.status(200).sendFile(__dirname + "/views/blogCreator.html");
  });
});

app.get("/all-articles", (req, res)=>{
  article.find({}).then((art)=>{
    return res.json(art)
  }).catch((err) => {
    console.log(err)
  })
})

// Server

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor rodando na porta" + ":" + "3000");
});
