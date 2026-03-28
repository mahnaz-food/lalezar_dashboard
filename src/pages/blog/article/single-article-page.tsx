import { useGetArticleBySlugQuery } from 'hooks/api/blog/blogHooks';
import { useParams } from 'react-router';
import ArticleForm from './ArticleForm';


export default function SingleArticlePage() {
  const { slug } = useParams();
  const { data: article, isLoading } = useGetArticleBySlugQuery({ slug });

  return (
    <>
      <ArticleForm article={article} isLoading={isLoading} slug={slug} />
    </>
  );
}
