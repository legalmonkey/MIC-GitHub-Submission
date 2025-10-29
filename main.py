from fastapi import FastAPI, Request
from transformers import pipeline

app = FastAPI()
pipe = pipeline("text-to-speech", model="ai4bharat/indic-parler-tts")

@app.post("/tts")
async def tts(request: Request):
    data = await request.json()
    text = data.get("text")
    if not text:
        return {"error": "No input text provided"}
    result = pipe(text)
    audio = result["audio"]
    return audio  

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
