type SearchResultProps = {
  result: {
    avatar: string;
    username: string;
    fullname: string;
  };
};
export const SearchResult = ({ result }: SearchResultProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img src={result.avatar} alt={result.username} className="w-10 h-10 rounded-full" />
      </div>
      <div className="flex flex-col">
        <p className="font-medium text-sm font-inter not-italic leading-[20px] align-middle tracking-[0%]">{result.username}</p>
        <p>{result.fullname}</p>
      </div>
    </div>
  );
};
