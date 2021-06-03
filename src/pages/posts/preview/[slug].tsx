/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import { getSession, useSession } from 'next-auth/client';
import { RichText } from 'prismic-dom';
import Head from 'next/head';
import Link from 'next/link';

import { useEffect } from 'react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import styles from '../post.module.scss';
import { getPrismicClient } from '../../../services/prismic';

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

interface SessionProps extends Session {
  activeSubscription: {
    data: {
      status: string;
    };
  };
}

export default function PostPreview({ post }: PostPreviewProps): JSX.Element {
  const [session] = useSession() as [SessionProps, boolean];
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session, post.slug, router]);

  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>

          <time>{post.updatedAt}</time>

          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('publication', String(slug), {});

  if (!response) {
    return {
      notFound: true,
    };
  }

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.first_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 24, // 1day
  };
};
