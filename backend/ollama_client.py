import httpx
import json

OLLAMA_URL = "http://localhost:11434/api/generate"

async def check_health():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:11434/")
            return response.status_code == 200
    except:
        return False

async def generate_stream(prompt):
    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": True,
        "temperature": 0.3
    }
    async with httpx.AsyncClient(timeout=None) as client:
        async with client.stream("POST", OLLAMA_URL, json=payload) as response:
            async for line in response.aiter_lines():
                if line:
                    data = json.loads(line)
                    if "response" in data:
                        yield data["response"]