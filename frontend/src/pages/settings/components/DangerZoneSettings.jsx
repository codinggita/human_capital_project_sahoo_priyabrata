import React, { useState } from 'react';
import { Paper, Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiDownload, FiSmartphone, FiToggleLeft, FiTrash2, FiCheck } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { SectionHeader, getSectionCardSx } from './Shared';
import { exportAccountData, createAccountBackup, deactivateUserAccount, deleteUserAccount } from '../../../features/authSlice';

const DangerZoneSettings = () => {
  const dispatch = useDispatch();
  const { themeMode, appearance } = useSelector((state) => state.ui);
  const isDark = themeMode === 'dark';
  const isNeu = appearance?.neumorphism !== false;
  const sectionCard = getSectionCardSx(isDark, isNeu, appearance.glassIntensity, appearance.density);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [actionStates, setActionStates] = useState({});

  const downloadJson = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDangerAction = async (id) => {
    setActionStates((p) => ({ ...p, [id]: 'loading' }));
    
    try {
      let result;
      if (id === 'export') {
        result = await dispatch(exportAccountData()).unwrap();
        downloadJson(result, 'account_export.json');
      } else if (id === 'backup') {
        result = await dispatch(createAccountBackup()).unwrap();
        downloadJson(result, 'workspace_backup.json');
      } else if (id === 'deactivate') {
        await dispatch(deactivateUserAccount()).unwrap();
      } else if (id === 'delete') {
        await dispatch(deleteUserAccount()).unwrap();
      }

      setActionStates((p) => ({ ...p, [id]: 'success' }));
      setTimeout(() => {
        setActionStates((p) => ({ ...p, [id]: null }));
        if (id === 'delete') setDeleteConfirm(false);
      }, 2000);
    } catch (err) {
      console.error(`Failed action ${id}:`, err);
      setActionStates((p) => ({ ...p, [id]: null }));
      if (id === 'delete') setDeleteConfirm(false);
    }
  };

  return (
    <Paper
      elevation={0}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      sx={{
        ...sectionCard, mt: 4,
        border: isNeu ? 'none' : '1px solid rgba(244, 67, 54, 0.2)',
        background: isNeu 
          ? (isDark ? '#151A26' : '#E6ECF5')
          : (isDark
            ? 'linear-gradient(135deg, rgba(244,67,54,0.04), rgba(244,67,54,0.02))'
            : 'linear-gradient(135deg, rgba(244,67,54,0.03), rgba(244,67,54,0.01))'),
      }}
    >
      <SectionHeader
        icon={<FiAlertTriangle />}
        title="Danger Zone"
        subtitle="Irreversible enterprise account operations — proceed with caution"
        accentColor="#f44336"
      />

      <Grid container spacing={3}>
        {[
          {
            icon: <FiDownload />, label: 'Export Account Data',
            desc: 'Download all your enterprise analytics data, settings, and history in JSON/CSV.',
            color: '#2196f3', action: 'Export Data', variant: 'outlined', id: 'export'
          },
          {
            icon: <FiSmartphone />, label: 'Backup & Restore',
            desc: 'Create a full encrypted backup of your workspace configuration.',
            color: '#ff9800', action: 'Create Backup', variant: 'outlined', id: 'backup'
          },
          {
            icon: <FiToggleLeft />, label: 'Deactivate Account',
            desc: 'Temporarily suspend your account. Reactivate at any time.',
            color: '#ff6038', action: 'Deactivate', variant: 'outlined', id: 'deactivate'
          },
          {
            icon: <FiTrash2 />, label: 'Delete Account',
            desc: 'Permanently erase all your data. This action is irreversible.',
            color: '#f44336', action: 'Delete Account', variant: 'contained', danger: true, id: 'delete'
          },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Box
              component={motion.div}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              sx={{
                p: 2.5, borderRadius: '20px',
                background: isNeu ? 'transparent' : (isDark ? `${item.color}08` : `${item.color}06`),
                border: isNeu ? 'none' : `1px solid ${item.color}22`,
                boxShadow: isNeu ? (isDark ? 'inset 4px 4px 8px #080c16, inset -4px -4px 8px #1e2536' : 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff') : 'none',
                height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5,
              }}
            >
              <Box sx={{
                width: 40, height: 40, borderRadius: '12px',
                bgcolor: `${item.color}18`, color: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>
                {item.icon}
              </Box>
              <Typography variant="body2" fontWeight="800">{item.label}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, flex: 1 }}>
                {item.desc}
              </Typography>

              {item.danger ? (
                !deleteConfirm ? (
                  <Button
                    variant="outlined" size="small"
                    onClick={() => setDeleteConfirm(true)}
                    startIcon={<FiTrash2 />}
                    sx={{
                      borderRadius: '10px', fontWeight: 800, fontSize: '0.75rem',
                      borderColor: '#f4433644', color: '#f44336',
                      '&:hover': { bgcolor: '#f4433614', borderColor: '#f44336' },
                    }}
                  >
                    {item.action}
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained" size="small"
                      onClick={() => handleDangerAction(item.id)}
                      disabled={actionStates[item.id] === 'loading'}
                      sx={{
                        borderRadius: '10px', fontWeight: 800, fontSize: '0.72rem', flex: 1,
                        background: 'linear-gradient(135deg, #f44336, #e53935)',
                        boxShadow: '0 4px 14px #f4433644',
                        '&.Mui-disabled': { opacity: 0.7, color: '#fff' }
                      }}
                    >
                      {actionStates[item.id] === 'loading' ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 
                       actionStates[item.id] === 'success' ? <FiCheck size={16} /> : 'Confirm'}
                    </Button>
                    <Button
                      variant="outlined" size="small"
                      onClick={() => setDeleteConfirm(false)}
                      disabled={actionStates[item.id] === 'loading'}
                      sx={{
                        borderRadius: '10px', fontWeight: 800, fontSize: '0.72rem',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)',
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )
              ) : (
                <Button
                  variant="outlined" size="small"
                  onClick={() => handleDangerAction(item.id)}
                  disabled={actionStates[item.id] === 'loading'}
                  startIcon={
                    actionStates[item.id] === 'loading' ? <CircularProgress size={14} sx={{ color: item.color }} /> :
                    actionStates[item.id] === 'success' ? <FiCheck /> :
                    item.icon
                  }
                  sx={{
                    borderRadius: '10px', fontWeight: 800, fontSize: '0.75rem',
                    borderColor: `${item.color}44`, color: item.color,
                    '&:hover': { bgcolor: `${item.color}12`, borderColor: item.color },
                    '&.Mui-disabled': { borderColor: `${item.color}22`, color: `${item.color}88` }
                  }}
                >
                  {actionStates[item.id] === 'success' ? 'Completed' : item.action}
                </Button>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default DangerZoneSettings;
