import os
import requests

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

def get_weather(lat: float, lon: float):
    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    res = requests.get(url, params=params, timeout=10)
    res.raise_for_status()
    data = res.json()

    return {
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "condition": data["weather"][0]["main"]
    }
