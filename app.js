const express = require('express');
const hbs= require('hbs');
const  path = require('path');
const app = express();

const weatherData = require('./utils/weatherData');
const port= process.env.PORT || 3000;

const publicStaticDirPath = path.join(__dirname,'./public');

app.use(express.static(publicStaticDirPath));

const viewPath = path.join(__dirname,'./templates/views');

const partialsPath = path.join(__dirname,'./templates/partials');

app.set("view engine", "hbs");
app.set('views', viewPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicStaticDirPath));

app.get('/', function(req, res){
    res.render('index',{ 
        title:"weather app",

    })
})

//localhost:3000/weather?address=london
app.get('/weather', function(req, res){
    const address = req.query.address;
    if(!address){
        return res.send({ error: "you must enter the address" });
    }

    weatherData(address , (error, {temperature,description,cityName}={})=>{
       // console.log(result);
       if(error){
           return res.send({ 
               error
        })
       }
       console.log(temperature,description,cityName);
       res.send({
           temperature,description,cityName
       })
    })

});

app.get('/google-calender', function (req, res) {
    res.render('calender');
})

//if route is not found then this rote will be called
app.get("*", function(req, res){
    
    //res.send("page not found");
    res.render('error', {
        title:"Page Not Found"
    })
})

app.listen(port,()=>{
    console.log("server is started at port:",port);
});
