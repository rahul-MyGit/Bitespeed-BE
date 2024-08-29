# Identity Reconciliation Service

This service provides an API endpoint for identifying and consolidating customer contacts across multiple purchases.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/rahul-MyGit/Bitespeed-BE.git
   cd Bitespeed-BE
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env` and update the `DATABASE_URL` with your database connection string

4. Run Prisma migrations:
   ```
   npx prisma migrate dev --name init
   ```

5. Build the TypeScript code:
   ```
   npm run build
   ```

6. Start the server:
   ```
   npm start
   ```

## API Endpoint

POST /api/identify

Request body:
```json
{
  "email": "string | null",
  "phoneNumber": "string | null"
}
```

Response:
```json
{
  "contact": {
    "primaryContactId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}
```

## Deployment

This service is deployed on Render.com. You can access the live API at:
