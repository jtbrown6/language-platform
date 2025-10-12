from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import openai
import os
import json
from dotenv import load_dotenv
import logging
import re
import threading
from io import BytesIO
import base64
from pathlib import Path
import requests
import sqlite3
from datetime import datetime

load_dotenv()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database configuration
DB_PATH = 'language_platform.db'

def init_db():
    """Initialize the SQLite database with notes table"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create notes table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY,
            content TEXT NOT NULL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert initial empty note if table is empty
    cursor.execute('SELECT COUNT(*) FROM notes')
    if cursor.fetchone()[0] == 0:
        cursor.execute('INSERT INTO notes (id, content) VALUES (1, "")')
    
    conn.commit()
    conn.close()
    logger.info("Database initialized successfully")

# Initialize database on startup
init_db()

# Set your OpenAI API key securely
openai.api_key = os.getenv('OPENAI_API_KEY')  # Ensure you have set this environment variable

# @app.route('/')
# def index():
#     return render_template('index.html')


# How we can handle the in-memory storage for conversations
# Data Struct: {user_id: { message1, message2, ...}}
conversation_history = []
MAX_HISTORY = 3  # Number of user messages to keep

# We are stopping the number of messages for the total tokens sent
MAX_HISTORY = 3


# This handles the "Assist Me" Button
# @app.route('/api/assist', methods=['POST'])
# def assist():
#     data = request.json
#     text = data.get('text', '')
#     messages = [
#         {"role": "system", "content": "You are a helpful assistant proficient in correcting Spanish text for English Speakers Learning Spanish."},
#         {"role": "user", "content": f"""Correct the following Spanish text. Your recommendations should be tailored for English speakers
#          so they can read and understand the recommendations in their native language while allow them to also reading the corrections in Spanish.
#          Consider any cultural or situational nuances and explain any mistakes:\n\n{text}"""}
#         #{"role": "user", "content": f"Correct the following Spanish text, consider any cultural or situational nuances and explain any mistakes:\n\n{text}"}
#     ]
#     response = openai.ChatCompletion.create(
#         model='gpt-5-mini-2025-08-07',
#         messages=messages,
#         max_tokens=800,
#         temperature=0.7,
#     )
#     return jsonify({'result': response.choices[0].message['content'].strip()})


# This handles the "Assist Me" Button — Option B (mention once) + Bilingual guidance
@app.route('/api/assist', methods=['POST'])
def assist():
    data = request.json
    text = data.get('text', '')

    system = """You are a concise Spanish writing coach for English-speaking learners.

Rules:
1) Corrections: Provide ONE corrected version of the user's text IN SPANISH.
2) Recommendations/Explanations: Write all guidance IN ENGLISH and keep it brief and actionable for an English speaker.
3) ACCENT POLICY: Ignore accent/diacritic-only issues (á, é, í, ó, ú, ü, ñ, ¿, ¡) unless missing/adding them changes meaning (e.g., si/sí, tu/tú, el/él, mas/más, solo/sólo when disambiguation matters, interrogatives/exclamatives: qué, cómo, cuándo, dónde, por qué).
4) If an accent changes meaning, silently fix it in the corrected text. Add a single note line: "Applied accent fixes where they changed meaning."
5) Output format (STRICT and terse):
   - Corrected (ES): <corrected Spanish>
   - Non-Accent Errors (EN): <0–5 bullets naming ONLY non-accent issues; no long explanations; include the minimal Spanish fix with →>
   - Recommendations (EN): <1–3 short bullets tailored to an English speaker; include cultural/situational nuance if relevant; keep it brief>
   - Notes (EN): <omit if none>
6) Be token-efficient. No apologies, no meta commentary, do not repeat the user’s original text.
"""

    # Keep your bilingual requirement explicit in the user message for extra reinforcement.
    user = f"""Correct the following Spanish text. Your recommendations should be tailored for English speakers
so they can read and understand the recommendations in their native language (English) while also reading the corrected text in Spanish.
Consider any cultural or situational nuances and explain any mistakes briefly in English, following the rules above.

Text:
{text}"""

    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": user}
    ]

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini-2024-07-18",
        messages=messages,
        max_tokens=3000,
        temperature=0.2,
    )
    return jsonify({'result': response.choices[0].message['content'].strip()})



