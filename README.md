# NeuTranscriber Web

A modern React web application for converting piano audio recordings to MIDI files using machine learning. Features Google OAuth authentication, real-time transcription status tracking, and a beautiful dark mode UI.

## What it does

- **Audio upload**: Upload piano recordings in multiple formats
- **Real-time status tracking**: WebSocket connection shows transcription progress
- **MIDI download**: Download transcribed MIDI files with one click
- **Transcription history**: View and manage your past transcriptions
- **Google OAuth**: Secure login with Google accounts
- **Dark mode**: Beautiful dark/light theme support
- **Responsive design**: Works seamlessly on desktop and mobile devices

## Quick Start

### Prerequisites

- Node.js 14+
- npm or yarn
- Backend server running on `http://localhost:9000/api`
- Google OAuth credentials

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd neutranscriber-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   - `REACT_APP_API_URL`: Backend API URL (default: `http://localhost:9000/api`)
   - `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth Client ID

### Running the Application

**Development mode**:
```bash
npm start
```
The app will open at `http://localhost:3000`

**Production build**:
```bash
npm run build
```
Creates an optimized build in the `build/` directory.

## Features

### Authentication
- Google OAuth 2.0 login
- JWT token-based authentication
- Persistent sessions (tokens saved in localStorage)
- Automatic logout on token expiration

### Audio Upload
- Supports MP3, WAV, FLAC, OGG, M4A, AIFF, AAC
- File size validation (max 100MB)
- Drag-and-drop interface
- File preview with audio player
- User information display with profile picture

### Transcription History
- View all past transcriptions
- Filter by status (Processing, Completed, Failed)
- Download completed MIDI files
- Delete transcription history entries
- Automatic updates via WebSocket

### Real-time Updates
- WebSocket connection for live status updates
- Automatic reconnection on connection loss
- URL change detection to prevent unnecessary reconnections
- Single connection per session (no duplicate connections)

### UI/UX
- Tailwind CSS styling
- Dark mode support with `prefers-color-scheme`
- Responsive design (mobile-first)
- Loading states and error handling
- Toast notifications for user feedback
- Smooth animations and transitions

## Architecture

### Technology Stack
- **React 18**: Latest React features with Hooks
- **React Context API**: Global state management (Auth, History)
- **React Router v6**: Client-side routing
- **Socket.io**: WebSocket for real-time updates
- **Tailwind CSS**: Utility-first CSS framework
- **Fetch API**: HTTP requests with JWT auth

### Folder Structure
```
src/
├── components/          # React components
│   ├── AudioUpload.js      # File upload interface
│   ├── TranscriptionHistory.js  # History display
│   ├── Login.js            # Google OAuth login
│   └── ...
├── contexts/            # React Context providers
│   ├── AuthContext.js      # Authentication state
│   └── HistoryContext.js   # Transcription history state
├── services/            # API and WebSocket services
│   ├── api.js              # Axios instance and API methods
│   ├── websocket.js        # WebSocket service (singleton)
│   └── ...
├── hooks/               # Custom React hooks
│   └── useTranscription.js # Transcription state management
├── utils/               # Utility functions
│   ├── constants.js        # Constants and config
│   ├── downloadUtils.js    # Download helpers
│   └── ...
├── App.js               # Main app component
├── index.js             # React 18 createRoot entry point
└── App.css              # Global styles
```

### State Management

**AuthContext**:
- Stores: `user`, `accessToken`, `refreshToken`
- Provides: `login()`, `logout()`, `isAuthenticated`
- Persistence: Saves tokens in localStorage

**HistoryContext**:
- Stores: Array of transcriptions
- Provides: Methods to add, update, delete transcriptions
- Updates: Real-time updates via WebSocket

**useTranscription Hook**:
- Manages transcription upload and progress
- Handles API calls to backend
- Tracks upload state (idle, uploading, completed, error)

### WebSocket Service

Singleton pattern for managing WebSocket connections:
- Lazy initialization on first use
- Single connection per app lifecycle
- Automatic reconnection with exponential backoff
- Event handlers for real-time status updates
- Connection state tracking with `isConnecting` flag

## API Integration

### Authentication Flow
1. User clicks "Login with Google"
2. Google OAuth window opens
3. User grants permissions
4. Frontend exchanges code for JWT tokens
5. Tokens stored in localStorage and context
6. All subsequent requests include JWT in Authorization header

