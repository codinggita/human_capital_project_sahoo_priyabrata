import React from 'react';
import { Paper, Box, Typography, Grid, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { FiInfo, FiMonitor, FiBarChart2, FiLayers, FiGlobe, FiKey, FiEye, FiClock, FiCpu, FiAlertTriangle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { SectionHeader, getSectionCardSx } from './Shared';

const HelpOverview = () => {
  const { themeMode, appearance } = useSelector((state) => state.ui);
  const isDark = themeMode === 'dark';
  const isNeu = appearance?.neumorphism !== false;
  const sectionCard = getSectionCardSx(isDark, isNeu, appearance.glassIntensity, appearance.density);

  return (
    <Paper
      elevation={0}
      component={motion.div}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
      sx={{
        ...sectionCard, mt: 4, mb: 4,
        background: isNeu ? (isDark ? '#151A26' : '#E6ECF5') : (isDark ? 'rgba(21, 26, 38, 0.6)' : 'rgba(255, 255, 255, 0.6)'),
      }}
    >
      <SectionHeader
        icon={<FiInfo />}
        title="About & Platform Help"
        subtitle="Discover how the Human Capital Platform works and how it empowers you."
        accentColor="#0ea5e9"
      />
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{
            p: 3, borderRadius: '20px', height: '100%',
            bgcolor: isNeu ? 'transparent' : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.02)'),
            boxShadow: isNeu ? (isDark ? 'inset 4px 4px 8px #080c16, inset -4px -4px 8px #1e2536' : 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff') : 'none',
            border: isNeu ? 'none' : '1px solid divider',
          }}>
            <Typography variant="h6" fontWeight="800" color="primary.main" gutterBottom>What is this platform?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
              The Human Capital Platform is a powerful enterprise analytics dashboard designed to process and visualize complex datasets in real-time. It aggregates human capital data, performance metrics, and global indicators into an intuitive, unified interface.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{
            p: 3, borderRadius: '20px', height: '100%',
            bgcolor: isNeu ? 'transparent' : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.02)'),
            boxShadow: isNeu ? (isDark ? 'inset 4px 4px 8px #080c16, inset -4px -4px 8px #1e2536' : 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff') : 'none',
            border: isNeu ? 'none' : '1px solid divider',
          }}>
            <Typography variant="h6" fontWeight="800" color="secondary.main" gutterBottom>How does it work?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
              Our engine uses high-performance MongoDB aggregation pipelines to process millions of records across global edge nodes. Built-in AI intelligently predicts trends and offers personalized recommendations based on telemetry data and usage patterns.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{
            p: 3, borderRadius: '20px', height: '100%',
            bgcolor: isNeu ? 'transparent' : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.02)'),
            boxShadow: isNeu ? (isDark ? 'inset 4px 4px 8px #080c16, inset -4px -4px 8px #1e2536' : 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff') : 'none',
            border: isNeu ? 'none' : '1px solid divider',
          }}>
            <Typography variant="h6" fontWeight="800" sx={{ color: '#ff6038' }} gutterBottom>How does it help you?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
              It allows you to instantly monitor API performance, manage user sessions, deploy edge replica nodes, and customize your workspace's aesthetics. The platform empowers administrators to make data-driven decisions quickly and efficiently while maintaining system security.
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4, opacity: isNeu ? 0.05 : 0.15 }} />
      <Typography variant="h6" fontWeight="900" sx={{ mb: 3, letterSpacing: '-0.02em', color: 'text.primary' }}>
        Platform Navigation Guide
      </Typography>
      <Grid container spacing={3}>
        {[
          { title: 'Dashboard', desc: 'Your main control center providing a high-level overview of critical metrics, recent activity, and system health at a glance.', icon: <FiMonitor /> },
          { title: 'Analytics Engine', desc: 'Deep dive into complex datasets. Features MongoDB aggregation pipelines, AI insights, and geographical telemetry data.', icon: <FiBarChart2 /> },
          { title: 'Data Management', desc: 'Upload, manage, and audit raw records. Ensure data integrity before it reaches the Analytics Engine.', icon: <FiLayers /> },
          { title: 'Global Countries', desc: 'Geopolitical coverage mapping. Monitor country-specific indicators and regional edge node routing.', icon: <FiGlobe /> },
          { title: 'System Administration', desc: 'Manage user access, configure enterprise settings, and customize the interface.', icon: <FiKey /> },
        ].map((sec, idx) => (
          <Grid item xs={12} sm={6} md={4} key={`nav-${idx}`}>
            <Box sx={{
              p: 2, borderRadius: '16px', height: '100%',
              bgcolor: isNeu ? 'transparent' : (isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)'),
              border: isNeu ? 'none' : '1px solid', borderColor: isNeu ? 'transparent' : 'divider',
              boxShadow: isNeu ? (isDark ? 'inset 3px 3px 6px #0c0f16, inset -3px -3px 6px #1e2536' : 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff') : 'none',
              display: 'flex', gap: 1.5
            }}>
              <Box sx={{ color: 'secondary.main', mt: 0.5 }}>{sec.icon}</Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 0.5 }}>{sec.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.5, display: 'block' }}>{sec.desc}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      
      <Divider sx={{ my: 4, opacity: isNeu ? 0.05 : 0.15 }} />
      <Typography variant="h6" fontWeight="900" sx={{ mb: 3, letterSpacing: '-0.02em', color: 'text.primary' }}>
        Settings Sections Overview
      </Typography>
      <Grid container spacing={3}>
        {[
          { title: 'Profile Management', desc: 'Update your enterprise identity, access levels, and secure your account credentials with new passwords.', icon: <FiKey /> },
          { title: 'Appearance & UI', desc: 'Personalize the dashboard. Toggle dark mode, enable deep 3D Neumorphism, and adjust glassmorphism intensity.', icon: <FiEye /> },
          { title: 'Email & Push Notifications', desc: 'Control the flow of critical alerts. Subscribe to AI insights, system warnings, and weekly analytics digests.', icon: <FiClock /> },
          { title: 'AI Intelligence', desc: 'Fine-tune your AI agent. Enable trend predictions, smart telemetry optimization, and auto-generated insights.', icon: <FiCpu /> },
          { title: 'Danger Zone', desc: 'Perform sensitive, irreversible operations like downloading backup archives or permanently deleting your workspace.', icon: <FiAlertTriangle /> },
        ].map((sec, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Box sx={{
              p: 2, borderRadius: '16px', height: '100%',
              bgcolor: isNeu ? 'transparent' : (isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)'),
              border: isNeu ? 'none' : '1px solid', borderColor: isNeu ? 'transparent' : 'divider',
              boxShadow: isNeu ? (isDark ? 'inset 3px 3px 6px #0c0f16, inset -3px -3px 6px #1e2536' : 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff') : 'none',
              display: 'flex', gap: 1.5
            }}>
              <Box sx={{ color: 'primary.main', mt: 0.5 }}>{sec.icon}</Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="800" sx={{ mb: 0.5 }}>{sec.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.5, display: 'block' }}>{sec.desc}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default HelpOverview;