# This handles the conjugate button and table
@app.route('/api/conjugate', methods=['POST'])
def conjugate():
    data = request.json
    verb = data.get('verb', '')
    logger.debug(f"Received request to conjugate verb: {verb}")
    
    messages = [
        {"role": "system", "content": "You are a helpful assistant proficient in Spanish verb conjugations."},
        {"role": "user", "content": f"Provide the conjugations of the Spanish verb '{verb}' in the following tenses: present, subjunctive, preterite, imperfect, and future. Do not include 'vosotros' forms. Return ONLY the JSON data with keys for each tense ('present', 'subjunctive', etc.), and for each tense, provide a dictionary with keys 'yo', 'tú', 'él/ella/usted', 'nosotros', 'ellos/ellas/ustedes', and their corresponding conjugations."}
    ]
    
    try:
        response = openai.ChatCompletion.create(
            model='gpt-4o-mini-2024-07-18',
            messages=messages,
            max_tokens=1000,
            temperature=0.4,
        )
        logger.debug(f"Received response from OpenAI: {response}")
        
        content = response.choices[0].message['content'].strip()
        logger.debug(f"Extracted content: {content}")
        
        # Extract JSON content
        json_match = re.search(r'\{[\s\S]*\}', content)
        if json_match:
            json_content = json_match.group(0)
            logger.debug(f"Extracted JSON content: {json_content}")
            
            conjugations = json.loads(json_content)
            logger.debug(f"Parsed conjugations: {conjugations}")
            
            return jsonify({'result': conjugations})
        else:
            logger.error("No JSON content found in the response")
            return jsonify({'error': 'No JSON content found in the response', 'raw_response': content})
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return jsonify({'error': 'Failed to parse conjugations', 'raw_response': content})
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)})


@app.route('/api/define', methods=['POST'])
def define():
    data = request.json
    word = data.get('word', '')
    messages = [
        {"role": "system", "content": "You are a helpful assistant proficient in defining Spanish words in English and vice versa."},
        {"role": "user", "content": f"Define the Spanish or English word '{word}' in English or Spanish and provide a sentence using the word. If the word has both a definition for its form as a noun or adjective provide both."}
    ]
    response = openai.ChatCompletion.create(
        model='gpt-4o-mini-2024-07-18',
        messages=messages,
        max_tokens=500,
        temperature=0.4,
    )
    return jsonify({'result': response.choices[0].message['content'].strip()})


# Handles the Chat Window Feature w/ History 
SYSTEM_PROMPT = {
    "role": "system",
    "content": "You are a helpful assistant for Spanish language learning. Consider cultural and situational nuances while assisting."
}
conversation_history.append(SYSTEM_PROMPT.copy())

@app.route('/api/chatbot', methods=['POST'])
def question():
    data = request.json
    query = data.get('query', '').strip()

    if not query:
        logger.debug("Received empty query.")
        return jsonify({'error': 'Missing or empty query in request'}), 400
    
    # Append the user message
    conversation_history.append({"role": "user", "content": query})
    logger.debug(f"Appended user message: {query}")
    
    # Prune conversation history to keep only the last MAX_HISTORY user messages and their assistant responses
    # Including system prompt
    # Find indices of all user messages
    user_indices = [i for i, msg in enumerate(conversation_history) if msg['role'] == 'user']
    
    if len(user_indices) > MAX_HISTORY:
        # Calculate the index to start keeping messages
        keep_from = user_indices[-MAX_HISTORY]
        # Retain system prompt and messages from keep_from onwards
        pruned_history = [SYSTEM_PROMPT.copy()] + conversation_history[keep_from:]
        conversation_history[:] = pruned_history
        logger.debug(f"Pruned conversation history to keep last {MAX_HISTORY} user messages.")

    # Prepare messages to send to OpenAI
    messages_to_send = conversation_history.copy()
    logger.debug(f"Messages sent to OpenAI: {json.dumps(messages_to_send, ensure_ascii=False)}")

    try:
        response = openai.ChatCompletion.create(
        model='gpt-4o-mini-2024-07-18',
        messages=messages_to_send,
        max_tokens=700,
        temperature=0.7,
    )
        assistant_message = response.choices[0].message['content'].strip()
        logger.debug(f"Assistant response: {assistant_message}")

        # Append assistant response to the history
        conversation_history.append({"role": "assistant", "content": assistant_message})
        logger.debug("Appended assistant message to conversation history.")   

        
        return jsonify({'result': assistant_message})
    except Exception as e:
        logger.error(f"Error communicating with OpenAI: {str(e)}")
        return jsonify({'error': 'Failed to get response from assistant', 'details': str(e)}), 500

    # Example endpoint to reset conversation (optional)
