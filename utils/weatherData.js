const request =require('request');
const constants =  require('../config');

const weatherData = (address,callback)=>{
    const url = constants.openWeatherMap.BASE_URL +encodeURIComponent(address)+'&appid='+constants.openWeatherMap.SECRET_KEY;
    //console.log(url);
    request({url,json:true},(err,{body})=>{
        console.log(body);
        if(err){
            callback("cant fetch data from open weather map api", Undefined);
        }else if(!body.main || !body.main.temp || !body.name || !body.weather){
            callback("Unable to find require data, try another loction", undefined);
        }
        
        else{
            callback(undefined,{
                temperature:body.main.temp,
                description:body.weather[0].description,
                cityName:body.name 
            })
        }
    });
}
module.exports = weatherData;