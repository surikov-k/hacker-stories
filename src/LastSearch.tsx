interface LastSearchProps {
  lastSearches: string[];
  onLastSearch: (searchTerm: string) => void;
}

export default function LastSearch({
  lastSearches,
  onLastSearch,
}: LastSearchProps) {
  return (
    <>
      {lastSearches.map((searchTerm, index) => (
        <button
          type="button"
          key={searchTerm + index}
          onClick={() => onLastSearch(searchTerm)}
        >
          {searchTerm}
        </button>
      ))}
    </>
  );
}
