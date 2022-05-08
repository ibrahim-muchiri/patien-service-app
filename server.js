const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./index');


// const service = require('./model/serviceModel');
// const patient = require('./model/PatientModel');


dotenv.config({path: './config.env'});

const DB = process.env.DATABASE_NAME.replace(
    '<PASSWORD>',
    process.env.PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify: false
}).then(()=> console.log('Database connected successfully...'))
.catch(err => console.log(err));


const port = process.env.PORT || 5000;
app.listen(port, '127.0.0.1', ()=>{
console.log(`server started at port ${port}...`);
});
