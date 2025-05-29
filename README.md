# Music Transcription Client

This project is a web application that allows users to upload audio files and transcribe them into MIDI format using a music transcription API. The application is built with React and provides a user-friendly interface for managing audio uploads and viewing transcription results.

## Features

- Upload audio files for transcription
- Display transcription status (success or failure)
- Play back transcribed MIDI files

## Project Structure

```
music-transcription-client
├── public
│   ├── index.html          # Main HTML file for the React application
│   └── favicon.ico         # Favicon for the web application
├── src
│   ├── components          # React components for the application
│   │   ├── AudioUpload.js  # Component for uploading audio files
│   │   ├── TranscriptionStatus.js # Component for displaying transcription status
│   │   └── MidiPlayer.js   # Component for playing back MIDI files
│   ├── services            # API service functions
│   │   └── api.js         # Functions for interacting with the music transcription API
│   ├── hooks               # Custom React hooks
│   │   └── useTranscription.js # Hook for managing transcription state
│   ├── utils               # Utility functions and constants
│   │   └── constants.js    # Constants used throughout the application
│   ├── App.js              # Main application component
│   ├── App.css             # Styles for the application
│   └── index.js            # Entry point for the React application
├── package.json            # npm configuration file
└── README.md               # Documentation for the project
```

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd music-transcription-client
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## Usage

- Use the **Audio Upload** component to select and upload audio files.
- Monitor the **Transcription Status** component for updates on the transcription process.
- Once the transcription is complete, use the **MIDI Player** component to play back the generated MIDI files.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.