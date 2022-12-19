import Head from "next/head";
import Header from "../components/header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../type";
import Link from "next/link";

interface Props {
    posts: [Post];
}

export default function Home({ posts }: Props) {
    return (
        <>
            <div>
                <Head>
                    <title>Medium Blog</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <Header />

                <div className="flex justify-between items-center bg-yellow-450 py-10 lg:py-0 border border-black">
                    <div className="px-10 space-y-5">
                        <h1 className="font-serif text-black text-7xl max-w-xl">
                            <span className="underline decoration-black text-black decoration-4">
                                Medium{" "}
                            </span>{" "}
                            is a place to Write, Read and Connect
                        </h1>
                        <h2 className="text-black">
                            It&apos;s easy and free to post your thinking and connect to millions of
                            people.
                        </h2>
                    </div>
                    <div>
                        <img
                            className="hidden md:inline-flex h-32 lg:h-[455px]"
                            src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
                            alt="M"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:p-6 p-2 md:gap-6">
                    {posts.map((post) => (
                        <Link key={post._id} href={`/post/${post.slug.current}`}>
                            <div className="mx-auto">
                                <img
                                    className="rounded-md"
                                    src={urlFor(post.mainImage).url()!}
                                    alt="SlugImg"
                                />
                                <div className="flex justify-between p-3 items-center">
                                    <div>
                                        <p className="font-bold">{post.title}</p>
                                        <p className="text-sm">{post.description}</p>
                                    </div>

                                    <img
                                        className="w-12 h-12 rounded-full"
                                        src={urlFor(post.author.image).url()!}
                                        alt="author"
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

export const getServerSideProps = async () => {
    const query = `*[_type == "post"]{
  _id,
    title,
    description,
    author -> {
      name,
      image
    },
    slug,
    mainImage{
          asset->{
          _id,
          url
        }
      },
    body
}`;

    const posts = await sanityClient.fetch(query);

    return {
        props: {
            posts,
        },
    };
};
