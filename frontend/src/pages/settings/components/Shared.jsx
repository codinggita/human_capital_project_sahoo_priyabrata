/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Box, Typography, Switch, Chip, Tooltip, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { FiMonitor, FiLogOut } from 'react-icons/fi';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export const SectionHeader = ({ icon, title, subtitle, accentColor = '#ff6038' }) => {
  const { themeMode, appearance } = useSelector((s) => s.ui);
  const isDark = themeMode === 'dark';
  const isNeu = appearance?.neumorphism !== false;
  const isCompact = appearance?.density === 'compact';

  return (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: isCompact ? 1.5 : 2, mb: isCompact ? 2 : 3 }}>
    <Box
      sx={{
        width: isCompact ? 36 : 42, height: isCompact ? 36 : 42, borderRadius: isCompact ? '10px' : '14px',
        background: isNeu ? 'transparent' : `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`,
        border: isNeu ? 'none' : `1px solid ${accentColor}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accentColor, fontSize: isCompact ? 16 : 18,
        boxShadow: isNeu ? (isDark ? 'inset 3px 3px 6px #0c0f16, inset -3px -3px 6px #1e2536' : 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff') : `0 0 16px ${accentColor}22`,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h6" fontWeight="800" sx={{ letterSpacing: '-0.01em', lineHeight: 1.2, fontSize: isCompact ? '1.1rem' : '1.25rem' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
  );
};

export const ToggleRow = ({ icon, title, subtitle, checked, onChange, accentColor = '#ff6038' }) => {
  const { themeMode, appearance } = useSelector((s) => s.ui);
  const isDark = themeMode === 'dark';
  const isNeu = appearance?.neumorphism !== false;
  const isCompact = appearance?.density === 'compact';

  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        p: isCompact ? 1.25 : 2, borderRadius: isCompact ? '12px' : '16px',
        background: isNeu ? 'transparent' : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.015)'),
        border: isNeu ? 'none' : '1px solid', 
        borderColor: isNeu ? 'transparent' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
        boxShadow: isNeu ? (isDark ? 'inset 4px 4px 8px #080c16, inset -4px -4px 8px #1e2536' : 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff') : 'none',
        mb: isCompact ? 1 : 1.5, cursor: 'pointer',
        '&:hover': {
          background: isNeu ? 'transparent' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
          borderColor: isNeu ? 'transparent' : `${accentColor}33`,
          boxShadow: isNeu ? (isDark ? 'inset 5px 5px 10px #080c16, inset -5px -5px 10px #1e2536' : 'inset 5px 5px 10px #c8d0e0, inset -5px -5px 10px #ffffff') : `0 0 0 1px ${accentColor}22`,
        },
        transition: 'all 0.2s ease',
      }}
      onClick={() => onChange()}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: isCompact ? 1.5 : 2, flex: 1, minWidth: 0 }}>
        <Box sx={{
          color: accentColor, fontSize: isCompact ? 16 : 18, display: 'flex', flexShrink: 0,
          width: isCompact ? 30 : 34, height: isCompact ? 30 : 34, borderRadius: isCompact ? '8px' : '10px',
          background: `${accentColor}18`,
          alignItems: 'center', justifyContent: 'center',
        }}>{icon}</Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight="700" noWrap>{title}</Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{subtitle}</Typography>
          )}
        </Box>
      </Box>
      <Switch
        disableRipple
        checked={checked}
        onChange={(e) => { e.stopPropagation(); onChange(); }}
        onClick={(e) => e.stopPropagation()}
        sx={{
          flexShrink: 0,
          width: isCompact ? 40 : 48,
          height: isCompact ? 22 : 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: '2px',
            transitionDuration: '300ms',
            color: '#fff',
            '&.Mui-checked': {
              transform: isCompact ? 'translateX(18px)' : 'translateX(22px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: accentColor,
                opacity: 1,
                border: 0,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
            width: isCompact ? 18 : 22,
            height: isCompact ? 18 : 22,
          },
          '& .MuiSwitch-track': {
            borderRadius: 13,
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            opacity: 1,
            transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          },
        }}
      />
    </Box>
  );
};

export const SessionCard = ({ device, location, time, current, isDark, isNeu, onRevoke }) => {
  const { appearance } = useSelector((s) => s.ui);
  const isCompact = appearance?.density === 'compact';
  
  return (
  <Box
    sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      p: isCompact ? 1.5 : 2, borderRadius: isCompact ? '12px' : '14px', mb: isCompact ? 1 : 1.5,
      background: isNeu ? 'transparent' : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.015)'),
      border: isNeu ? 'none' : '1px solid', 
      borderColor: isNeu ? 'transparent' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
      boxShadow: isNeu ? (isDark ? 'inset 4px 4px 8px #080c16, inset -4px -4px 8px #1e2536' : 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff') : 'none',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: isCompact ? 1.5 : 2 }}>
      <Box
        sx={{
          width: isCompact ? 32 : 38, height: isCompact ? 32 : 38, borderRadius: isCompact ? '8px' : '10px',
          background: current ? 'linear-gradient(135deg, #4caf5022, #4caf5044)' : 'rgba(0,0,0,0.05)',
          border: `1px solid ${current ? '#4caf5044' : 'transparent'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: current ? '#4caf50' : 'text.secondary', fontSize: isCompact ? 14 : 16,
        }}
      >
        <FiMonitor />
      </Box>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight="700">{device}</Typography>
          {current && (
            <Chip label="Current" size="small" sx={{
              height: 18, fontSize: '0.65rem', fontWeight: 800,
              bgcolor: '#4caf5022', color: '#4caf50', border: '1px solid #4caf5044',
            }} />
          )}
        </Box>
        <Typography variant="caption" color="text.secondary">
          {location} · {time}
        </Typography>
      </Box>
    </Box>
    {!current && (
      <Tooltip title="Revoke session">
        <IconButton size="small" onClick={onRevoke} sx={{ color: '#f44336', '&:hover': { bgcolor: '#f4433614' } }}>
          <FiLogOut size={15} />
        </IconButton>
      </Tooltip>
    )}
  </Box>
  );
};