@app.route('/api/reset_conversation', methods=['POST'])
def reset_conversation():
    conversation_history.clear()
    conversation_history.append(SYSTEM_PROMPT.copy())
    logger.debug("Conversation history has been reset.")
    return jsonify({'result': 'Conversation history reset successfully'})


# Notes endpoints for persistent storage
@app.route('/api/notes', methods=['GET'])
def get_notes():
    """Retrieve the current notes from the database"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT content, last_updated FROM notes WHERE id = 1')
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return jsonify({
                'content': result[0],
                'last_updated': result[1]
            })
        else:
            return jsonify({'content': '', 'last_updated': None})
    except Exception as e:
        logger.error(f"Error retrieving notes: {str(e)}")
        return jsonify({'error': 'Failed to retrieve notes', 'details': str(e)}), 500


@app.route('/api/notes', methods=['POST'])
def save_notes():
    """Save or update notes in the database"""
    try:
        data = request.json
        content = data.get('content', '')
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Update the notes content and timestamp
        cursor.execute('''
            UPDATE notes 
            SET content = ?, last_updated = ? 
            WHERE id = 1
        ''', (content, datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        logger.debug(f"Notes saved successfully. Length: {len(content)} characters")
        return jsonify({'result': 'Notes saved successfully', 'length': len(content)})
    except Exception as e:
        logger.error(f"Error saving notes: {str(e)}")
        return jsonify({'error': 'Failed to save notes', 'details': str(e)}), 500


@app.route('/api/pronounce', methods=['POST'])
def pronounce():
    # Get the word from the request that's highlighted
    data = request.json
    word = data.get('word', '').strip()

    if not word:
        logger.debug("Received empty word for pronunciation.")
        return jsonify({'error': 'Missing or empty word in request'}), 400

    try:
        # Parte Uno: translate the word to Spanish if necessary
        translation_prompt = [
            {"role": "system", "content": "You are a translator proficient in Spanish."},
            {"role": "user", "content": f"Translate the word '{word}' to Spanish. If it's already Spanish, return it unchanged, but ONLY provide the translated word, do not mention that the word is in spanish or not."}
        ]
        translation_response = openai.ChatCompletion.create(
            model="gpt-4o-mini-2024-07-18", 
            messages=translation_prompt,
            max_tokens=500,
            temperature=0.3,
        )
        translated_word = translation_response.choices[0].message['content'].strip()

        logger.debug(f"Translated word: {translated_word}")

        # generate the espanol pronunciation using text to speech openai api
        # temp file to store the audio locally
        temp_file = Path("temp_speech.mp3")
        
        
        headers = {
            "Authorization": f"Bearer {openai.api_key}",
            "Content-Type": "application/json"
        }
        
        # Add a pause and slow down the speech
        tts_data = {
            "model": "tts-1",
            "voice": "nova",
            "input": f"{translated_word}",  # extra dots for pausing a little bit
            "speed": 0.95  
        }
        
        response = requests.post(
            "https://api.openai.com/v1/audio/speech",
            headers=headers,
            json=tts_data,
            stream=True
        )
        
        if response.status_code != 200:
            raise Exception(f"TTS API error: {response.text}")
            
        # Stream to file
        with open(temp_file, 'wb') as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
        
        # Read the file and convert to base64
        with open(temp_file, "rb") as audio_file:
            audio_content = base64.b64encode(audio_file.read()).decode('utf-8')
            
        # Clean up the temporary file
        temp_file.unlink()

        logger.debug("Generated audio content successfully.")

        # Return the original word, translation, and audio as a response
        return jsonify({
            "original_word": word,
            "translated_word": translated_word,
            "audio": audio_content
        })
    except Exception as e:
        logger.error(f"Error generating text-to-speech: {str(e)}")
        return jsonify({'error': 'Failed to generate pronunciation', 'details': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
