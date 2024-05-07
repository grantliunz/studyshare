import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import style from './SearchBar.module.css';
import { Tooltip } from '@mui/material';

interface SearchBarProps {
  title: string;
  onQueryChange?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props) => {
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (props.onQueryChange) {
      props.onQueryChange(event.target.value);
    }
  }

  return (
    <div className={style.searchBar}>
      <input
        className="input"
        onChange={onChange}
        type="text"
        placeholder={props.title}
      />
      <Tooltip title="Search">
        <button className={style.button}>
          <SearchIcon />
        </button>
      </Tooltip>
    </div>
  );
};

export default SearchBar;
