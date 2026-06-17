import React from 'react';
import { Paper, Typography, Divider } from '@mui/material';
import { FiBell, FiMail, FiBarChart2, FiClock, FiCpu, FiAlertTriangle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleNotifAndSave } from '../../../features/uiSlice';
import { SectionHeader, ToggleRow, getSectionCardSx } from './Shared';

const NotificationSettings = () => {
  const dispatch = useDispatch();
  const { themeMode, appearance, notifs } = useSelector((state) => state.ui);
  const isDark = themeMode === 'dark';
  const isNeu = appearance?.neumorphism !== false;
  const sectionCard = getSectionCardSx(isDark, isNeu, appearance.glassIntensity, appearance.density);

  return (
    <Paper elevation={0} sx={{ ...sectionCard, height: '100%', p: 5 }}>
      <SectionHeader
        icon={<FiBell />}
        title="Notifications"
        subtitle="Configure your alert & digest preferences"
        accentColor="#4caf50"
      />

      <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ display: 'block', mb: 1.5, letterSpacing: '0.08em' }}>
        COMMUNICATION
      </Typography>
      <ToggleRow
        icon={<FiMail />} title="Email Notifications"
        subtitle="Critical alerts delivered to inbox"
        checked={notifs.email}
        onChange={() => dispatch(toggleNotifAndSave('email'))}
        accentColor="#4caf50"
      />
      <ToggleRow
        icon={<FiBarChart2 />} title="Analytics Alerts"
        subtitle="Threshold breaches & anomaly detection"
        checked={notifs.analytics}
        onChange={() => dispatch(toggleNotifAndSave('analytics'))}
        accentColor="#4caf50"
      />

      <Divider sx={{ my: 2, opacity: 0.15 }} />
      <Typography variant="caption" fontWeight="800" color="text.secondary" sx={{ display: 'block', mb: 1.5, letterSpacing: '0.08em' }}>
        REPORTS & INSIGHTS
      </Typography>
      <ToggleRow
        icon={<FiClock />} title="Weekly Digest"
        subtitle="Curated performance summary every Monday"
        checked={notifs.weeklyDigest}
        onChange={() => dispatch(toggleNotifAndSave('weeklyDigest'))}
        accentColor="#4caf50"
      />
      <ToggleRow
        icon={<FiCpu />} title="AI Insights Feed"
        subtitle="ML-powered recommendations & anomalies"
        checked={notifs.aiInsights}
        onChange={() => dispatch(toggleNotifAndSave('aiInsights'))}
        accentColor="#4caf50"
      />
      <ToggleRow
        icon={<FiAlertTriangle />} title="System Warnings"
        subtitle="Infrastructure & security notifications"
        checked={notifs.warnings}
        onChange={() => dispatch(toggleNotifAndSave('warnings'))}
        accentColor="#4caf50"
      />
    </Paper>
  );
};

export default NotificationSettings;
