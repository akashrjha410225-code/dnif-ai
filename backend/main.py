from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import template_engine
import examples_store
import prompt_builder
import ollama_client

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class TicketInput(BaseModel):
    ticket_type: str
    priority: str
    customer_name: str
    title: str
    description: str

class ExampleInput(BaseModel):
    ticket_type: str
    priority: str
    description: str
    response: str

@app.get("/health")
async def health_check():
    is_connected = await ollama_client.check_health()
    return {"status": "ok", "ollama": "connected" if is_connected else "disconnected", "model": "mistral:7b"}

@app.get("/templates")
def list_templates():
    return template_engine.get_all_templates()

@app.get("/templates/{name}")
def get_template(name: str):
    return template_engine.get_template(name)

@app.put("/templates/{name}")
def update_template(name: str, content: dict):
    template_engine.save_template(name, content)
    return {"status": "saved"}

@app.get("/examples")
def get_examples():
    return examples_store.get_examples()

@app.post("/examples")
def add_example(ex: ExampleInput):
    examples_store.add_example(ex.ticket_type, ex.priority, ex.description, ex.response)
    return {"status": "added"}

@app.delete("/examples/{id}")
def delete_example(id: int):
    examples_store.delete_example(id)
    return {"status": "deleted"}

@app.post("/generate")
async def generate_response(ticket: TicketInput):
    template_name = f"{ticket.ticket_type.lower()}_{ticket.priority[:2].lower()}.json"
    template = template_engine.get_template(template_name)
    
    if not template:
        template = {"ticket_type": ticket.ticket_type, "fallback": "True"}

    examples = examples_store.get_examples(ticket_type=ticket.ticket_type, limit=3)
    prompt = prompt_builder.build_prompt(ticket.model_dump(), template, examples)
    
    return StreamingResponse(ollama_client.generate_stream(prompt), media_type="text/event-stream")