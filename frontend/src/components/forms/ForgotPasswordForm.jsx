import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography } from '@mui/material';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ForgotPasswordForm = ({ onSuccess }) => {
  const [stage, setStage] = useState('request'); // 'request' | 'reset'
  const [loading, setLoading] = useState(false);
  const [emailForReset, setEmailForReset] = useState('');

  // Formik for Stage 1: Request Reset
  const requestFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Enter a valid email').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await api.post('/auth/forgot-password', { email: values.email });
        const mockToken = res.data.data?.mockToken;
        
        toast.success(mockToken ? `Mock email sent! Token is: ${mockToken}` : 'Password reset token sent to email!');
        setEmailForReset(values.email);
        if (mockToken) {
          resetFormik.setFieldValue('token', mockToken);
        }
        setStage('reset');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to send recovery token');
      } finally {
        setLoading(false);
      }
    },
  });

  // Formik for Stage 2: Reset Password
  const resetFormik = useFormik({
    initialValues: { token: '', newPassword: '', confirmPassword: '' },
    validationSchema: Yup.object({
      token: Yup.string().required('Recovery token is required'),
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('New Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await api.post('/auth/reset-password', {
          token: values.token,
          newPassword: values.newPassword,
        });
        toast.success('Password reset successfully! You can now log in.');
        if (onSuccess) onSuccess();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
    },
  });

  if (stage === 'request') {
    return (
      <form onSubmit={requestFormik.handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Input
            fullWidth
            size="small"
            id="email"
            name="email"
            label="Email Address"
            autoComplete="email"
            value={requestFormik.values.email}
            onChange={requestFormik.handleChange}
            onBlur={requestFormik.handleBlur}
            error={requestFormik.touched.email && Boolean(requestFormik.errors.email)}
            helperText={requestFormik.touched.email && requestFormik.errors.email}
          />
        </Box>

        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          loading={loading}
          sx={{ py: 1.35, fontSize: '1rem' }}
        >
          Send Recovery Code
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={resetFormik.handleSubmit}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, textAlign: 'center' }}>
        Enter the token sent to <strong>{emailForReset}</strong> and set your new password.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, mb: 3.2 }}>
        <Input
          fullWidth
          size="small"
          id="token"
          name="token"
          label="Recovery Token / Code"
          value={resetFormik.values.token}
          onChange={resetFormik.handleChange}
          onBlur={resetFormik.handleBlur}
          error={resetFormik.touched.token && Boolean(resetFormik.errors.token)}
          helperText={resetFormik.touched.token && resetFormik.errors.token}
        />
        <Input
          fullWidth
          size="small"
          id="newPassword"
          name="newPassword"
          label="New Password"
          type="password"
          value={resetFormik.values.newPassword}
          onChange={resetFormik.handleChange}
          onBlur={resetFormik.handleBlur}
          error={resetFormik.touched.newPassword && Boolean(resetFormik.errors.newPassword)}
          helperText={resetFormik.touched.newPassword && resetFormik.errors.newPassword}
        />
        <Input
          fullWidth
          size="small"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          value={resetFormik.values.confirmPassword}
          onChange={resetFormik.handleChange}
          onBlur={resetFormik.handleBlur}
          error={resetFormik.touched.confirmPassword && Boolean(resetFormik.errors.confirmPassword)}
          helperText={resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword}
        />
      </Box>

      <Button
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        loading={loading}
        sx={{ py: 1.35, fontSize: '1rem' }}
      >
        Reset Password
      </Button>

      <Button
        variant="text"
        color="secondary"
        fullWidth
        onClick={() => setStage('request')}
        sx={{ mt: 1.5, fontWeight: 700 }}
      >
        Back to Request Token
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
