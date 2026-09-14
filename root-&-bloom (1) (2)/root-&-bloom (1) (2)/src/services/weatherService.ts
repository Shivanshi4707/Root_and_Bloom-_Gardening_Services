// Weather service abstraction for OpenWeather API integration

export interface RealWeatherData {
  available: boolean;
  city: string;
  temp?: number;
  feelsLike?: number;
  condition?: string;
  description?: string;
  humidity?: number;
  windSpeed?: number;
  rainMm?: number;
  rainForecast?: string;
  recommendations: string[];
  errorMessage?: string;
}

export const getWeatherData = async (city: string = 'Bengaluru'): Promise<RealWeatherData> => {
  const apiKey = (import.meta as any).env?.VITE_OPENWEATHER_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return {
      available: false,
      city,
      errorMessage: 'Weather data is temporarily unavailable. Configure VITE_OPENWEATHER_API_KEY to view real-time microclimate intelligence.',
      recommendations: [],
    };
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${encodeURIComponent(apiKey.trim())}`
    );

    if (!response.ok) {
      return {
        available: false,
        city,
        errorMessage: `Weather service error (${response.status}: ${response.statusText}). Weather data is temporarily unavailable.`,
        recommendations: [],
      };
    }

    const data = await response.json();
    const temp = Math.round(data.main?.temp ?? 25);
    const feelsLike = Math.round(data.main?.feels_like ?? temp);
    const humidity = data.main?.humidity ?? 60;
    const windSpeed = Math.round(data.wind?.speed ?? 0);
    const condition = data.weather?.[0]?.main ?? 'Clear';
    const description = data.weather?.[0]?.description ?? '';
    const rainMm = data.rain?.['1h'] ?? data.rain?.['3h'] ?? 0;

    let rainForecast = 'No significant rain detected';
    if (rainMm > 0 || condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle')) {
      rainForecast = 'Rain or drizzle observed in your area';
    }

    // Generate dynamic gardening recommendations strictly from live weather data
    const recs: string[] = [];
    if (rainMm > 0 || condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle')) {
      recs.push('🌧️ Rain detected today — postpone outdoor watering to prevent soil waterlogging and root rot.');
      recs.push('🍄 Check drainage holes in containers to ensure excess rainwater drains freely.');
    } else if (temp >= 32) {
      recs.push('🔥 High ambient temperature — water outdoor container plants deeply early morning before 8:30 AM.');
      recs.push('🪴 Shield sensitive foliage (such as ferns, calatheas, and peace lilies) from intense direct afternoon glare.');
    } else if (temp <= 18) {
      recs.push('❄️ Cool weather — ideal time for planting and repotting hardy outdoor varieties.');
      recs.push('💧 Lower evaporation rate — delay watering until the top two inches of soil feel dry.');
    } else {
      recs.push('🌿 Mild temperate conditions — excellent time for routine pruning, soil aerating, and organic compost feeding.');
    }

    if (humidity > 70) {
      recs.push('🌫️ High ambient humidity — inspect undersides of dense foliage for powdery mildew or fungal spores.');
    } else if (humidity < 40) {
      recs.push('🌵 Low humidity — mist tropical foliage with fresh water to prevent crisping leaf tips.');
    }

    if (windSpeed > 20) {
      recs.push('💨 Gusty winds detected — secure tall potted stems or stakes to prevent stem breakage.');
    }

    return {
      available: true,
      city: data.name || city,
      temp,
      feelsLike,
      condition,
      description,
      humidity,
      windSpeed,
      rainMm,
      rainForecast,
      recommendations: recs,
    };
  } catch (err: any) {
    return {
      available: false,
      city,
      errorMessage: 'Weather data is temporarily unavailable. Unable to reach weather service.',
      recommendations: [],
    };
  }
};
