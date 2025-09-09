'use client';
import { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLikePostMutation, useAddCommentMutation, GetPostsDocument } from '@/generated';

export const PostCard = ({ post }: { post: any }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [likePost] = useLikePostMutation({
    refetchQueries: [{ query: GetPostsDocument }],
  });

  const [addComment] = useAddCommentMutation({
    refetchQueries: [{ query: GetPostsDocument }],
  });

  const handleLike = async () => {
    try {
      await likePost({ variables: { postId: post.id } });
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment({ variables: { postId: post.id, text: commentText } });
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg mb-6 max-w-2xl mx-auto">
      {/* Header - Instagram style */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {post.user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="ml-3">
            <p className="font-semibold text-sm">{post.user.username || 'defavours'}</p>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Image Carousel - Instagram style */}
      <div className="relative">
        <img src={post.images[currentImageIndex]} alt={`Post by ${post.user.username}`} className="w-full aspect-square object-cover" />

        {/* Navigation arrows for multiple images */}
        {post.images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image dots indicator - Instagram style */}
        {post.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {post.images.map((_: any, index: number) => (
              <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`} />
            ))}
          </div>
        )}
      </div>

      {/* Actions - Instagram style */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button onClick={handleLike} className="flex items-center hover:opacity-70">
              <Heart fill={isLiked ? '#ef4444' : 'none'} stroke={isLiked ? '#ef4444' : 'currentColor'} className="w-6 h-6" />
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center hover:opacity-70">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="flex items-center hover:opacity-70">
              <Share className="w-6 h-6" />
            </button>
          </div>
          <button className="hover:opacity-70">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        <p className="font-semibold text-sm mb-1">{post.likes?.length || 0} likes</p>

        {/* Caption - Instagram style */}
        {post.caption && (
          <p className="text-sm mb-2">
            <span className="font-semibold">{post.user.username || 'defavours'}</span> {post.caption}
          </p>
        )}

        {/* Comments - Instagram style */}
        {post.comments && post.comments.length > 0 && (
          <div className="mb-2">
            {post.comments.slice(0, showComments ? post.comments.length : 2).map((comment: any, index: number) => (
              <p key={comment.id} className="text-sm mb-1">
                <span className="font-semibold">{comment.user?.username || 'user'}</span> {comment.text}
              </p>
            ))}
            {post.comments.length > 2 && !showComments && (
              <button onClick={() => setShowComments(true)} className="text-gray-500 text-sm">
                View all {post.comments.length} comments
              </button>
            )}
          </div>
        )}

        {/* Comment form - Instagram style */}
        <form onSubmit={handleComment} className="flex items-center mt-2 pt-2 border-t border-gray-100">
          <input type="text" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="flex-1 text-sm border-none outline-none bg-transparent" />
          <button type="submit" className="text-blue-500 font-semibold text-sm hover:text-blue-700" disabled={!commentText.trim()}>
            Post
          </button>
        </form>
      </div>
    </div>
  );
};
