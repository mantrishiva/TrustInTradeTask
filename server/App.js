
const express = require('express');
const route = require('./routes')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express();
require('./db')
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
const PORT = 8080;

app.use('/', route);


app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});