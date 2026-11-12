# StayScope — NYC Airbnb Room Type Predictor

## Files required
Keep these files together in one folder:

- `nyc.py` — FastAPI backend
- `Model_Pipeline.pkl` — trained scikit-learn pipeline (required)
- `requirements.txt` — Python dependencies
- `index.html`, `style.css`, `script.js` — frontend

## Windows quick start
1. Install Python 3.10–3.13 from https://www.python.org/downloads/ (enable **Add Python to PATH**).
2. Extract this project ZIP.
3. Double-click `run_windows.bat`. The first run creates a virtual environment and installs packages; this can take a few minutes.
4. Keep the terminal window open while using the app.
5. Open `http://127.0.0.1:8000/docs`. If the FastAPI page appears, the backend is running.
6. Open `index.html` in the same computer's browser. Keep the API URL at `http://127.0.0.1:8000` and press **Test**; the status indicator should turn green.

## macOS / Linux quick start
Open Terminal in the extracted folder and run:

```bash
chmod +x run_mac_linux.sh
./run_mac_linux.sh
```

Then open `http://127.0.0.1:8000/docs` and open `index.html` in a browser on the same computer.

## Manual start
```bash
python -m venv venv
# Windows: venv\\Scripts\\activate
# macOS/Linux: source venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn nyc:app --reload --host 127.0.0.1 --port 8000
```

## Troubleshooting
- **`ModuleNotFoundError`**: activate the virtual environment and run `python -m pip install -r requirements.txt` again.
- **Model file not found**: place `Model_Pipeline.pkl` in the same folder as `nyc.py`.
- **Scikit-learn version warning/error**: the model was serialized with scikit-learn 1.9.1; use the pinned version in `requirements.txt`. Do not casually change this version because serialized models can be version-sensitive.
- **API connection failed / Not available**: keep the backend terminal open; confirm `/docs` works; use the same computer for the frontend and backend. `127.0.0.1` on an iPhone refers to the iPhone itself, not your laptop.
- **Port 8000 already in use**: stop the other server or run `python -m uvicorn nyc:app --reload --host 127.0.0.1 --port 8001` and change the frontend API URL to `http://127.0.0.1:8001`.

This setup runs locally. It does not publish the project to the internet; public deployment needs a hosting account and deployment configuration.
