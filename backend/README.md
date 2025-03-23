# Polyglot Backend API
**Note:** *supports Fluent-Front Frontend React App*

## Purpose
This FastAPI Backend is running internally on `192.168.1.214/24` as **polyglot-back**. Overall this application leverages OpenAI API to perform functions related to Learning Spanish for translation services and overall coaching and assessment. It uses the gpt-4.0-mini model which keeps costs down.

## How It Works

![alt text](./img/example.png "FrontEnd")

There are 6 buttons with different functionality.
- **Assist in Spanish:** analyzes the written text if in spanish to provide guidance on assisting the user
- **Translate to English/Spanish:** translates the sentence and puts response in the **Responses** Pane
- **Congugate:** highlighting a verb will provide the different congugations in the **Congugations** which are in the same format as the Lawless Spanish Website. 
- **Define:**: highlighting a word will provide the definition for the user in the **Definitions** Pane
- **Ask a Question:** this is a simple way to get more of a tailored experience if you have specific questions
- **Pronounce:** this is the newest service which can prnounce the highlighted content.

## How to Run
1. Ensure that you pull down the full code base
2. Create a `.env` file which should contain your OpenAPI Key
3. The `.env` will go in the root directory not in the env/ directory

```bash
touch .env
# Add this content
OPENAI_API_KEY=#this is where your key goes
```
3. You have the option to either run as a local container using the Dockerfile or pull the image from my repository via Docker-Compose and the DockerHub.

```bash
# Using Docker-Compose only if container is in dockerhub
docker compose up -d

# Using Dockerfile Local
touch .env
docker build -t fluentback .
docker run -d --name fluentback -p 5000:5000 fluentback
localhost:5000
```




