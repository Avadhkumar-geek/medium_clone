/* eslint-disable @next/next/no-img-element */
import { sanityClient, urlFor } from "../../sanity";
import React, { useState } from "react";
import { Post } from "../../type";
import Header from "../../components/header";
import { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import comment from "../../sanity_medium/schemas/comment";

interface Props {
    post: Post;
}

interface formInpt {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

export default function Posts({ post }: Props) {
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<formInpt>();

    const [submit, setSubmit] = useState(false);

    const onSubmit: SubmitHandler<formInpt> = async (data) => {
        await fetch("/api/createComment", {
            method: "POST",
            body: JSON.stringify(data),
        })
            .then(() => {
                setSubmit(true);
            })
            .catch((err) => {
                console.log(err);
                setSubmit(false);
            });
    };

    return (
        <main>
            <Header />
            <img className="h-60 w-full object-cover" src={urlFor(post.mainImage).url()!} alt="" />
            <article className="max-w-3xl mx-auto p-3">
                <h1 className="text-3xl font-sans font-bold">{post.title}</h1>
                <h2 className="font-light mb-3">{post.description}</h2>
                <div className="flex space-x-3 items-center mb-5">
                    <img
                        className="h-10 w-10 rounded-full"
                        src={urlFor(post.author.image).url()!}
                        alt=""
                    />
                    <p className="font-light text-sm">
                        Created by <span className="text-green-600">{post.author.name}</span> at{" "}
                        {new Date(post._createdAt).toLocaleString()}
                    </p>
                </div>
                <PortableText
                    content={post.body}
                    dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                    projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                    serializers={{
                        h2: (props: any) => (
                            <h2 className="text-4xl mb-5 font-bold my-5" {...props} />
                        ),
                        h4: (props: any) => (
                            <h4 className="text-xl font-bold mt-2 mb-1" {...props} />
                        ),
                        normal: (props: any) => <p className="" {...props} />,
                        link: ({ href, children }: any) => (
                            <a href={href} className="text-blue-500">
                                {" "}
                                {children}{" "}
                            </a>
                        ),
                        li: ({ children }: any) => <li className="list-disc mx-10">{children}</li>,
                    }}
                ></PortableText>
            </article>
            <hr className="max-w-lg my-5 border border-yellow-450 mx-auto" />

            {submit ? (
                <h1 className="max-w-3xl bg-yellow-450 py-10 px-5 mx-auto text-3xl text-white font-bold">
                    Thank you for comment!!
                </h1>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-7 mr-auto">Leave your Comment Below!!</h2>
                    <input {...register("_id")} type="hidden" value={post._id} />
                    <div className="mb-3">
                        <label className="text-gray-700 ml-2">Name</label>
                        <input
                            {...register("name", { required: true })}
                            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full mb-3 focus:ring-2 outline-none ring-yellow-450"
                            type="text"
                            placeholder="Name"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="text-gray-700 ml-2">Email</label>
                        <input
                            {...register("email", { required: true })}
                            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full mb-3 focus:ring-2 outline-none ring-yellow-450"
                            type="email"
                            placeholder="Email"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="text-gray-700 ml-2">Comment</label>
                        <textarea
                            {...register("comment", { required: true })}
                            className="shadow border rounded py-2 px-3 form-input mt-1 block w-full mb-3 focus:ring-2 outline-none ring-yellow-450"
                            placeholder="Comment..."
                            rows={8}
                        />
                    </div>
                    <input
                        className="rounded my-1 mb-5 width-full text-white bg-yellow-450 outline-none hover:bg-yellow-600"
                        type="submit"
                    />
                </form>
            )}
            <div className="border border-yellow-450 px-5 my-10 max-w-3xl mx-auto">
                <h3 className="text-3xl my-2 font-bold text-yellow-450 ">Comments</h3>
                <hr className="max-w-lg mb-3 border border-gray-300" />

                {post.comment.map((comment) => (
                    <div key={comment._id}>
                        <p className="my-2">
                            <span className="text-yellow-700">{comment.name}</span>:{" "}
                            {comment.comment}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}

export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
  _id,
  slug{
    current
  }
}`;

    const posts = await sanityClient.fetch(query);

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current,
        },
    }));

    return {
        paths,
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  _createdAt,
    title,
    mainImage,
    description,
  slug{
    current
  },
  "comment" : *[
    _type == "comment" &&
    post._ref == ^._id &&
    approved == true
  ],
  author -> {
    name,
    image
  },
  body
}`;

    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    });

    if (!post) {
        return {
            notFound: true,
        };
    }
    return {
        props: {
            post,
        },
        revalidate: 60,
    };
};
