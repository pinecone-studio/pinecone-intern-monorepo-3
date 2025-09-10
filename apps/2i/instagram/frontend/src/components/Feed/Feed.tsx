'use client';

import { useGetPostsQuery } from '@/generated';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { useState } from 'react';

export const Feed = () => {
  const { data, loading, error, refetch } = useGetPostsQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="flex justify-center p-8 text-red-500">Error: {error.message}</div>;

  const handlePostCreated = () => {
    refetch();
    setIsCreateModalOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <button onClick={() => setIsCreateModalOpen(true)} className="w-full bg-white border border-gray-300 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600">+</span>
            </div>
            <span className="text-gray-600">What's on your mind?</span>
          </div>
        </button>
      </div>

      <div className="space-y-6">
        {data?.getPosts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onPostCreated={handlePostCreated} />
    </div>
  );
};
