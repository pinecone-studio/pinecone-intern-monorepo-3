'use client';
import { useGetPostsQuery } from '@/generated';
import { PostCard } from './PostCard';

export const Feed = () => {
  const { data, loading, error } = useGetPostsQuery();

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="flex justify-center p-8 text-red-500">Error: {error.message}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {data?.getPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
