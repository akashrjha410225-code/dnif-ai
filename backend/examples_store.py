import sqlite3
import os

DB_PATH = "database.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS examples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_type TEXT NOT NULL,
            priority TEXT NOT NULL,
            description TEXT NOT NULL,
            response TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def get_examples(ticket_type=None, limit=3):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    if ticket_type:
        cursor.execute("SELECT * FROM examples WHERE ticket_type = ? ORDER BY created_at DESC LIMIT ?", (ticket_type, limit))
    else:
        cursor.execute("SELECT * FROM examples ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def add_example(ticket_type, priority, description, response):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO examples (ticket_type, priority, description, response) VALUES (?, ?, ?, ?)",
                   (ticket_type, priority, description, response))
    conn.commit()
    conn.close()

def delete_example(example_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM examples WHERE id = ?", (example_id,))
    conn.commit()
    conn.close()

init_db()