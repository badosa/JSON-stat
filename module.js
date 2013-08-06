var fs = require("fs");

module.exports = new Function("jsonstat", "return " + fs.readFileSync(__dirname + "/json-stat.js", "utf8"))();