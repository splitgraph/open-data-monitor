# Open Data Monitor

Ever wanted to know which Socrata datasets are added/removed over time? Now you can.

Powered by Splitgraph's regularly updated [Socrata catalog](https://www.splitgraph.com/splitgraph/socrata) and the [DDN](https://www.splitgraph.com/docs/query/ddn) [HTTP API](https://www.splitgraph.com/docs/query/ddn-http).

## How to use

Default dates are usually a recent-ish date + a few days before that. Adjust date range as you desire.
The slider axis goes from newer to older, left to right.

- Data fetching + caching via SWR
- Parameterized SQL query based on slider dates
- SSR data fetching
- Dark mode based on host setting

## Socrata update regularity

Generally the Socrata catalog is updated four times a day.

## How it's made

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
