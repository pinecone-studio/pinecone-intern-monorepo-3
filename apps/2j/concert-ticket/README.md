# Concert Ticket Booking System

## Environment Variables

### Backend (.env)
```bash
MONGODB_URI=mongodb://localhost:27017/concert-ticket
# Alternative: MONGO_URI=mongodb://localhost:27017/concert-ticket
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
PORT=4000
NODE_ENV=development
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_BACKEND_URI=http://localhost:4000/graphql
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### CI/CD Environment Variables
For GitHub Actions or other CI/CD systems, set these secrets:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- `CORS_ORIGIN`: CORS origin URL
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: Cloudinary upload preset

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Start MongoDB locally or use MongoDB Atlas

4. Run the backend:
```bash
npx nx serve ticket-backend
```

5. Run the frontend:
```bash
npx nx serve ticket-frontend
```

## Testing

Run tests with proper environment variables:
```bash
npx nx test ticket-frontend
npx nx test ticket-backend
```

## Deployment

The CI/CD pipeline automatically:
1. Runs tests with MongoDB service
2. Builds both frontend and backend
3. Deploys to production (configure deployment step)

## Troubleshooting

### MongoDB Connection Issues
- Ensure `MONGODB_URI` or `MONGO_URI` is set
- Check MongoDB service is running
- Verify connection string format

### Missing Environment Variables
- Check all required variables are set
- Ensure variable names match exactly
- For CI/CD, verify secrets are configured

### Apollo Client Warnings
- Use `devtools.enabled` instead of `connectToDevTools`
- Ensure proper environment detection
