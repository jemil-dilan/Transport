# Vercel Deployment Guide

This project is a React Router application with a Hono server backend, configured for deployment on Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com)
2. The Vercel CLI installed globally: `npm i -g vercel`
3. All required environment variables set up

## Environment Variables

Before deploying, ensure all required environment variables are configured. See `.env.example` for a complete list.

### Required Variables

- **DATABASE_URL**: PostgreSQL connection string (e.g., from Neon)
- **AUTH_SECRET**: Secret key for authentication sessions (generate a secure random string)
- **ANYTHING_PROJECT_TOKEN**: Token for the Create integration
- **NEXT_PUBLIC_PROJECT_GROUP_ID**: Project group identifier

### Optional Variables

- **CORS_ORIGINS**: Comma-separated list of allowed CORS origins (e.g., `https://example.com,https://app.example.com`)
- **NEXT_PUBLIC_CREATE_ENV**: Environment mode (default: `PRODUCTION`, set to `DEVELOPMENT` for dev builds)
- **NEXT_PUBLIC_CREATE_BASE_URL**: Base URL for Create integration
- **NEXT_PUBLIC_CREATE_HOST**: Host for Create integration

## Deployment Steps

### Option 1: Deploy Using Git (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to https://vercel.com/new
3. Select your repository
4. Vercel will auto-detect this is a React Router project
5. Add your environment variables in the "Environment Variables" section
6. Click "Deploy"

### Option 2: Deploy Using Vercel CLI

1. Link your project to Vercel:
   ```bash
   vercel link
   ```

2. Set environment variables:
   ```bash
   vercel env add DATABASE_URL
   vercel env add AUTH_SECRET
   vercel env add ANYTHING_PROJECT_TOKEN
   vercel env add NEXT_PUBLIC_PROJECT_GROUP_ID
   ```

3. Deploy:
   ```bash
   vercel deploy --prod
   ```

### Local Testing

To test the build locally before deploying:

```bash
npm run build
vercel build
vercel start
```

## Build Configuration

The `vercel.json` file contains the deployment configuration:

- **buildCommand**: `npm run build` - Builds the React Router app
- **outputDirectory**: `build/client` - Client-side build output
- **framework**: `vite` - The build framework
- **serverless function**: `build/server/index.js` with 60s timeout

## Project Structure

```
.
├── src/                          # Source code
│   ├── app/                      # React Router app directory
│   └── __create/                 # Server-side code
├── build/                        # Build output (gitignored)
│   ├── client/                   # Client-side build
│   └── server/                   # Server-side build (serverless function)
├── vite.config.ts               # Vite configuration
├── react-router.config.ts       # React Router configuration
└── vercel.json                  # Vercel deployment configuration
```

## Limitations & Considerations

- **Function Timeout**: Set to 60 seconds for the serverless function
- **Request Body Limit**: Capped at 4.5MB (Vercel's default)
- **Cold Starts**: Serverless functions may have cold start delays
- **Database**: Ensure your database (Neon) is accessible from Vercel's regions
- **WebSocket**: WebSocket support is available but may be region-dependent

## Troubleshooting

### Build fails with "DATABASE_URL is required"
- Ensure `DATABASE_URL` is added to Vercel's environment variables
- Check that the connection string is correct

### Authentication not working
- Verify `AUTH_SECRET` is set and is a strong random value
- Check `NEXT_PUBLIC_CREATE_ENV` is set appropriately

### CORS errors
- Add your domain to `CORS_ORIGINS` environment variable if cross-origin requests fail

### Function timeout errors
- Some operations may exceed the 60-second timeout
- Consider optimizing database queries or moving long-running tasks to background jobs

## Monitoring

After deployment:

1. Check logs in Vercel Dashboard: https://vercel.com/dashboard
2. Monitor function logs for errors
3. Set up error tracking (e.g., Sentry) for production issues
4. Monitor database performance and connection pools

## Rollback

To rollback to a previous deployment:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Find the deployment in the "Deployments" tab
4. Click "Rollback" on a previous successful deployment

## Production Best Practices

1. **Environment Variables**: Use Vercel's built-in environment variable management
2. **Database**: Use a managed PostgreSQL service (Neon is pre-configured)
3. **Secrets**: Never commit `.env` to version control
4. **Monitoring**: Set up error tracking and performance monitoring
5. **Backups**: Configure database backups with your provider
6. **CDN**: Vercel automatically caches static assets

## Support

For issues specific to:
- **React Router**: https://reactrouter.com
- **Vercel**: https://vercel.com/support
- **Hono**: https://hono.dev
