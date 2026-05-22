import json
import os

TEMPLATE_DIR = "../templates"

def get_all_templates():
    if not os.path.exists(TEMPLATE_DIR):
        os.makedirs(TEMPLATE_DIR)
    templates = []
    for filename in os.listdir(TEMPLATE_DIR):
        if filename.endswith(".json"):
            templates.append(filename)
    return templates

def get_template(name):
    path = os.path.join(TEMPLATE_DIR, name)
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return None

def save_template(name, content):
    path = os.path.join(TEMPLATE_DIR, name)
    with open(path, "w") as f:
        json.dump(content, f, indent=4)