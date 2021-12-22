const connectToMongo = require('./db');
var cors = require('cors')

const express = require('express')

connectToMongo();
const app = express()
const port = 5000

app.use(cors())

app.use(express.json());
// available routes

app.use('/api/auth', require('./routes/auth'))
app.use('/api/jobs', require('./routes/jobs'))


app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})