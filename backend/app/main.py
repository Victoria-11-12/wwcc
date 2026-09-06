from fastapi import FastAPI

app = FastAPI(title="网文查重 API", version="0.1.0")


@app.get("/")
def root():
    return {"message": "网文查重后端服务运行中"}


@app.get("/health")
def health():
    return {"status": "ok"}
