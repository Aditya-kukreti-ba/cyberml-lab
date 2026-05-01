# CyberML Lab — Backend

FastAPI ML pipeline for the CyberML Lab.

## Quick Start

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/upload | Upload a CSV file |
| GET | /api/datasets/default | List built-in datasets |
| GET | /api/datasets/default/{name} | Load a built-in dataset |
| GET | /api/dataset/columns | Get column metadata |
| POST | /api/preprocess | Preview preprocessing result |
| POST | /api/train | Train a single model |
| POST | /api/compare | Train and compare multiple models |
