This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3008](http://localhost:3008) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Inter](https://vercel.com/font).

### Run the prisma studio:

```bash
npx prisma studio
```

After making any changes in db schema in `prisma/schema.prisma` file, run the following command:

```bash
npx prisma generate
```

and to push the changes to the database, run

```bash
npx prisma db push
```

### Stripe CLI & Webhooks:

If Stripe CLI is not installed, run the command:

```bash
brew install stripe/stripe-cli/stripe
```

Login to Stripe CLI:

```bash
stripe login
```

Get the webhook signing secret, run the command:

```bash
stripe listen --forward-to localhost:3008/api/webhook
```

Trigger events with CLI:

```bash
stripe trigger <event>
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
