'use client';

import { useGetSearchResultsQuery } from '@/generated';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SearchResult } from './SearchResult';

interface SearchPanelProps {
  isVisible: boolean;
}

type resultType = {
  username: string;
  fullname: string;
  avatar: string;
};

//const mockUsers = ['john_doe', 'jane_smith', 'alexander_123', 'choco_mochi', 'tech_lover', 'hello_world', 'coding_queen', 'nasa_fan', 'foodie_guy', 'mountain_goat'];

export const SearchPanel = ({ isVisible }: SearchPanelProps) => {
  const { data } = useGetSearchResultsQuery();
  console.log(data, 'data from search panel');

  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<resultType[]>([]);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredResults([]);
      return;
    }

    const users = data?.getSearchResults ?? [];

    const results =
      users
        .filter((user) => user?.username?.toLowerCase().includes(query.toLowerCase()))
        .map((user) => ({
          username: user?.username ?? '',
          fullname: user?.fullname ?? '',
          avatar: user?.profilePicture ?? '',
        })) ?? [];

    setFilteredResults(results);
  }, [query, data]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-20 top-0 w-80 h-screen border-r border-gray-200 bg-white p-4 z-10"
        >
          <h2 className="text-lg font-semibold mb-4">Search</h2>
          <input type="text" placeholder="Search..." className="w-full border rounded-md p-2" value={query} onChange={(e) => setQuery(e.target.value)} />

          <div className="mt-4">
            {filteredResults.length > 0 ? (
              <ul className="space-y-2">
                {filteredResults.map((result, index) => (
                  <li key={index} className="text-gray-800 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
                    <SearchResult result={result} />
                  </li>
                ))}
              </ul>
            ) : query ? (
              <div className="text-gray-500">No results found.</div>
            ) : (
              <div className="text-gray-500">No recent searches.</div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
