const express = require('express');
const app = express();

var server = app.listen(80, function () {
    console.log("Server started :80");
})

app.get('/file', function (req, res) {
    res.send(fileData[decodeURI(req._parsedUrl.query)] == undefined ? "Cannot GET" : fileData[decodeURI(req._parsedUrl.query)]);
})

app.use(express.static('Site'));


require('./js/Socket')(server);