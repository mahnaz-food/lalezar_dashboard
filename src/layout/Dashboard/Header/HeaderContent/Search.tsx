// material-ui
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';

// assets
import { SearchNormal1 } from 'iconsax-react';

interface SearchProps {
  query: string;
  setQuery: (state: string) => void;
}

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

export default function Search({ query, setQuery }: SearchProps) {
  return (
    <Box sx={{ ml: { xs: 0, md: 2 } }}>
      <FormControl sx={{ width: { xs: '100%', md: 224 } }}>
        <OutlinedInput
          id="header-search"
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchNormal1 size={16} />
            </InputAdornment>
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-describedby="header-search-text"
          inputProps={{ 'aria-label': 'weight' }}
          placeholder="Search..."
          sx={{ '& .MuiOutlinedInput-input': { p: 1.5 } }}
        />
      </FormControl>
    </Box>
  );
}
