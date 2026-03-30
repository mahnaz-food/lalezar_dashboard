import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { More } from 'iconsax-react';
import { Button } from '@mui/material';

interface TableMobileMenuProps {
  actions: (
    | false
    | {
        key: string;
        render: () => JSX.Element;
        label?: undefined;
        icon?: undefined;
        onClick?: undefined;
        color?: undefined;
      }
    | {
        key: string;
        label: string;
        icon: JSX.Element;
        onClick: () => void;
        render?: undefined;
        color?: undefined;
      }
    | {
        key: string;
        label: string;
        icon: JSX.Element;
        render: () => JSX.Element;
        onClick?: undefined;
        color?: undefined;
      }
    | {
        key: string;
        label: string;
        icon: JSX.Element;
        color: string;
        onClick: () => void;
        render?: undefined;
      }
    | undefined
  )[];
}

const ITEM_HEIGHT = 48;

export default function TableMobileMenu({ actions }: TableMobileMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <More />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '30ch'
            }
          }
        }}
      >
        {actions.map((action: any) => {
          if (action.render) return <MenuItem key={action.key}>{action.render()}</MenuItem>;

          return (
            <MenuItem key={action.key}>
              <Button variant="contained" color={action.color || 'primary'} startIcon={action.icon} onClick={action.onClick}>
                {action.label}
              </Button>
            </MenuItem>
          );
        })}
        {/* {options.map((option) => (
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
            {option}
          </MenuItem>
        ))} */}
      </Menu>
    </div>
  );
}
