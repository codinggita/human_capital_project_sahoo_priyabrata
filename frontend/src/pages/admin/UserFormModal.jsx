import React, { useState, useEffect } from 'react';
import { Box, Typography, Stepper, Step, StepLabel, MenuItem, Select, FormControl } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../services/api';

const step1Schema = Yup.object({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const step2Schema = Yup.object({
  role: Yup.string().oneOf(['user', 'admin']).required('Role is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters'),
});

const UserFormModal = ({ open, onClose, editingUser, refreshUsers, selectShadow }) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Personal Details', 'Security & Role'];

  const formik = useFormik({
    initialValues: { name: '', email: '', role: 'user', password: '' },
    validationSchema: activeStep === 0 ? step1Schema : step2Schema,
    validateOnMount: false,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (activeStep === 0) {
        setActiveStep(1);
        setSubmitting(false);
        return;
      }
      try {
        if (editingUser) {
          const updateData = { ...values };
          if (!updateData.password) delete updateData.password;
          await api.patch(`/admin/users/${editingUser._id || editingUser.id}`, updateData);
          toast.success('User updated successfully');
        } else {
          await api.post('/admin/users', values);
          toast.success('User created successfully');
        }
        handleClose();
        resetForm();
        refreshUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Operation failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      if (editingUser) {
        formik.setValues({ name: editingUser.name, email: editingUser.email, role: editingUser.role, password: '' });
      } else {
        formik.resetForm();
      }
    }
    // eslint-disable-next-line
  }, [open, editingUser]);

  const handleClose = () => {
    onClose();
    setActiveStep(0);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={editingUser ? 'Edit User Wizard' : 'Create User Wizard'}
      actions={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', px: 2 }}>
          <Button variant="text" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep > 0 && (
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button onClick={() => formik.handleSubmit()} loading={formik.isSubmitting}>
              {activeStep === steps.length - 1 ? 'Save User' : 'Next Step'}
            </Button>
          </Box>
        </Box>
      }
    >
      <Box sx={{ px: 2, py: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeStep === 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Input
                  label="Full Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Box>
            )}

            {activeStep === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl
                  fullWidth
                  error={formik.touched.role && Boolean(formik.errors.role)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      boxShadow: selectShadow,
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    },
                  }}
                >
                  <Select
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    displayEmpty
                  >
                    <MenuItem value="user">User Role</MenuItem>
                    <MenuItem value="admin">Admin Role</MenuItem>
                  </Select>
                </FormControl>
                <Input
                  label={editingUser ? 'New Password (Leave blank to keep)' : 'Password'}
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Box>
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Modal>
  );
};

export default UserFormModal;
