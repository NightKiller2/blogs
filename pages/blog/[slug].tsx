import Button from "@/components/Button";
import blogStyles from "@/styles/blog.module.css";
import { POST_PATH, postPaths } from "@/utils/mdx";
import { readFileSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Image from "next/image";
import Link from "next/link";
import path from "path";

const components = {
  Button: Button,
};

interface FrontMatter {
  title: string;
  description: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
}

const BlogPost: NextPage<{
  source: MDXRemoteSerializeResult;
  frontMatter: FrontMatter;
}> = ({ source, frontMatter }) => {
  console.log(frontMatter);

  return (
    <>
      <div className="mt-36 px-8 text-neutral-300 sm:px-[17vw]">
        <Link
          href="/blog"
          className="text-neutral-300 transition-all hover:text-white"
        >
          <p className="mb-4">&larr; Back</p>
        </Link>
        <h1 className="text-4xl font-semibold text-white">
          {frontMatter.title}
        </h1>
        <p className="mt-4">{frontMatter.description}</p>
        <div className="mt-4 flex items-center">
          <Image
            src={frontMatter.author.avatar}
            alt={frontMatter.author.name}
            width={30}
            height={30}
            className="h-10 w-10 rounded-full"
          />
          <div className="ml-4">
            <p className="text-neutral-300">{frontMatter.author.name}</p>
            <p className="text-sm text-neutral-400">{frontMatter.date}</p>
          </div>
        </div>
        <div className="mb-4 flex gap-1 border-b border-b-neutral-500 pb-4">
          {frontMatter.tags.map((tag) => (
            <p
              key={tag}
              className="mt-4 rounded-full border border-neutral-500 px-2 py-1 text-xs text-neutral-300"
            >
              {tag}
            </p>
          ))}
        </div>
      </div>

      <main
        className={`markdown px-8 text-neutral-300 sm:px-[17vw] ${blogStyles.markdown}`}
      >
        <MDXRemote {...source} components={components} />
      </main>
    </>
  );
};

export default BlogPost;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postFilePath = path.join(POST_PATH, `${params?.slug}.mdx`);
  const source = readFileSync(postFilePath);

  const { content, data } = matter(source);

  const mdxSource = await serialize(content, { scope: data });

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  };
};

export const getStaticPaths = async () => {
  const paths = postPaths
    .map((path) => path.replace(/\.mdx?$/, ""))
    .map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};
