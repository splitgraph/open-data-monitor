import Head from 'next/head'

export const HeadTag = () =>
  <Head>
    <title>SocFeed</title>
    <meta name="description" content="A feed of Socrata diffs" />
    <link rel="icon" href="/favicon.ico" />
  </Head>