import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import style from './SearchBar.module.css';

interface SearchBarProps {
  title: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ title }) => {
  return (
    <div className={style.searchBar}>
      <input className="input" type="text" placeholder={title} />
      <button className="button">
        <SearchIcon />
      </button>
    </div>
  );
};

export default SearchBar;