### Transcription Flow
1. User selects audio file
2. File validated (type, size)
3. Multipart form data sent to `/api/transcribe` with JWT token
4. Backend returns task_id
5. WebSocket listens for status updates
6. When complete, MIDI file ready for download

### API Endpoints Used
- `POST /api/auth/google` - Google OAuth token exchange
- `POST /api/transcribe` - Upload audio file (JWT required)
- `GET /api/user/transcriptions` - Get user's transcription history (JWT required)
- `GET /api/transcription_status/{task_id}` - Get transcription status
- `GET /api/download_midi/{filename}` - Download MIDI file (JWT required)
- `DELETE /api/transcription/{id}` - Delete transcription (JWT required)
- WebSocket: Real-time status updates for transcriptions

## Environment Variables

Create `.env` file in the project root:

```bash
# Backend API URL (required)
REACT_APP_API_URL=http://localhost:9000/api

# Google OAuth Client ID (required)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Development

### Making Changes

**For component changes**:
- Edit components in `src/components/`
- Changes hot-reload automatically

**For styling**:
- Tailwind CSS classes in component JSX
- Run `npm run build:css` if needed for custom CSS

**For API integration**:
- Update `src/services/api.js` for new endpoints
- Use the configured axios instance with JWT auth

**For state management**:
- Update Context providers in `src/contexts/`
- Or create new custom hooks in `src/hooks/`

### Testing

Run tests:
```bash
npm test
```

Build and verify:
```bash
npm run build
npm run analyze  # (if analyze script available)
```

## Troubleshooting

### Common Issues

1. **"Cannot connect to API"**:
   - Ensure backend server is running on `http://localhost:9000`
   - Check `REACT_APP_API_URL` in `.env` matches backend URL
   - Check CORS settings in backend

2. **"WebSocket connection failed"**:
   - Backend server may be offline
   - Check browser console for detailed error messages
   - Connection will auto-retry

3. **"Image failed to load" (profile picture)**:
   - Falls back to initials avatar if Google image CDN is slow
   - This is expected behavior on rate-limited connections

4. **"Invalid JWT token"**:
   - Refresh page to re-authenticate
   - Clear localStorage and log in again
   - Check backend JWT_SECRET_KEY configuration

5. **Build fails with warnings**:
   - Run `npm run build` to see detailed errors
   - Check console output for Tailwind CSS warnings
   - Ensure all imports are correct

### Debug Mode

Check browser console for:
- WebSocket connection events
- API request/response details
- React state changes (use React DevTools)
- Network tab in DevTools for failed requests

## Production Deployment

### Build Optimization
```bash
npm run build
```

### Serve Production Build Locally
```bash
npm install -g serve
serve -s build
```

### Deploy to Production

**Environment Setup**:
- Set `REACT_APP_API_URL` to production backend URL
- Update `REACT_APP_GOOGLE_CLIENT_ID` for production Google app
- Rebuild application

**Hosting Options**:
1. **Netlify** (recommended):
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables in Netlify dashboard

2. **Vercel**:
   - Similar to Netlify
   - Automatic deployments on git push

3. **AWS S3 + CloudFront**:
   - Build and upload to S3
   - Configure CloudFront for HTTPS and caching

4. **Docker**:
   - Create `Dockerfile` for containerized deployment
   - Use multi-stage build for optimization

### Performance Tips
- Enable gzip compression on server
- Set cache headers for static assets
- Use CDN for faster content delivery
- Monitor bundle size with `npm run analyze`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security

- JWT tokens stored in localStorage (consider sessionStorage for sensitive environments)
- HTTPS required for production (enforced by OAuth)
- CORS configured on backend to prevent unauthorized requests
- Passwords never handled by frontend (OAuth only)
- File upload validation on both client and server

## Performance

- Code splitting with React.lazy()
- Optimized Tailwind CSS (tree-shaking unused styles)
- WebSocket for real-time updates (reduces polling)
- Image lazy-loading for profile pictures
- Memoized callbacks to prevent unnecessary re-renders

## Contributing

1. Create a feature branch
2. Make changes with descriptive commits
3. Ensure build passes: `npm run build`
4. Submit pull request with description

## License

[Add your license here]

## Support

For issues or questions:
- Check [API_DOCUMENTATION.md](../neutranscriber-server/API_DOCUMENTATION.md) for backend API details
- Review browser console for error messages
- Check GitHub Issues for known problems
