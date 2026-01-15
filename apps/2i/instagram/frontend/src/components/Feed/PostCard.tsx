'use client';

import { useState } from 'react';
import { useLikePostMutation, useUnlikePostMutation } from '@/generated';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    user: {
      id: string;
      username: string;
      fullname: string;
      profilePicture?: string;
    };
    images: string[];
    caption: string;
    likes: Array<{ id: string; username: string }>;
    comments: Array<{
      id: string;
      user: { id: string; username: string };
      text: string;
      createdAt: string;
    }>;
    createdAt: string;
  };
}

export const PostCard = ({ post }: PostCardProps) => {
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePost({ variables: { postId: post.id } });
        setIsLiked(false);
      } else {
        await likePost({ variables: { postId: post.id } });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const nextImage = () => {
    if (currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            {post.user.profilePicture ? (
              <img src={post.user.profilePicture} alt={post.user.username} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <span className="text-gray-600 text-sm">{post.user.username[0]}</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">{post.user.username}</p>
            <p className="text-gray-500 text-xs">{post.user.fullname}</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </div>

      {/* Images */}
      <div className="relative">
        <img src={post.images[currentImageIndex]} alt={`Post by ${post.user.username}`} className="w-full aspect-square object-cover" />

        {post.images.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1">
                ‹
              </button>
            )}
            {currentImageIndex < post.images.length - 1 && (
              <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1">
                ›
              </button>
            )}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {post.images.map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-3">
          <button onClick={handleLike} className="flex items-center space-x-1">
            <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
          </button>
          <MessageCircle className="w-6 h-6 text-gray-700" />
          <Share className="w-6 h-6 text-gray-700" />
        </div>

        <p className="font-semibold text-sm mb-1">{post.likes.length} likes</p>

        {post.caption && (
          <p className="text-sm mb-2">
            <span className="font-semibold mr-2">{post.user.username}</span>
            {post.caption}
          </p>
        )}

        {post.comments.length > 0 && (
          <div className="space-y-1">
            {post.comments.slice(0, 2).map((comment) => (
              <p key={comment.id} className="text-sm">
                <span className="font-semibold mr-2">{comment.user.username}</span>
                {comment.text}
              </p>
            ))}
            {post.comments.length > 2 && <p className="text-gray-500 text-sm">View all {post.comments.length} comments</p>}
          </div>
        )}

        <p className="text-gray-500 text-xs mt-2">{new Date(post.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};
