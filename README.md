# Besage Chat - Real-time Messaging App

A modern, real-time messaging application built with React Native and Expo. This project implements a complete chat solution with real-time messaging using WebSockets, user authentication, and a responsive UI.

## Features

- **Real-time Messaging:** Instant message delivery using WebSockets
- **User Authentication:** Secure login and registration
- **Contact Management:** View and select contacts to chat with
- **Group Chats:** Create multi-participant conversations
- **Message Status:** Read receipts and delivery confirmations
- **Typing Indicators:** See when others are typing
- **Offline Message Caching:** View messages even without connection

## Architecture

The application follows a modular architecture with the following key components:

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router for type-safe navigation
- **State Management**: React Hooks and Context API
- **Styling**: Styled Components
- **Real-time Communication**: WebSocket API
- **Backend**: REST API with WebSocket support

## Modules

- **Authentication**: User registration and login
- **Contacts**: User list and contact management
- **Chat**: Real-time messaging and chat history
- **Profile**: User profile and settings

## Requirements

- Node.js 16.x or higher
- npm or yarn
- Expo CLI
- iOS or Android device/emulator
- Running instances of backend API and CDN services
  - Repo of the [Backend API](https://github.com/Djkde01/realtime-chat-back)
  - Repo of the [CDN Service](https://github.com/Djkde01/realtime-chat-cdn)

## Installation

1. Clone the repository:

```bash
git clone git@github.com:Djkde01/realtime-chat-client.git
cd besage-chat
```

2. Install dependencies

```bash
npm install
# or
yarn install

```

## Configuration

1. Create a `.env` file in the project root with the URLs of the API and CDN:

```bash
EXPO_PUBLIC_API_URL=http://your-backend-api
EXPO_PUBLIC_CDN_URL=http://your-cdn-url
```

## Running the App

1. Ensure both backend API and CDN services are running
2. Start the development server:

```bash
npx expo start
```

3. Use the Expo Go app on your device to scan the QR code, or press:

- `a` to open on Android emulator
- `i` to open on iOS simulator
- `w` to open in web browser

## Development

### Directory Structure

```bash
besage-chat/
│
├── app/                      # Application screens using expo-router
│   ├── (auth)/               # Authentication-related screens
│   ├── (main)/               # Main app screens
│   │   ├── (contacts)/       # Contacts-related screens
│   │   └── chat/             # Chat-related screens
│   └── _layout.tsx           # Root layout
│
├── assets/                   # Static assets
│   ├── fonts/
│   └── images/
│
├── components/               # Reusable UI components
│   └── ui/
│
├── context/                  # React context providers
│   └── AuthContext.tsx
│
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts
│   ├── useChat.ts
│   ├── useChats.ts
│   └── useContacts.ts
│
├── services/                 # API and service layer
│   ├── apiClient.tsx
│   ├── chatService.ts
│   └── webSocketService.ts
│
├── types/                    # TypeScript type definitions
│   └── uiTypes.ts
│
└── utils/                    # Helper utilities
    └── env.ts

```

## Troubleshooting

- **"Welcome to Expo" screen**: Make sure you've properly configured the Expo Router
- **WebSocket connection issues**: Verify your backend URL and authentication token
- **TypeScript errors with routes**: Use the navigation helper or type assertions

## Backend Requirements

This front-end application requires a backend service that provides:

1. REST API for user authentication, chat creation, and message history
2. WebSocket support for real-time messaging

## License

MIT License
