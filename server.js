const express = require("express");

const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const app = express();
const http = require("http");
const server = http.createServer(app);
bodyParser = require("body-parser");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

var mysql = require("mysql");
const { resourceLimits } = require("worker_threads");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "apidata",
});

function hash(data) {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  app.post("/monkeys", (req, res) => {
    let authHeader = req.headers["authorization"];

    if (authHeader == undefined) {
    }

    let token = authHeader.slice(7);

    let decoded;
    try {
      decoded = jwt.verify(token, "secret");
    } catch (err) {
      console.log(err);
      res.status(401).send("invalid auth token");
    }

    if (req.body.monkey) {
      con.query(
        `
        INSERT INTO data ( monkey, habitat, diet, behaviour)
        
        VALUES ( '${req.body.monkey}', '${req.body.habitat}', '${req.body.diet}', '${req.body.behaviour}')
        `,
        function (err, result, fields) {
          if (err) throw err;
          res.send(result);
        }
      );
    }
  });

  app.put("/monkeys/:id", (req, res) => {
    let authHeader = req.headers["authorization"];

    if (authHeader == undefined) {
    }

    let token = authHeader.slice(7);

    let decoded;
    try {
      decoded = jwt.verify(token, "secret");
    } catch (err) {
      console.log(err);
      res.status(401).send("invalid auth token");
    }

    con.query(
      `
    UPDATE data 
    SET monkey = '${req.body.monkey}', 
    habitat = '${req.body.habitat}',
    diet = '${req.body.diet}',
    behaviour = '${req.body.behaviour}'

    WHERE id = ${req.params.id}
    `,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });

  app.get("/monkeys", (req, res) => {
    let authHeader = req.headers["authorization"];

    if (authHeader == undefined) {
    }

    let token = authHeader.slice(7);

    let decoded;
    try {
      decoded = jwt.verify(token, "secret");
    } catch (err) {
      console.log(err);
      res.status(401).send("invalid auth token");
    }

    con.query("SELECT * FROM data", function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  });

  app.get("/monkeys/:id", (req, res) => {
    let authHeader = req.headers["authorization"];

    if (authHeader == undefined) {
    }

    let token = authHeader.slice(7);

    let decoded;
    try {
      decoded = jwt.verify(token, "secret");
    } catch (err) {
      console.log(err);
      res.status(401).send("invalid auth token");
    }

    con.query(
      `SELECT * FROM data WHERE id = ${req.params.id}`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      }
    );
  });

  app.get("/monkeys/:id/habitat", (req, res) => {
    let authHeader = req.headers["authorization"];

    if (authHeader == undefined) {
    }

    let token = authHeader.slice(7);

    let decoded;
    try {
      decoded = jwt.verify(token, "secret");
    } catch (err) {
      console.log(err);
      res.status(401).send("invalid auth token");
    }

    con.query(
      `SELECT * FROM data WHERE id = ${req.params.id}`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result[0].habitat);
      }
    );
  });

  app.get("/monkeys/:id/diet", (req, res) => {
    let authHeader = req.headers["authorization"];

    if (authHeader == undefined) {
    }

    let token = authHeader.slice(7);

    let decoded;
    try {
      decoded = jwt.verify(token, "secret");
    } catch (err) {
      console.log(err);
      res.status(401).send("invalid auth token");
    }

    con.query(
      `SELECT * FROM data WHERE id = ${req.params.id}`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result[0].diet);
      }
    );
  });

  app.get("/monkeys/:id/behaviour", (req, res) => {
    let authHeader = req.headers["authorization"];

    if (authHeader == undefined) {
    }

    let token = authHeader.slice(7);

    let decoded;
    try {
      decoded = jwt.verify(token, "secret");
    } catch (err) {
      console.log(err);
      res.status(401).send("invalid auth token");
    }

    con.query(
      `SELECT * FROM data WHERE id = ${req.params.id}`,
      function (err, result, fields) {
        if (err) throw err;
        res.send(result[0].behaviour);
      }
    );
  });

  app.post("/login", (req, res) => {
    uname = req.body.username;
    pword = req.body.password;

    if (uname && pword) {
      con.query(
        `
        SELECT * FROM users
        `,
        function (err, result, fields) {
          if (err) throw err;
          for (let i = 0; i < result.length; i++) {
            const user = result[i];
            if (uname == user.username && hash(pword) == user.password) {
              let payload = {
                exp: Math.floor(Date.now() / 1000) + 60 * 30,
                sub: user.userID,
                name: user.username,
              };

              let token = jwt.sign(payload, "secret");
              console.log(token);
              res.send("Login successful \n" + token);
              return;
            }
          }
          res.status(401).send("Login Failed");
        }
      );
    }
  });

  app.post("/signup", (req, res) => {
    if (req.body.username && req.body.password) {
      con.query(
        `
      INSERT INTO users (username, password)
      
      VALUES ('${req.body.username}', '${hash(req.body.password)}')
      `,
        function (err, result, fields) {
          if (err) throw err;
          res.json(result);
          console.log(result);
        }
      );
    } else {
      console.log("Error : Must enter both password and username");
    }
  });

  server.listen(3000, () => {
    console.log("Listening on *:3000");
  });
});
