const userInput = document.getElementById("userLocation"),
    converter = document.getElementById("converter"),
    weatherIcon = document.querySelector(".weather-icon"),
    temperature = document.querySelector(".temperature"),
    feelsLike = document.querySelector(".feels-like"),
    description = document.querySelector(".description"),
    date = document.querySelector(".date"),
    city = document.querySelector(".city"),
    hVValue = document.getElementById("hValue"),
    wValue = document.getElementById("wValue"),
    sRValue = document.getElementById("sRValue"),
    sSValue = document.getElementById("sSValue"),
    cValue = document.getElementById("cValue"),
    sLValue = document.getElementById("sLValue"),
    pValue = document.getElementById("pValue"),
    forecast = document.querySelector(".forecast");

Weather_API_Endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=23.7644025&lon=90.389015&units=metric&appid=eca73db0966d1b4f704cebf91c07ee75&q=`;
Weather_Data_Endpoint = `https://api.openweathermap.org/data/2.5/forecast?lat=40.7127281&lon=-74.0060152&units=metric&appid=eca73db0966d1b4f704cebf91c07ee75&`

function findUserLocation() {
    forecast.innerHTML = "";
    fetch(Weather_API_Endpoint + userInput.value)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.cod != "" && data.cod != 200) {
                alert("Opps! The city you entered was not found. Please check the spelling or try another location");
                return;
            }

            weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;

            temperature.innerHTML = tempConverter(data.main.temp);

            feelsLike.innerHTML = "Feels Like : " + tempConverter(data.main.feels_like);

            description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;` + data.weather[0].description;

            const options = {
                weekday: "long",
                month: "long",
                dat: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            };

            date.innerHTML = getLongFormatDateTime(data.dt, data.timezone, options);

            city.innerHTML = data.name + ", " + data.sys.country;

            cValue.innerHTML = Math.round(data.clouds.all) + "<span>%</span>";
            hValue.innerHTML = Math.round(data.main.humidity) + "<span>%</span>";
            pValue.innerHTML = Math.round(data.main.pressure) + "<span>hPa</span>";
            sLValue.innerHTML = data.main.sea_level + "<span>hPa</span>";
            sRValue.innerHTML = getLongFormatDateTime(data.sys.sunrise, data.timezone, options1);
            sSValue.innerHTML = getLongFormatDateTime(data.sys.sunset, data.timezone, options1);
            wValue.innerHTML = Math.round(data.wind.speed) + "<span>m/s</span>";

            fetch(Weather_Data_Endpoint + `lon=${data.coord.lon}&lat=${data.coord.lat}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data.list);

                    data.list.forEach(weather => {
                        let div = document.createElement("div");

                        const options = {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        };

                        let daily = getLongFormatDateTime(weather.dt, 0, options).split(",");
                        div.innerHTML = daily[0];
                        div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">`;
                        div.innerHTML += `<p class="forecast-desc">${weather.weather[0].description}</p>`;
                        div.innerHTML += `<span><span>${tempConverter(weather.main.temp_min)}
                        </span&nbsp;&nbsp;><span>${tempConverter(weather.main.temp_max)}</span></span>`;
                        forecast.append(div);
                    });
                });
        })

}

const options1 = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
};

function formatUnixTime(dtValue, offSet, options = {}) {
    const date = new Date((dtValue + offSet) * 1000);
    return date.toLocaleTimeString("en-US", { timeZone: "UTC", ...options });
}

function getLongFormatDateTime(dtValue, offSet, options) {
    return formatUnixTime(dtValue, offSet, options);
}

function tempConverter(temp) {
    let tempValue = Math.round(temp);
    let message = "";
    if (converter.value == "°C") {
        message = tempValue + "<span>" + "\xB0C</span>";
    } else {
        let ctof = (tempValue * 9) / 5 + 32;
        message = ctof + "<span>" + "\xB0F</span>";
    }
    return message;

}



