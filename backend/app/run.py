import sys
import os
import uvicorn
from dotenv import load_dotenv

load_dotenv()

# Add the parent directory of 'app' to the PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)