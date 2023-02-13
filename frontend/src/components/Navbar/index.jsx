import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import './styles.css'


export default function Navbar() {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'))
    const [anchorEl, setAnchorEl] = React.useState(null);


    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const Logout = ()=>{
        localStorage.clear()
        navigate("/login")
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Order Management System
                    </Typography>
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <p>
                                {user?.user?.email}
                            </p>
                        </Menu>
                        <IconButton
                            size="large"
                            aria-label="display more actions"
                            edge="end"
                            color="inherit"
                            onClick={Logout}
                        >
                            <Tooltip title="Logout">
                                <LogoutIcon />
                            </Tooltip>
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}