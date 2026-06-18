import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import SEOMeta from '../../components/common/SEOMeta';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit2, FiTrash2, FiUserPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

import Table from '../../components/tables/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { TableSkeleton } from '../../components/loaders/SkeletonLoader';
import ErrorState from '../../components/common/ErrorState';
import { fetchUsers } from '../../features/userSlice';
import api from '../../services/api';
import UserFormModal from './UserFormModal';

const Users = () => {
  const dispatch = useDispatch();
  const { usersList, loading, error } = useSelector((state) => state.user);
  const { themeMode } = useSelector((state) => state.ui);

  const selectShadow =
    themeMode === 'dark'
      ? 'inset 2px 2px 5px #080c16, inset -2px -2px 5px #16223e'
      : 'inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff';

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const refreshUsers = () => {
    dispatch(fetchUsers());
  };

  useEffect(() => {
    refreshUsers();
    // eslint-disable-next-line
  }, [dispatch]);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        toast.success('User deleted successfully');
        dispatch(fetchUsers());
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = (usersList || []).filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Role',
      accessor: 'role',
      render: (user) => (
        <Chip
          label={user.role}
          color={user.role === 'admin' ? 'secondary' : 'default'}
          size="small"
          sx={{ fontWeight: 'bold' }}
        />
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (user) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="primary" size="small" onClick={() => handleOpenModal(user)}>
            <FiEdit2 size={16} />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDelete(user._id || user.id)}>
            <FiTrash2 size={16} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SEOMeta
        title="User Management"
        description="Admin-level user management system. Create, read, update, and delete enterprise users from MongoDB."
        path="/users"
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', md: 'auto' } }}>
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: '100%', sm: 250 } }}
          />
          <Button startIcon={<FiUserPlus />} onClick={() => handleOpenModal()} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            Add User
          </Button>
        </Box>
      </Box>

      {error ? (
        <ErrorState error={error} onRetry={() => dispatch(fetchUsers())} />
      ) : loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <Table columns={columns} data={filteredUsers} emptyMessage="No enterprise users found." />
      )}

      <UserFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        editingUser={editingUser}
        refreshUsers={refreshUsers}
        selectShadow={selectShadow}
      />
    </motion.div>
  );
};

export default Users;
