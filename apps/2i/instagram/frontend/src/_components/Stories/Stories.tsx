'use client';

export const Stories = () => {
  const stories = [
    { id: 1, username: 'User 1', avatar: 'U1' },
    { id: 2, username: 'User 2', avatar: 'U2' },
    { id: 3, username: 'User 3', avatar: 'U3' },
    { id: 4, username: 'User 4', avatar: 'U4' },
    { id: 5, username: 'User 5', avatar: 'U5' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 mb-8 shadow-lg border-2 border-purple-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Stories</h2>
      <div className="flex space-x-6 overflow-x-auto">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-3 flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-white p-1">
                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-700">{story.avatar}</div>
              </div>
            </div>
            <span className="text-sm text-gray-700 font-medium">{story.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
