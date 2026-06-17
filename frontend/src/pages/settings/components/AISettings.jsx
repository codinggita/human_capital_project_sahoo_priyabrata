import React from 'react';
import { Paper } from '@mui/material';
import { FiCpu, FiZap, FiBarChart2, FiRefreshCw, FiActivity, FiEye } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAiPrefAndSave } from '../../../features/uiSlice';
import { SectionHeader, ToggleRow, getSectionCardSx } from './Shared';

const AISettings = () => {
  const dispatch = useDispatch();
  const { themeMode, appearance, aiPrefs } = useSelector((state) => state.ui);
  const isDark = themeMode === 'dark';
  const isNeu = appearance?.neumorphism !== false;
  const sectionCard = getSectionCardSx(isDark, isNeu, appearance.glassIntensity, appearance.density);

  return (
    <Paper elevation={0} sx={{ ...sectionCard, height: '100%', p: 5 }}>
      <SectionHeader
        icon={<FiCpu />}
        title="AI Intelligence"
        subtitle="Personalize your AI-powered analytics experience"
        accentColor="#9c27b0"
      />

      <ToggleRow
        icon={<FiZap />} title="AI Trend Predictions"
        subtitle="Forecast HC index movements 30 days ahead"
        checked={aiPrefs.predictions}
        onChange={() => dispatch(toggleAiPrefAndSave('predictions'))}
        accentColor="#9c27b0"
      />
      <ToggleRow
        icon={<FiBarChart2 />} title="Smart Recommendations"
        subtitle="Context-aware analytics suggestions"
        checked={aiPrefs.recommendations}
        onChange={() => dispatch(toggleAiPrefAndSave('recommendations'))}
        accentColor="#9c27b0"
      />
      <ToggleRow
        icon={<FiRefreshCw />} title="Auto-generate Reports"
        subtitle="Weekly AI-authored performance briefings"
        checked={aiPrefs.autoReports}
        onChange={() => dispatch(toggleAiPrefAndSave('autoReports'))}
        accentColor="#9c27b0"
      />
      <ToggleRow
        icon={<FiActivity />} title="Telemetry Optimization"
        subtitle="Use telemetry data to improve model accuracy"
        checked={aiPrefs.telemetry}
        onChange={() => dispatch(toggleAiPrefAndSave('telemetry'))}
        accentColor="#9c27b0"
      />
      <ToggleRow
        icon={<FiEye />} title="Smart Insights Panel"
        subtitle="Personalized dashboard intelligence overlays"
        checked={aiPrefs.smartInsights}
        onChange={() => dispatch(toggleAiPrefAndSave('smartInsights'))}
        accentColor="#9c27b0"
      />
    </Paper>
  );
};

export default AISettings;
