'use client';

export const Suggestions = () => {
  const suggestedUsers = [
    { username: 'Bayanpkh Gantulga', avatar: 'B' },
    { username: 'Ulsnii Tsolmon', avatar: 'U' },
    { username: 'Dkh', avatar: 'D' },
    { username: 'User 4', avatar: 'U4' },
    { username: 'User 5', avatar: 'U5' },
  ];

  return (
    <div className="hidden lg:block w-80 p-6 bg-white border-l border-gray-200">
      {/* Current User Profile */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-medium">A</div>
          <div className="flex-1">
            <p className="font-medium text-sm">admin_</p>
            <p className="text-xs text-gray-500">Admin User</p>
          </div>
          <button className="text-blue-500 text-xs font-medium">Switch</button>
        </div>
      </div>

      {/* Suggestions for you */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Suggestions for you</h3>
          <button className="text-xs text-gray-600 hover:text-gray-900">See all</button>
        </div>

        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.username} className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">{user.avatar}</div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-gray-500">Suggested for you</p>
              </div>
              <button className="text-blue-500 text-xs font-medium">Follow</button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-xs text-gray-400 space-y-2">
        <p>About • Help • Press • API • Jobs • Privacy • Terms • Locations • Language • Meta Verified</p>
        <p>© 2023 Instagram from Meta</p>
      </div>
    </div>
  );
};
