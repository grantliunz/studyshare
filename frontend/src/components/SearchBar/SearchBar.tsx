import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import './SearchBar.css';

interface SearchBarProps {
  title: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ title }) => {
  return (
    <div className="search-bar">
      <input className="input" type="text" placeholder={title} />
      <button className="button">
        <SearchIcon />
      </button>
    </div>
  );
};

export default SearchBar;
