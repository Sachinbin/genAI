# Lumen AI Chat

A full stack AI chat application. The React client provides account registration and login, protected chat, streamed AI responses, and browser-saved conversations. The Express server provides authentication and the Gemini chat endpoint.

## Requirements

- Node.js and npm
- MongoDB connection string
- Gemini API key

## Configure the server

Create `server/.env` with the following values:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
ACCESS_TOKEN_SECRET=use_a_long_random_secret
REFRESH_TOKEN_SECRET=use_a_different_long_random_secret
```

Install dependencies and start the API:

```powershell
cd server
npm install
npm run dev
```

The API is mounted at `/api`. The Vite client proxies `/api` to `http://localhost:3000` by default. If the server runs elsewhere, set `VITE_API_PROXY_TARGET` in `client/.env` to its base URL, such as `http://localhost:4000`, and restart Vite.

## Start the client

In a second terminal:

```powershell
cd client
npm install
npm run dev
```

Open the local URL printed by Vite. For deployments where the API is not served through the same origin, set `VITE_API_URL` in the client environment to the API base URL, including `/api`.

## Available API routes

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account and set auth cookies |
| `POST` | `/api/auth/login` | Sign in and set auth cookies |
| `GET` | `/api/auth/get-me` | Return the signed-in user |
| `POST` | `/api/auth/logout` | Clear auth cookies |
| `POST` | `/api/ai/chat` | Stream an AI response; requires authentication |

Authentication uses HTTP-only cookies. Chat conversations are stored in the current browser's local storage and are not synced between devices.

## Production client build

```powershell
cd client
npm run build
```

The production assets are written to `client/dist`.
