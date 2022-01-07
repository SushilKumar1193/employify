const connectToMongo = require('./db');
var cors = require('cors')
const path = require('path')
const express = require('express')

connectToMongo();
const app = express()
const port = process.env.PORT ||5000

app.use(cors())

app.use(express.json());
// available routes
app.use(express.static(path.resolve(__dirname,'../build')));

app.use('/api/auth', require('./routes/auth'))
app.use('/api/jobs', require('./routes/jobs'))

app.get('*',(req,res)=>{
	res.sendFile(path.resolve(__dirname,'../build','index.html'));
})

if(process.env.NODE_ENV=="production"){
  app.use(express.static("../build"))
}

app.listen(port, () => {
  console.log(`Jobify backend listening at http://localhost:${port}`)
})