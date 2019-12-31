window.addEventListener('load',()=>{

    let long;
    let lat;

// allow to take latitude,longitude from the users
    if(navigator.geolocation)
    {
       navigator.geolocation.getCurrentPosition(position =>{
            long = position.coords.longitude;
            lat = position.coords.latitude;
            //alert(long,lat);
            const proxy = "https://cors-anywhere.herokuapp.com/";
            const API = `${proxy}https://api.darksky.net/forecast/5809d268796879c31c34c9b3a6270d0a/${lat},${long}`;
           resultFetch(API);
       });
    }
    else
    {
        alert('Your Location Permission is not enabled!');
    }



// current weather details

    function weatherToday(timezone,temperature,icon,summary,windSpeed,time,humidity,pressure,hourly_update,item){


            timeLocation =document.querySelector('.location-and-date__location');
            currentTemperature = document.querySelector('.current-temperature__value');
            currentIcons = document.querySelector('.current-temperature__icon');
            currentSummery = document.querySelector('.current-temperature__summary');
            currentWindSpeed = document.querySelector('.current-Wind_value');
            currentTime = document.querySelector('.location-time');
            currentPressure = document.querySelector('.current_Pressure');
            currentHumidity = document.querySelector('.current_Humidity');
            currentUpdateText = document.getElementById('today_update_text');
            
            
            
            //console.log(currentHumidity);

        if(item===null)
        {
            timeLocation.textContent = timezone;
            currentTemperature.textContent = temperature;
            currentSummery.textContent = summary;
            currentWindSpeed.textContent = windSpeed;
            currentTime.textContent = time;
            currentHumidity.textContent = humidity+'%';
            currentPressure.textContent = pressure;
            currentUpdateText.textContent = hourly_update;
            setIcon(currentIcons,icon);
        }
        else
        {
            timeLocation.textContent = timezone;
            currentTemperature.textContent = temperature;
            currentSummery.textContent = summary;
            currentWindSpeed.textContent = windSpeed;
            currentTime.textContent = time;
            currentHumidity.textContent = humidity+'%';
            currentPressure.textContent = pressure;
            currentUpdateText.textContent = hourly_update;
            setIcon(currentIcons,icon);
        }

    }
// current weather icon setup

    function setIcon(iconID, icon)
    {
        const skycons = new Skycons({color: "white"});
        const currentIcon = icon.replace(/-/g,"_").toUpperCase();
        skycons.play();
        return skycons.set(iconID,Skycons[currentIcon]);
    }


   //API call and find the actuall weather from dark sky web  
function resultFetch(API)
{
    var selection = document.querySelector('.mdb-select');
   fetch(API)
   .then(Response =>{
      return Response.json(); 
   })
   .then(data=>{
       console.log(data);
       const{humidity,temperature,icon,pressure,summary,windSpeed,time}= data.currently;
       const timezone = data.timezone;
       const date = new Date(time*1000);
       //console.log(humidity+' '+pressure);
       var item = null;
       
        selection.addEventListener("click",tempChange,false);
        var temperature1 = temperature;
        function tempChange(e)
        {
           var value = e.target.value;
           var count = 0;
           console.log(value);
           if(value ==="celsius" && count===0)
           {
              temperature1 = cToF(temperature1);
              console.log(temperature1);
              count=1;
           }
           else if(value ==="fahrenheit" && count===1)
           {

               temperature1 = fToC(temperature1);
               count=0;
               
           }
           
        }

        console.log(temperature1);

      

       var hourly_update = liveHourlyWeatherUpdate(data.hourly);
       weatherToday(timezone,temperature1,icon,summary,windSpeed,date,humidity*100,pressure,hourly_update,item);
       whenClickedOnItem(data);
       var nextDaysWeathers=weatherNextDays(data.daily.data);   
      
   })
}





// hourly updates summery which is marquee over the websites
function liveHourlyWeatherUpdate(data)
{
     const{summary} = data;
     return summary;
}


// next week weather details

function weatherNextDays(data)
{
    var daily_data = new Array();

    console.log(data.length);
    for(var i=0;i<data.length;i++)
    {
       const{icon,humidity,pressure,summary,sunriseTime,sunsetTime,temperatureHigh,temperatureLow,time,windSpeed} = data[i];

       //console.log(data[i])
       var data_object = new Object();
       data_object.c_icon = icon;
       data_object.c_humidity = humidity;
       data_object.c_pressure = pressure;
       data_object.c_summary = summary;
       data_object.c_sunriseTime = sunriseTime;
       data_object.c_sunsetTime = sunsetTime;
       data_object.c_temperatureHigh = temperatureHigh;
       data_object.c_temperatureLow = temperatureLow;
       data_object.c_time = time;
       data_object.c_windSpeed = windSpeed;
       daily_data.push(data_object);

       //data_object.length =0;
       //console.log(daily_data);
    }
    //console.log(daily_data);
    

    whenItemNotClick(daily_data);
   // whenClickedOnItem(daily_data)

    

   // console.log(daily_data)
    return daily_data;

/*data.forEach(function(c_data) {
    console.log(c_data);
});*/

}


//when click on each item

function whenClickedOnItem(data)
{
    //var parrentNode = document.querySelector('.weather-by-hour');

    var item1 = document.getElementById('1');
    var item2 = document.getElementById('2');
    var item3 = document.getElementById('3');
    var item4 = document.getElementById('4');
    var item5 = document.getElementById('5');
    var item6 = document.getElementById('6');
    var item7 = document.getElementById('7');
    var item8 = document.getElementById('8');

    //console.log(item7);
    //console.log(item1.id+' '+item2+' '+item3+' '+item4+' '+item5+' '+item6+' '+item7+' '+item8);

    item1.addEventListener("click",findData,false);
    item2.addEventListener("click",findData,false);
    item3.addEventListener("click",findData,false);
    item4.addEventListener("click",findData,false);
    item5.addEventListener("click",findData,false);
    item6.addEventListener("click",findData,false);
    item7.addEventListener("click",findData,false);
    item8.addEventListener("click",findData,false);
    

    function findData(e)
    {
        var id = e.target.id;
        console.log(id);

        console.log(data.daily.data[id]);
        const{humidity,apparentTemperatureHigh,icon,pressure,summary,windSpeed,time}= data.daily.data[id-1];
        const timezone = data.timezone;
        const date = new Date(time*1000);
        var hourly_update = liveHourlyWeatherUpdate(data.hourly);
        weatherToday(timezone,apparentTemperatureHigh,icon,summary,windSpeed,date,humidity*100,pressure,hourly_update,id);


    }
    
   
    
}



// each and every item shows when item is not clicked
function whenItemNotClick(daily_data_not_click)
{

   
   // console.log(daily_data_not_click);
   d_time1 = document.querySelector('.weather-by-hour__item1');
   d_icon1 = document.querySelector('.icon_item1');
   d_temp1 = document.querySelector('.temp_item1');
   
   var temp = fToC(daily_data_not_click[0].c_temperatureHigh);
   console.log(temp);

   d_time1.textContent = daily_data_not_click[0].c_humidity*100+"%";
   setIcon(d_icon1,daily_data_not_click[0].c_icon);
   d_temp1.textContent = daily_data_not_click[0].c_temperatureHigh;
   //console.log(daily_data_not_click[0].c_temperatureHigh);

   d_time2 = document.querySelector('.weather-by-hour__item2');
   d_icon2 = document.querySelector('.icon_item2');
   d_temp2 = document.querySelector('.temp_item2');

   d_time2.textContent =  daily_data_not_click[1].c_humidity*100+"%";
   setIcon(d_icon2,daily_data_not_click[1].c_icon);
   d_temp2.textContent = daily_data_not_click[1].c_temperatureHigh;

   d_time3 = document.querySelector('.weather-by-hour__item3');
   d_icon3 = document.querySelector('.icon_item3');
   d_temp3 = document.querySelector('.temp_item3');

   d_time3.textContent =  daily_data_not_click[2].c_humidity*100+"%";
   setIcon(d_icon3,daily_data_not_click[2].c_icon);
   d_temp3.textContent = daily_data_not_click[2].c_temperatureHigh;

   d_time4 = document.querySelector('.weather-by-hour__item4');
   d_icon4 = document.querySelector('.icon_item4');
   d_temp4 = document.querySelector('.temp_item4');

   d_time4.textContent =  daily_data_not_click[3].c_humidity*100+"%";
   setIcon(d_icon4,daily_data_not_click[3].c_icon);
   d_temp4.textContent = daily_data_not_click[3].c_temperatureHigh;

   d_time5 = document.querySelector('.weather-by-hour__item5');
   d_icon5 = document.querySelector('.icon_item5');
   d_temp5 = document.querySelector('.temp_item5');

   d_time5.textContent =  daily_data_not_click[4].c_humidity*100+"%";
   setIcon(d_icon5,daily_data_not_click[4].c_icon);
   d_temp5.textContent = daily_data_not_click[4].c_temperatureHigh;


   d_time6 = document.querySelector('.weather-by-hour__item6');
   d_icon6 = document.querySelector('.icon_item6');
   d_temp6 = document.querySelector('.temp_item6');

   d_time6.textContent =  daily_data_not_click[5].c_humidity*100+"%";
   setIcon(d_icon6,daily_data_not_click[5].c_icon);
   d_temp6.textContent = daily_data_not_click[5].c_temperatureHigh;

   d_time7 = document.querySelector('.weather-by-hour__item7');
   d_icon7 = document.querySelector('.icon_item7');
   d_temp7 = document.querySelector('.temp_item7');

   d_time7.textContent =  daily_data_not_click[6].c_humidity*100+"%";
   setIcon(d_icon7,daily_data_not_click[6].c_icon);
   d_temp7.textContent = daily_data_not_click[6].c_temperatureHigh;

   d_time8 = document.querySelector('.weather-by-hour__item8');
   d_icon8 = document.querySelector('.icon_item8');
   d_temp8 = document.querySelector('.temp_item8');

   d_time8.textContent =  daily_data_not_click[7].c_humidity*100+"%";
   setIcon(d_icon8,daily_data_not_click[7].c_icon);
   d_temp8.textContent = daily_data_not_click[7].c_temperatureHigh;


}


// time formating 

function setTime(time)
{
    var date = new Date(time*1000);
    var sub;

    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    months= ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    if(day===1)
    {
        sub = 'st';
    }
    else if (day===2) {
        sub = 'nd';
    }
    else if(day===3)
    {
        sub = 'rd';
    }
     else {
        sub = 'th';
    }
   console.log(date);
    console.log(days[day]+','+day+sub+' '+months[month]+' '+ year);
}

// hours find
function setHours(time)
{
    var times = new Date(time*1000);
    var hour = times.getHours();
    return hour;
}



// celsius to fahrenheit converting
function cToF(celsius) 
{
  var cTemp = celsius;
  var cToFahr = cTemp * 9 / 5 + 32;
  //var message = cTemp+'\xB0C is ' + cToFahr + ' \xB0F.';
    return cToFahr.toFixed(2);
}

// fahrenheit to celsius converting
function fToC(fahrenheit) 
{
  var fTemp = fahrenheit;
  var fToCel = (fTemp - 32) * 5 / 9;
  //var message = fTemp+'\xB0F is ' + fToCel + '\xB0C.';
    return fToCel.toFixed(2);
}


});