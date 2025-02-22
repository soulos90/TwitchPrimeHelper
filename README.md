
# Twitch Prime Subscription Assistant

## Project Overview

The **Twitch Prime Subscription Assistant** is a React Native mobile application designed to simplify the process of using Amazon Prime’s free Twitch subscription. The subscription must be manually renewed every 30 days, making it easy to forget. This app guides users through the process step-by-step and provides timely reminders to ensure they use their free subscription consistently.

## Key Features

- **Step-by-Step Guidance**: The app provides detailed instructions for each step of the subscription process, including logging into Twitch, linking Amazon Prime, choosing a preferred channel, and subscribing with Prime.
- **Reminders**: The app sets a 30-day countdown after a subscription is used and sends a push notification when it's time to resubscribe.
- **Preferred Channel**: Users can set and update their preferred Twitch channel for Prime subscriptions.
- **Manual Completion**: Users manually mark each step as complete, allowing the app to track progress and provide relevant guidance.
- **Accessibility**: The app includes features to assist visually impaired users.

## To-Do List for Subscription Process

1. **Log in to Twitch**  
   - Guide users to log into Twitch via an in-app browser.
   - Provide instructions to handle login difficulties.
   - Link: [https://www.twitch.tv/login](https://www.twitch.tv/login)

2. **Check Amazon Prime Linkage to Twitch**  
   - Verify if the user’s Twitch account is linked to Amazon Prime.
   - Provide a walkthrough for linking Twitch and Prime if necessary.
   - Link: [https://www.twitch.tv/prime](https://www.twitch.tv/prime)

3. **Access Followed Channels List**  
   - Display a user’s followed Twitch channels.
   - Allow the user to select a preferred channel for Prime subscriptions.
   - Provide a textbox for inputting a preferred channel (default: `northdeltagames`).
   - Instructions for finding channel names manually.
   - Link: [https://www.twitch.tv/directory/following](https://www.twitch.tv/directory/following)

4. **Navigate to the Subscription Page**  
   - Guide users to their selected channel’s subscription page.
   - Provide iOS and Android-specific images to reduce confusion.
   - Link: [https://www.twitch.tv/subs/{channel_name}](https://www.twitch.tv/subs/{channel_name})

5. **Subscribe with Prime**  
   - Assist users in selecting "Subscribe with Prime" and confirming the subscription.
   - Provide troubleshooting steps for common issues (e.g., Prime not showing as an option).

6. **Set Subscription Reminder (Recurring Task)**  
   - Once a Prime subscription is used, trigger a 30-day countdown.
   - When the countdown expires, send a push notification and add a red dot to the app icon, reminding users to resubscribe.
   - Notification options:
     - "Delay 1 Day" button.
     - "Go to Preferred Page" button (opens the browser to the subscription page of the saved channel).

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/TwitchPrimeHelper.git
   cd TwitchPrimeHelper
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npx expo start
   ```

## Building for Production

To build the app for production, use the following commands:

- For iOS:
  ```sh
  eas build --platform ios
  ```

- For Android:
  ```sh
  eas build --platform android
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
