# BankBot AI Chatbot

AI chatbot for banking FAQs built with Rasa.

## Quick Setup (in BankBot/ dir)

**Requires Python 3.8+**

1. Install Rasa:  
   ```
   pip install rasa
   ```

2. Train the model:  
   ```
   rasa train
   ```
   (Models saved to models/)

3. Terminal 1 - Action server:  
   ```
   rasa run actions
   ```

4. Terminal 2 - Rasa server:  
   ```
   rasa run --enable-api --cors "*" --port 5005
   ```

5. Open `web/index.html` in browser for chat UI.

## Test
- CLI: `rasa shell`
- Stories: `rasa test`
- Custom data/logs in respective folders.

Note: Add logo.png to static/images/. All files created per structure.


## Features
- Intents: greet, balance, transfer, etc.
- Webchat interface.

## Train & Test
- `rasa shell` for CLI testing.
- `rasa test` for stories.

