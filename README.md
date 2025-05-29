# MedTracker - Your Personal Medication Assistant

MedTracker is a mobile application built with React Native and Expo that helps users manage their medications effectively. The app provides features for tracking medications, setting reminders, and maintaining a medication schedule.

## Features

- 🔐 Secure authentication using Clerk
- 💊 Medication tracking and management
- ⏰ Reminder system for medication schedules
- 📱 Cross-platform (iOS & Android) support
- 🎨 Modern and intuitive user interface
- 🔄 Real-time updates and synchronization

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended)
- npm (comes with Node.js)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Emulator
- A Clerk account for authentication

## Getting Started

1. **Clone the repository**

   ```bash
   git clone [your-repository-url]
   cd Medication
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Clerk publishable key:

   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Run on your device or simulator**
   - Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)
   - Press 'i' to open in iOS simulator
   - Press 'a' to open in Android emulator
   - Press 'w' to open in web browser

## Project Structure

```
Medication/
├── app/                    # Main application code
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout
├── assets/                # Static assets
├── components/            # Reusable components
│   └── ui/               # UI components
├── constants/            # App constants
├── contexts/            # React contexts
├── hooks/               # Custom hooks
└── services/           # API and other services
```

## Technologies Used

- React Native
- Expo
- Clerk (Authentication)
- TypeScript
- Expo Router
- React Native Paper
- Expo Vector Icons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Module not found errors**

   - Run `npm install` again
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **Expo SDK version mismatch**

   - Make sure you have the latest Expo Go app installed
   - Check that your Expo CLI is up to date

3. **Metro bundler issues**

   - Clear Metro bundler cache: `expo start -c`
   - Restart the development server

4. **Authentication issues**
   - Verify your Clerk publishable key in the `.env` file
   - Ensure you have an active Clerk account
