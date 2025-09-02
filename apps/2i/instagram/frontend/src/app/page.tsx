'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Sidebar } from '@/_components/Sidebar/Sidebar';
import { Stories } from '@/_components/Stories/Stories';
import { Post } from '@/_components/Post/Post';
import { Suggestions } from '@/_components/Suggestions/Suggestions';

interface PostData {
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

const Page = () => {
  // GraphQL query
  const { data, loading, error, refetch } = useQuery(gql`
    query GetPosts {
      getPosts {
        id
        images
        caption
        user {
          id
          username
          fullname
          profilePicture
        }
        likes {
          id
          username
        }
        comments {
          id
          content
          user {
            id
            username
          }
          createdAt
        }
        createdAt
      }
    }
  `);

  const posts = data?.getPosts || [];

  // Function to refresh posts after creating a new one
  const handlePostCreated = () => {
    refetch();
  };

  return (
    <div data-cy="home-page" className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-12 gap-0">
        {/* Left Sidebar - Navigation */}
        <div className="col-span-3">
          <Sidebar onPostCreated={handlePostCreated} />
        </div>

        {/* Main Content Area */}
        <div className="col-span-6">
          <div className="max-w-2xl mx-auto py-6">
            {/* Stories Section - Highlighted */}
            <div className="mb-8">
              <Stories />
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading posts...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">Error loading posts: {error.message}</p>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post: PostData) => <Post key={post.id} {...post} />)
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Suggestions */}
        <div className="col-span-3">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Page;
