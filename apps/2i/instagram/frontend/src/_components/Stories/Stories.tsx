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
    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex space-x-4 overflow-x-auto">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-2 flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 p-0.5">
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">{story.avatar}</div>
              </div>
            </div>
            <span className="text-xs text-gray-600">{story.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
