import Head from "next/head";

const Page = ({ children, title, description, url, type, image }) => {
  return (
    <>
      <Head>
        <title>{title || "Default Title"}</title>
        <meta
          name="description"
          content={description || "Default description"}
        />

        <meta property="og:url" content={url || "http://localhost:3000"} />
        <meta property="og:type" content={type || "website"} />
        <meta property="og:title" content={title || "Default Title"} />
        <meta
          property="og:description"
          content={description || "Default description"}
        />
        <meta property="og:image" content={image || ""} />
      </Head>
      {children}

    </>
  );
};

export default Page;
