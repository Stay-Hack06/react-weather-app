import { useState, useEffect } from 'react';
import './App.css';
import landingImage from './assets/weather-app-landing.jpeg';
import mainImage from './assets/weather-app-main.jpeg';

function App() {
  const [userLocation, setUserLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [showWeather, setShowWeather] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(landingImage);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=a723218da53a464d8cf182437232609&q=${userLocation}&days=4`);
      const data = await response.json();

      if (data.error) {
        alert(data.error.message);
        return;
      }

      setWeatherData(data);
      setShowWeather(true);
      setBackgroundImage(mainImage);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(`${dateString}T00:00:00Z`);
    const options = { weekday: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${backgroundImage})`;
  }, [backgroundImage]);

  return (
    <div className="App">
      <div className="header-container flex-center">
        <h1>Local Weather Report</h1>
        <input
          type="text"
          placeholder="Enter City, State or zip"
          value={userLocation}
          onChange={(e) => setUserLocation(e.target.value)}
          id="inputLocationBox"
        />
        <button id="searchButton" onClick={fetchWeatherData}>Search</button>
      </div>

      {showWeather && weatherData && (
        <>
          <div className="todays-weather-container flex-center">
            <div className="todays-weather">
              <h2>Today&apos;s Weather</h2>
              <div className="location-wrapper">
                <p>{weatherData.location.name}, {weatherData.location.region}, {weatherData.location.country}</p>
              </div>
              <div>
                <div className="current-temp">
                  <h1>{Math.round(weatherData.current.temp_f)}°F</h1>
                </div>
                <p>Today&apos;s High: {Math.round(weatherData.forecast.forecastday[0].day.maxtemp_f)}°F</p>
                <p>Today&apos;s Low: {Math.round(weatherData.forecast.forecastday[0].day.mintemp_f)}°F</p>
                <p>Chance of Rain: {weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
              </div>
            </div>
            <div className="temp-type-container">
              <h3>{Math.round(weatherData.current.temp_f) > 80 ? "Yuck! It's Hot Today!" : Math.round(weatherData.current.temp_f) < 40 ? "Hurray! It's Cold Today!" : "The Weather is Basic AF!"}</h3>
            </div>
          </div>

          <div className="forecast-header-container flex-center">
            <h2>Three Day Forecast</h2>
            <div className="three-day-weather-info">
              {weatherData.forecast.forecastday.slice(1, 4).map((forecast, index) => (
                <div key={index} className="forecast-box">
                  <h3>{getDayOfWeek(forecast.date)}</h3>
                  <h1>{Math.round(forecast.day.avgtemp_f)}°F</h1>
                  <p>High Temp: {Math.round(forecast.day.maxtemp_f)}°F</p>
                  <p>Low Temp: {Math.round(forecast.day.mintemp_f)}°F</p>
                  <p>Chance of Rain: {forecast.day.daily_chance_of_rain}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hottest-day-container flex-center">
            <h2 id="hottest-day-info">The Hottest day this week is {getDayOfWeek(weatherData.forecast.forecastday.reduce((prev, curr) => (curr.day.maxtemp_f > prev.day.maxtemp_f ? curr : prev)).date)}</h2>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
