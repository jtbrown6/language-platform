# Fluency App

This is a React-based application that combines a text editor with language learning features such as definition lookup, conjugation, and pronunciation.

![alt text](image.png)
*Figure 1: UI Example*

## Features

- Text editor with Define, Conjugate, and Pronounce options
- Assistance for improving language skills
- Dark mode UI with gradient aesthetics
- Password protection to safeguard API usage

## Local Development Process - Updated October 2025
The process is simple, you just need to pull the code down, and modify a few files.
- create a `.env` file in the root directory
- modify the file `frontend/nginx.conf` and uncomment out the proxy_pass for the correct server and should point to the internal docker address of `backend:5000`
- run the command `docker-compose -f docker-compose-local.yaml up --build`

## Using EC2 with CloudFlare Tunnels

In order to get this to work properly there is a CORS issue that needs to be handled. Currently the BackendAPI will only accept traffic from the machine its running on. So you have to create a tunnel for `api.komebacklabs.com` and point to the `ElasticIP:5000` then ensure that the below is configured correctly.

```bash
# Security Groups and CloudFlare
Open 5000 and 8080 from Anywhere
Create subdomain for spanish and api.komebacklabs.com for the front and backends
# Backend API
touch .env
docker run -d --name lang-backend -p 5000:5000 --restart always language-platform/backend:latest

# Previous Frontend
docker build --build-arg REACT_APP_API_BASE_URL=http://3.227.197.24:5000 -t language-platform/frontend .

# With CloudFlare
docker build --build-arg REACT_APP_API_BASE_URL=https://api.komebacklabs.com -t language-platform/frontend .
docker run -d --name lang-frontend -p 8080:80 --restart always language-platform/frontend:latest
```

## Password Protection

The application now includes a password protection feature to prevent unauthorized access to the API functionality. This helps protect your OpenAI API token from being used by unauthorized users.

### How it works:

1. When a user first accesses the application, they are presented with a password modal
2. The user must enter the correct password to access the application's features
3. Once authenticated, the session remains active until the browser is closed
4. All API calls are protected and require authentication

### Customizing the password:

The default password is set to `spanish123`. You can change this by modifying the `correctPassword` variable in the `src/context/AuthContext.js` file:

```javascript
// Login function - validates password and sets auth state
const login = (password) => {
  // Hardcoded password - in a real app, this would be more secure
  const correctPassword = 'spanish123'; // Change this to your preferred password
  
  if (password === correctPassword) {
    sessionStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    return true;
  }
  return false;
};
```

## Future Enhancements
1. ~~Add Password Authentication~~ ✅ Implemented
2. Modify the `nginx.conf` to point to backend as well
3. Modify python backend code to nodejs and combine application together
4. Add more Languages
5. Update TTS API using new OpenAI API released March 2025
6. Save words to host volume and export as csv for google sheets

## Getting Started

1. Make sure you have Node.js installed on your system.
2. Navigate to the project directory in your terminal.
3. Install the dependencies by running:

   ```
   npm install
   ```

4. Set up the environment variable for the API base URL:

   Create a `.env` file in the root of the project and add the following line:

   ```
   REACT_APP_API_BASE_URL=http://your-api-base-url
   ```

   Replace `http://your-api-base-url` with the actual URL of your backend API.

5. Start the development server:

   ```
   npm start
   ```

6. Open your browser and visit `http://localhost:3000` to see the application.

## Usage

1. When you first access the application, you'll be prompted to enter a password
2. Enter the password (default is `spanish123`) to gain access to the application
3. Type or paste text in the editor
4. Select a word or phrase and use the Define, Conjugate, or Pronounce buttons to get more information
5. Click "Get Assistance" to receive suggestions for improving your text

Note: The authentication status is stored in your browser's session storage, so you won't need to re-enter the password until you close your browser.

## Customization

You can customize the appearance by modifying the `App.css` file, and adjust the functionality by editing the components in the `src/components` directory.

## Backend API

Ensure your backend API has the following endpoints:

- POST /api/define: For definitions
- POST /api/conjugate: For conjugations
- POST /api/assist: For language assistance
- POST /pronounce: For pronunciation

Each endpoint should accept JSON with `text` and `language` fields.

# Getting Started with Create React App
To prepare your application for production and run it in Docker, follow these steps:

Build the React App:

Run the build command to create an optimized production build of your React app.
npm run build
Create a Dockerfile:

Create a Dockerfile in the root of your project to define the Docker image.
Use a multi-stage build to first build the React app and then serve it using a lightweight web server like nginx.

```yaml
# Stage 1: Build the React app
FROM node:14 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration
# Stage 1: Build the React app
FROM node:14 as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

COPY . .
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Build the Docker Image:

Build the Docker image using the Dockerfile.
`docker build --build-arg REACT_APP_API_BASE_URL=http://192.168.1.250:5001 -t fluent-front .`

Run the Docker Container:

Run the Docker container, mapping port 80 in the container to port 3000 on your host.
`docker run -d -p 3000:80 fluent-front`

Set Environment Variables:

Ensure that the REACT_APP_API_BASE_URL environment variable is set to `http://192.168.1.250:5000` when building the Docker image or running the container.

## Deploying to EC2

To deploy the application to your EC2 instance:

1. Build the application locally:
   ```
   npm run build
   ```

2. Transfer the build folder to your EC2 instance:
   ```
   scp -r build/ user@your-ec2-instance:/path/to/destination
   ```

3. Use the Dockerfile to build and run the container on your EC2 instance:
   ```
   docker build -t fluent-front .
   docker run -d -p 80:80 fluent-front
   ```

4. Access your application at your EC2 instance's public IP or domain name.

The password protection will ensure that only authorized users can access the API functionality, protecting your OpenAI API token from unauthorized usage.
