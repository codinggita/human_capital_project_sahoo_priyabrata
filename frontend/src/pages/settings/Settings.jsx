import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Chip } from '@mui/material';
import SEOMeta from '../../components/common/SEOMeta';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FiInfo, FiActivity, FiMonitor, FiZap, FiShield } from 'react-icons/fi';
import { MiniSpark, getSectionCardSx } from './components/Shared';

import ProfileSettings from './components/ProfileSettings';
import AppearanceSettings from './components/AppearanceSettings';
import NotificationSettings from './components/NotificationSettings';
import AISettings from './components/AISettings';
import HelpOverview from './components/HelpOverview';
import DangerZoneSettings from './components/DangerZoneSettings';

const Settings = () => {
  const { themeMode, appearance } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const isDark = themeMode === 'dark';
  const isNeu = appearance?.neumorphism !== false;
  const isCompact = appearance?.density === 'compact';
  const sectionCard = getSectionCardSx(isDark, isNeu, appearance.glassIntensity, appearance.density);

  const [helpOpen, setHelpOpen] = useState(false);

  const stats = user?.stats || {};
  const apiCalls = stats.apiCallsToday?.toLocaleString() || '0';
  const activeSessions = stats.activeSessions || '0';
  const loginStreak = stats.loginStreak || '0';
  const securityScore = stats.securityScore || '85';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <SEOMeta
        title="Settings & Preferences"
        description="Manage your Human Capital Analytics enterprise account preferences, security, AI settings, and notifications."
        path="/settings"
      />

      {/* ─── PAGE HEADER ─── */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="900" color="primary" sx={{ letterSpacing: '-0.02em', mb: 0.5 }}>
            Account Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your enterprise profile, security, preferences & AI configuration.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="info"
          startIcon={<FiInfo />}
          onClick={() => setHelpOpen(!helpOpen)}
          sx={{
            borderRadius: '24px', px: 3, fontWeight: 800,
            border: isNeu ? 'none' : '1px solid',
            boxShadow: isNeu ? (isDark ? '4px 4px 8px #0c0f16, -4px -4px 8px #1e2536' : '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff') : 'none',
            '&:hover': {
              boxShadow: isNeu ? (isDark ? 'inset 2px 2px 5px #0c0f16, inset -2px -2px 5px #1e2536' : 'inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff') : 'none',
            }
          }}
        >
          {helpOpen ? 'Close Help' : 'Help & Info'}
        </Button>
      </Box>

      {/* ─── ACCOUNT ANALYTICS KPI STRIP ─── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: isCompact ? 2 : 4,
          mb: isCompact ? 3.5 : 5,
          width: '100%',
        }}
      >
        {[
          { label: 'API Calls Today', value: apiCalls, delta: '+12%', color: '#2196f3', icon: <FiActivity /> },
          { label: 'Active Sessions', value: activeSessions, delta: 'Devices', color: '#4caf50', icon: <FiMonitor /> },
          { label: 'Login Streak', value: `${loginStreak} days`, delta: 'Consistent', color: '#ff7b00', icon: <FiZap /> },
          { label: 'Security Score', value: `${securityScore}/100`, delta: 'Strong', color: '#9c27b0', icon: <FiShield /> },
        ].map((kpi, i) => (
          <Paper
            key={i}
            elevation={0}
            component={motion.div}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            sx={{
              ...sectionCard,
              p: isCompact ? 3.5 : 5,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 1.5,
              minHeight: isCompact ? 180 : 230,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography color="text.secondary" fontWeight="800" sx={{ fontSize: '0.9rem' }}>
                {kpi.label}
              </Typography>
              <Box sx={{
                width: 54, height: 54, borderRadius: '16px',
                background: isNeu ? 'transparent' : `${kpi.color}18`, color: kpi.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                boxShadow: isNeu ? (isDark ? 'inset 4px 4px 8px #080c16, inset -4px -4px 8px #1e2536' : 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff') : `0 0 18px ${kpi.color}28`,
              }}>
                {kpi.icon}
              </Box>
            </Box>
            <Typography variant="h3" fontWeight="950" sx={{ letterSpacing: '-0.03em', lineHeight: 1 }}>
              {kpi.value}
            </Typography>
            <Box sx={{ height: 60 }}>
              <MiniSpark color={kpi.color} />
            </Box>
            <Chip label={kpi.delta} size="small" sx={{
              alignSelf: 'flex-start', height: 26, fontSize: '0.78rem', fontWeight: 800,
              bgcolor: isNeu ? 'transparent' : `${kpi.color}18`, color: kpi.color, border: isNeu ? 'none' : `1px solid ${kpi.color}33`,
              boxShadow: isNeu ? (isDark ? 'inset 2px 2px 5px #0c0f16, inset -2px -2px 5px #1e2536' : 'inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff') : 'none',
              px: 1,
            }} />
          </Paper>
        ))}
      </Box>

      {/* ─── LEFT: PROFILE MANAGEMENT & RIGHT: SECURITY & PRIVACY ─── */}
      <ProfileSettings />

      {/* ─── 3-COLUMN PREFERENCE CARDS ROW ─── */}
      <Grid container spacing={isCompact ? 4 : 8} sx={{ mt: isCompact ? 2 : 4 }}>
        <Grid item xs={12} md={4}>
          <AppearanceSettings />
        </Grid>
        <Grid item xs={12} md={4}>
          <NotificationSettings />
        </Grid>
        <Grid item xs={12} md={4}>
          <AISettings />
        </Grid>
      </Grid>

      {/* ─── ABOUT & HELP (FULL WIDTH) ─── */}
      {helpOpen && <HelpOverview />}

      {/* ─── DANGER ZONE (FULL WIDTH) ─── */}
      <DangerZoneSettings />

    </motion.div>
  );
};

export default Settings;
