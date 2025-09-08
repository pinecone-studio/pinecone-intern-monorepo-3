// components/Loader.tsx
'use client';

import React from 'react';

 export const Loader = () => {
  return (
    <div className="w-12 h-12 relative rounded-full animate-rotate">
      <div className="absolute inset-0 rounded-full border-4 border-white animate-prixClipFix"></div>

      <style jsx>{`
        @keyframes rotate {
          100% { transform: rotate(360deg); }
        }

        @keyframes prixClipFix {
          0%   { clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0); }
          25%  { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0); }
          50%  { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%); }
          75%  { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%); }
          100% { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0); }
        }

        .animate-rotate {
          animation: rotate 1s linear infinite;
        }

        .animate-prixClipFix {
          animation: prixClipFix 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

// export default Loader;


// import Loader from '@/components/Loader';

// export default function Example() {
//   const [loading, setLoading] = React.useState(true);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-900">
//       {loading && <Loader />}
//     </div>
//   );
// }
