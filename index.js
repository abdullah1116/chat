const express = require('express');
const app = express();
var server,
  serverStatus = false;

const serverStart = () => {
  if (!serverStatus) {
    server = app.listen(80, function () {
      console.log('Server started :80');
    });
    serverStatus = true;
  }
};
serverStart();

// const serverStop = () => {
//     if (serverStatus){
//         server.close();
//         serverStatus = false;
//     }
// }

app.get('/file', (req, res) => {
  res.send(
    fileData[decodeURI(req._parsedUrl.query)] == undefined
      ? 'Cannot GET'
      : fileData[decodeURI(req._parsedUrl.query)]
  );
});

app.use(express.static('Site'));

require('./js/Socket')(server);
// require('./js/electron')(serverStart, serverStop);