const sparkData = [40, 55, 45, 60, 58, 72, 68, 80, 76, 90, 85, 95];
export const MiniSpark = ({ color = '#ff6038' }) => (
  <ResponsiveContainer width="100%" height={40}>
    <LineChart data={sparkData.map((v, i) => ({ v, i }))}>
      <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

export const getSectionCardSx = (isDark, isNeu, glassIntensity, density) => {
  const isCompact = density === 'compact';
  return {
    p: isCompact ? 3 : 4, borderRadius: isCompact ? '20px' : '28px',
    boxShadow: isNeu
      ? (isDark ? '9px 9px 18px #0c0f16, -9px -9px 18px #1e2536' : '8px 8px 16px #b8c1cf, -8px -8px 16px #ffffff')
      : (isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)'),
    bgcolor: isNeu 
      ? (isDark 
          ? `rgba(21, 26, 38, ${1 - (glassIntensity / 100) * 0.4})`
          : `rgba(230, 236, 245, ${1 - (glassIntensity / 100) * 0.4})`)
      : (isDark 
          ? `rgba(21, 26, 38, ${1 - (glassIntensity / 100) * 0.4})`
          : `rgba(255, 255, 255, ${1 - (glassIntensity / 100) * 0.4})`),
    backdropFilter: `blur(${(glassIntensity / 100) * 16}px)`,
    WebkitBackdropFilter: `blur(${(glassIntensity / 100) * 16}px)`,
    border: isNeu ? 'none' : '1px solid', 
    borderColor: isNeu ? 'transparent' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)'),
  };
};

export const getTextFieldSx = (isDark, isNeu) => {
  const inputShadow = isNeu
    ? (isDark ? 'inset 2px 2px 5px #080c16, inset -2px -2px 5px #16223e' : 'inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff')
    : 'none';
  return {
    '& .MuiOutlinedInput-root': {
      borderRadius: '14px', boxShadow: inputShadow,
      '& fieldset': { border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { border: `1.5px solid #ff603888` },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#ff6038' },
  };
};
