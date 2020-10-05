const app = require('./app');
const ch = require('chalk')
const js = require("jsome")
const say = require("yosay")

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(say("Node-Fire By FajarTheGGman"))

  js({
    Coder: "<Fajar Firdaus>",
    Github: "<FajarTheGGman>",
    Instagram: "<FajarTheGGman>"
  })

  console.log(ch.bgGreen(`\n[!] Server Running at ${port}`))
});

