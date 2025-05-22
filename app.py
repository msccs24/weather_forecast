from flask import Flask, render_template, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = "dc37633d41cc5449569dd44893a9c0de"
CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/weather", methods=["GET"])
def get_weather():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City is required"}), 400

    current_response = requests.get(CURRENT_URL, params={"q": city, "appid": API_KEY, "units": "metric"})
    forecast_response = requests.get(FORECAST_URL, params={"q": city, "appid": API_KEY, "units": "metric"})

    if current_response.status_code != 200 or forecast_response.status_code != 200:
        return jsonify({"error": "City not found"}), 404

    return jsonify({
        "current": current_response.json(),
        "forecast": forecast_response.json()
    })


if __name__ == "__main__":
    app.run(debug=True)
