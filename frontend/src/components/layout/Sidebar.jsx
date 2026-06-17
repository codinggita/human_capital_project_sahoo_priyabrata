import React from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHome, FiBarChart2, FiGlobe, FiSettings, FiUsers, FiDatabase, FiZap } from 'react-icons/fi';
import { setSidebarOpen } from '../../features/uiSlice';
import { motion } from 'framer-motion';

const drawerWidth = 264;

const menuItems = [
  { text: 'Dashboard',  icon: <FiHome size={18} />,     path: '/dashboard', color: '#3b82f6' },
  { text: 'Analytics',  icon: <FiBarChart2 size={18} />, path: '/analytics', color: '#8b5cf6' },
  { text: 'Data Grid',  icon: <FiDatabase size={18} />,  path: '/data',      color: '#06b6d4' },
  { text: 'Users',      icon: <FiUsers size={18} />,     path: '/users',     color: '#10b981' },
  { text: 'Countries',  icon: <FiGlobe size={18} />,     path: '/countries', color: '#f59e0b' },
  { text: 'Settings',   icon: <FiSettings size={18} />,  path: '/settings',  color: '#ec4899' },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen, themeMode } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const isDark = themeMode === 'dark';

  const handleDrawerToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };

  /* ── shadow tokens (mode-aware) ── */
  const outerShadow = isDark
    ? '4px 4px 10px rgba(0,0,0,0.6), -2px -2px 6px rgba(255,255,255,0.04)'
    : '4px 4px 8px #b8c1cf, -4px -4px 8px #ffffff';

  const activeShadow = isDark
    ? 'inset 3px 3px 7px rgba(0,0,0,0.55), inset -2px -2px 5px rgba(255,255,255,0.04)'
    : 'inset 4px 4px 8px #b8c1cf, inset -4px -4px 8px #ffffff';

  const visibleMenuItems = menuItems.filter(
    (item) => item.path !== '/users' || user?.role === 'admin'
  );

  const drawer = (
    <Box sx={{ px: 2, py: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ mb: 1 }} />

      {/* ── Nav section label ── */}
      <Typography
        sx={{
          fontSize: '0.58rem',
          fontWeight: 800,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'text.secondary',
          px: 1.5,
          mb: 2,
          mt: 0.5,
        }}
      >
        Navigation
      </Typography>

      <List sx={{ flex: 1 }}>
        {visibleMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <motion.div
              style={{ width: '100%' }}
              whileHover={{ x: 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={() => { if (window.innerWidth < 600) handleDrawerToggle(); }}
                sx={{
                  borderRadius: '18px',
                  py: 1.4,
                  px: 2,
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  position: 'relative',
                  overflow: 'hidden',

                  /* default — raised neumorphic */
                  bgcolor: 'transparent',
                  boxShadow: outerShadow,
                  border: isDark
                    ? '1px solid rgba(255,255,255,0.05)'
                    : '1px solid rgba(0,0,0,0.04)',

                  '&.active': {
                    bgcolor: 'transparent',
                    boxShadow: activeShadow,
                    border: isDark ? `1px solid ${item.color}22` : 'none',
                    '& .MuiListItemIcon-root': { color: item.color },
                    '& .MuiListItemText-primary': { color: item.color },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '15%',
                      bottom: '15%',
                      width: 3,
                      borderRadius: '0 3px 3px 0',
                      background: item.color,
                      boxShadow: isDark ? `0 0 10px ${item.color}` : 'none',
                    },
                  },

                  '&:hover:not(.active)': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.01)',
                    boxShadow: isDark
                      ? `6px 6px 14px rgba(0,0,0,0.65), -3px -3px 8px rgba(255,255,255,0.05), 0 0 20px ${item.color}20`
                      : '6px 6px 14px #b8c1cf, -6px -6px 14px #ffffff',
                    '& .MuiListItemIcon-root': { color: item.color },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'text.secondary',
                    minWidth: 40,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        letterSpacing: '-0.01em',
                        color: 'inherit',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </motion.div>
          </ListItem>
        ))}
      </List>

      {/* ── Footer branding ── */}
      <Box
        sx={{
          mx: 1,
          mb: 2,
          p: 2,
          borderRadius: '18px',
          background: isDark
            ? 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))'
            : 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(124,58,237,0.06))',
          border: isDark
            ? '1px solid rgba(59,130,246,0.15)'
            : '1px solid rgba(37,99,235,0.12)',
          boxShadow: isDark
            ? 'inset 2px 2px 5px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(255,255,255,0.10)'
            : 'inset 2px 2px 5px #b8c1cf, inset -2px -2px 5px #ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <FiZap size={13} color="#3b82f6" />
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#3b82f6', letterSpacing: '0.04em' }}>
            HC Analytics
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 600, lineHeight: 1.4 }}>
          Enterprise Intelligence v2.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
