import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts(): JSX.Element {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main>
        <div>
          <a>
            <time>12 de março de 2021</time>

            <strong>Creating a Monorepo with Lerna & Yarn workspace</strong>

            <p>Is the guide</p>
          </a>
        </div>
      </main>
    </>
  );
}
