🏠 StayScope – NYC Airbnb Room Type Predictor

StayScope is a Machine Learning-based web application that predicts the room type of an Airbnb listing in New York City based on property and listing details.

🚀 Features

* Predicts Airbnb room types using a trained ML model.
* Supports Entire Home/Apt, Private Room, and Shared Room.
* FastAPI-powered prediction API.
* Simple and interactive web interface.
* Displays prediction probabilities.

🛠️ Tech Stack

* Python
* Machine Learning
* Scikit-learn
* FastAPI
* HTML
* CSS
* JavaScript

📂 Project Structure

* nyc.py – FastAPI backend
* Model_Pipeline.pkl – Trained ML model
* requirements.txt – Python dependencies
* index.html – Frontend structure
* style.css – Website styling
* script.js – Frontend functionality

▶️ How to Run

1. Clone the repository

git clone https://github.com/samridh023/NYC-Air-BNB-.git
cd NYC-Air-BNB-

2. Install dependencies

pip install -r requirements.txt

3. Start the API

python -m uvicorn nyc:app --reload

4. Open the application

Open index.html in your browser.

API documentation:
http://127.0.0.1:8000/docs

🎯 Prediction Categories

* Entire home/apt
* Private room
* Shared room

👨‍💻 Author

Samridh Gupta

GitHub: https://github.com/samridh023
