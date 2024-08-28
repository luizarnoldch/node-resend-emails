# Project Name

## Overview

This project is a Node.js application using Express, CSRF protection, and Resend for sending emails. The application includes CSRF token management, CORS configuration, and basic email sending functionality.

## Environment Variables

To run this project locally, you need to set up the following environment variables:

- `NODE_ENV`: Defines the environment in which the application is running (e.g., `development` or `production`).
- `RESEND_API_KEY`: Your API key for Resend service.

### Setting Up Environment Variables

1. **Create a `.env` file** in the root of your project directory.

2. **Add the following variables** to the `.env` file:

   ```plaintext
   NODE_ENV=development
   RESEND_API_KEY=<your-resend-api-key>
   ```

   Replace `<your-resend-api-key>` with your actual API key from Resend.

3. **Install Dependencies**:

   ```bash
   pnpm install
   ```

4. **Start the Application**:

   ```bash
   pnpm dev
   ```

5. **Node Version**:

This project requires Node.js version 20.16.0. Make sure you have this version installed for compatibility:

```bash
node -v
```
