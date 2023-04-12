import Head from "next/head";

const HeadTag = () => (
  <Head>
    <title>Open Data Monitor</title>
    <meta name="description" content="A feed of open government data diffs" />
    <link rel="icon" href="/favicon.ico" />
    <meta property="og:title" content="Open Data Monitor" />
    <meta property="og:site_name" content="Open Data Monitor" />
    <meta property="og:url" content="https://open-data-monitor.splitgraph.io" />
    <meta
      property="og:description"
      content="Newsfeed for tracking added and deleted datasets across hundreds of government open data portals. Made by Splitgraph, powered by Seafowl."
    />
    <meta property="og:type" content="website" />
    <meta
      property="og:image"
      content="https://open-data-monitor.splitgraph.io/open-data-monitor-og-image.png"
    />
    <meta
      property="og:image:alt"
      content="Open Data Monitor Newsfeed - Track new and deleted datasets on hundreds of government data portals"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  </Head>
);

export default HeadTag;
