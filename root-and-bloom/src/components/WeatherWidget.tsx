import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Droplets, Thermometer, ShieldAlert, Sparkles, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getWeatherData, RealWeatherData } from '../services/weatherService';

const AVAILABLE_CITIES = ['Bengaluru', 'Mumbai', 'New Delhi', 'Hyderabad', 'Pune', 'Chennai'];

export const WeatherWidget: React.FC = () => {
  const { setPage } = useApp();
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const [weatherData, setWeatherData] = useState<RealWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchWeather = async (city: string) => {
    setIsLoading(true);
    const data = await getWeatherData(city);
    setWeatherData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DFD8CB] shadow-sm relative overflow-hidden">
      {/* Decorative botanical backdrop accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EBF3ED] rounded-full blur-3xl -z-10 pointer-events-none opacity-60" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D6]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5EFE7] text-[#1A3828] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2A5C43]" />
            <span>Smart Garden • Weather Intelligence</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#142E20]">
            Weather-Based Garden Care
          </h3>
          <p className="text-xs sm:text-sm text-[#5C7265] mt-1">
            Real-time microclimate diagnosis and customized plant maintenance guidelines.
          </p>
        </div>

        {/* City Switcher */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#2A5C43] shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {AVAILABLE_CITIES.map((cityName) => (
              <button
                key={cityName}
                onClick={() => setSelectedCity(cityName)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                  selectedCity === cityName
                    ? 'bg-[#1A3828] text-white shadow-sm'
                    : 'bg-[#F2ECE1] text-[#344D3F] hover:bg-[#E3DCCF]'
                }`}
              >
                {cityName}
              </button>
            ))}
            <button
              onClick={() => fetchWeather(selectedCity)}
              title="Refresh weather data"
              className="p-1.5 rounded-xl bg-[#F2ECE1] hover:bg-[#E3DCCF] text-[#2A5C43] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
          <RefreshCw className="w-6 h-6 text-[#2A5C43] animate-spin" />
          <span className="text-xs text-[#526D5E]">Querying atmospheric microclimate data for {selectedCity}...</span>
        </div>
      ) : !weatherData?.available ? (
        /* Graceful fallback when weather data is unavailable */
        <div className="my-6 bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8E1D4] text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#F3ECE1] text-[#A66E38] flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#142E20]">
              Weather data is temporarily unavailable
            </h4>
            <p className="text-xs text-[#637A6D] max-w-md mx-auto mt-1 leading-relaxed">
              {weatherData?.errorMessage ||
                'Configure VITE_OPENWEATHER_API_KEY in your environment to stream live city temperature, humidity, and rainfall predictions.'}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setPage('plant-ai')}
              className="px-4 py-2 rounded-xl bg-[#1A3828] text-white text-xs font-semibold hover:bg-[#122A1E] transition-colors"
            >
              Ask Plant Doctor AI for Seasonal Care
            </button>
          </div>
        </div>
      ) : (
        /* Real Weather View */
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D4]">
              <div className="flex items-center gap-2 text-[#567061] text-xs font-medium">
                <Thermometer className="w-4 h-4 text-[#D27D46]" />
                <span>Temperature</span>
              </div>
              <div className="text-2xl font-serif font-bold text-[#163323] mt-1">
                {weatherData.temp}°C
              </div>
              <span className="text-[11px] text-[#71887B]">
                Feels like {weatherData.feelsLike}°C • {weatherData.condition}
              </span>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D4]">
              <div className="flex items-center gap-2 text-[#567061] text-xs font-medium">
                <Droplets className="w-4 h-4 text-[#4A90E2]" />
                <span>Humidity</span>
              </div>
              <div className="text-2xl font-serif font-bold text-[#163323] mt-1">
                {weatherData.humidity}%
              </div>
              <span className="text-[11px] text-[#71887B]">
                {weatherData.humidity! > 70 ? 'High moisture' : 'Moderate ambient moisture'}
              </span>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D4]">
              <div className="flex items-center gap-2 text-[#567061] text-xs font-medium">
                <CloudRain className="w-4 h-4 text-[#3B7A57]" />
                <span>Precipitation</span>
              </div>
              <div className="text-2xl font-serif font-bold text-[#163323] mt-1">
                {weatherData.rainMm ? `${weatherData.rainMm} mm` : '0 mm'}
              </div>
              <span className="text-[11px] text-[#71887B] truncate block">
                {weatherData.rainForecast}
              </span>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E1D4]">
              <div className="flex items-center gap-2 text-[#567061] text-xs font-medium">
                <Wind className="w-4 h-4 text-[#688274]" />
                <span>Wind Speed</span>
              </div>
              <div className="text-2xl font-serif font-bold text-[#163323] mt-1">
                {weatherData.windSpeed} km/h
              </div>
              <span className="text-[11px] text-[#71887B]">
                {weatherData.windSpeed! > 18 ? 'Breezy conditions' : 'Gentle breeze'}
              </span>
            </div>
          </div>

          {/* Dynamic Actionable Recommendations */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E3DCCF]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F412E] mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#2A5C43]" />
              <span>Horticulturist Advice for {weatherData.city} Today:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(weatherData.recommendations || []).map((rec, i) => (
                <div
                  key={i}
                  className="bg-white p-3.5 rounded-xl border border-[#DFD8CA] text-xs text-[#2A4234] leading-relaxed flex items-start gap-2 shadow-2xs"
                >
                  <div className="mt-0.5 shrink-0 text-sm">💡</div>
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

