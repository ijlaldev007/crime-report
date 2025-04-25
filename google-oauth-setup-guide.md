# Google OAuth Setup Guide

## Fix for "redirect_uri_mismatch" Error

### Step 1: Identify Your Redirect URI

For NextAuth.js, the redirect URI follows this pattern:
```
{NEXTAUTH_URL}/api/auth/callback/google
```

Check your `.env` or `.env.local` file to see what `NEXTAUTH_URL` is set to. If you're running locally, it might be:
```
NEXTAUTH_URL=http://localhost:3000
```

Which would make your redirect URI:
```
http://localhost:3000/api/auth/callback/google
```

### Step 2: Update Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Find your OAuth 2.0 Client ID and click the edit (pencil) icon
5. Under "Authorized redirect URIs", add your redirect URI
6. Click "Save"

### Step 3: Common Issues to Check

- **No trailing slashes**: Make sure there are no trailing slashes in your URIs
- **Protocol matching**: Ensure the protocol (http vs https) matches exactly
- **Port numbers**: Include port numbers if you're using them (e.g., `:3000`)
- **Localhost variations**: If using localhost, you might need both:
  - `http://localhost:3000/api/auth/callback/google`
  - `http://127.0.0.1:3000/api/auth/callback/google`

### Step 4: Environment Variables

Make sure your `.env.local` file has these variables properly set:

```
NEXTAUTH_URL=http://localhost:3000  # For local development
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### Step 5: Production Considerations

For production, you'll need to:
1. Update `NEXTAUTH_URL` to your production URL
2. Add your production redirect URI to Google Cloud Console:
   ```
   https://your-production-domain.com/api/auth/callback/google
   ```

## Testing Your Configuration

After making these changes:
1. Restart your development server
2. Try signing in with Google again
3. The error should be resolved

If you continue to have issues, check the browser console and server logs for more detailed error messages.
