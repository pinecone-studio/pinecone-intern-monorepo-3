'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

interface PostProps {
  id: string;
  user: {
    id: string;
    username: string;
    fullname: string;
    profilePicture: string;
  };
  images: string[];
  caption: string;
  likes: Array<{
    id: string;
    username: string;
  }>;
  comments: Array<{
    id: string;
    content: string;
    user: {
      id: string;
      username: string;
    };
    createdAt: string;
  }>;
  createdAt: string;
}

export const Post = ({ id, user, images, caption, likes, comments, createdAt }: PostProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');

  // GraphQL mutations
  const [likePost] = useMutation(gql`
    mutation LikePost($postId: ID!) {
      likePost(postId: $postId) {
        id
        likes {
          id
          username
        }
      }
    }
  `);

  const [addComment] = useMutation(gql`
    mutation AddComment($input: AddCommentInput!) {
      addComment(input: $input) {
        id
        content
        user {
          id
          username
        }
        createdAt
      }
    }
  `);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleLike = async () => {
    try {
      await likePost({
        variables: { postId: id },
      });
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    if (commentText.trim()) {
      try {
        await addComment({
          variables: {
            input: {
              postId: id,
              content: commentText.trim(),
            },
          },
        });
        setCommentText('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white text-sm font-medium">
            {user.profilePicture ? <img src={user.profilePicture} alt={user.username} className="w-full h-full rounded-full object-cover" /> : user.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{user.username}</p>
            <p className="text-xs text-gray-500">{formatTimeAgo(createdAt)}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Post Images */}
      <div className="relative aspect-square bg-gray-100">
        {images.length > 0 ? (
          <>
            <img src={images[currentImageIndex]} alt={`Post by ${user.username}`} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    ‹
                  </button>
                )}
                {currentImageIndex < images.length - 1 && (
                  <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    ›
                  </button>
                )}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {images.map((_, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">No image</p>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-3">
          <button onClick={handleLike} className={`${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}>
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Send className="w-6 h-6" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 ml-auto">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Likes */}
        <p className="font-medium text-sm mb-2">{likes.length > 0 ? `${likes.length} like${likes.length > 1 ? 's' : ''}` : 'No likes yet'}</p>

        {/* Caption */}
        {caption && (
          <p className="text-sm mb-2">
            <span className="font-medium">{user.username}</span> {caption}
          </p>
        )}

        {/* Comments */}
        {comments.length > 0 && (
          <p className="text-xs text-gray-500 mb-3">
            View all {comments.length} comment{comments.length > 1 ? 's' : ''}
          </p>
        )}

        {/* Time */}
        <p className="text-xs text-gray-400 mb-3">{formatTimeAgo(createdAt).toUpperCase()}</p>

        {/* Add Comment */}
        <div className="flex items-center space-x-2 mt-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input type="text" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="flex-1 text-sm border-none outline-none bg-transparent" />
          <button onClick={handleComment} disabled={!commentText.trim()} className="text-blue-500 font-medium text-sm disabled:opacity-50">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
