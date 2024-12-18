import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Button, Container, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Tooltip, Paper } from '@mui/material';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { Trash2 as DeleteIcon } from 'lucide-react';

import Loader from '../../components/loader/Loader';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [openAddUser, setOpenAddUser] = useState(false);
    const [delMsgOpen, setDelMsgOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, severity: 'success', title: '', message: '' });
    const [errors, setErrors] = useState({ username: false, password: false, currentPassword: false, newPassword: false, });
    const token = localStorage.getItem('token');
    const loggedUser = localStorage.getItem('user');
    const serverUrl = "http://localhost:8080";

    useEffect(() => {
        loadAllUsers();
    }, []);

    const handleClickAddUser = () => {
        setOpenAddUser(true);
    };

    const handleClickChangePassword = (user) => {
        setCurrentUser(user);
        setOpenChangePassword(true);
    };

    const handleClose = () => {
        setOpenAddUser(false);
        setOpenChangePassword(false);
        setUsername('');
        setPassword('');
        setCurrentPassword('');
        setNewPassword('');
        setDelMsgOpen(false);
        setErrors({ username: false, password: false, currentPassword: false, newPassword: false });
    };

    //add user
    const handleAddUser = () => {
        if (!validateForm()) return; // Prevent submission if validation fails
        setIsActionLoading(true);
        axios.post(`${serverUrl}/user/add`, {
            "username": username,
            "password": password
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                // console.log(response);
                loadAllUsers();
                handleClose();
                setIsActionLoading(false);
                showAlert('success', 'User Added', 'The new User has been successfully added.');
            })
            .catch(function (error) {
                console.log(error);
                setIsActionLoading(false);
                showAlert('error', 'Addition Failed', 'Failed to add the new user. Please try again.');
            });
    };

    //change password
    const ChangePassword = () => {
        if (!validateForm()) return; // Prevent submission if validation fails
        console.log("clicked")
        setIsActionLoading(true);
        axios.put(`${serverUrl}/user/change_password/${currentUser.id}`, {
            "currentPassword": currentPassword,
            "newPassword": newPassword
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                // console.log(response);
                loadAllUsers();
                handleClose();
                setIsActionLoading(false);
                showAlert('success', 'Password Changed', 'The user password has been successfully updated.');
            })
            .catch(function (error) {
                console.log(error);
                setIsActionLoading(false);
                if ((error.status === 400)) {
                    showAlert('error', 'Incorrect Current Password', 'The current password you entered is incorrect. Please try again.');
                } else {
                    showAlert('error', 'Password Change Failed', 'There was an error changing the user password. Please try again.');
                }
            });
    }

    const handleDelBtnClick = (user) => {
        setUserToDelete(user);
        setDelMsgOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (userToDelete) {
            handleDeleteUser(userToDelete.id);
        }
        setDelMsgOpen(false);
    };

    const handleDeleteCancel = () => {
        setUserToDelete(null);
        setDelMsgOpen(false);
    };

    // delete user
    const handleDeleteUser = (id) => {
        setIsActionLoading(true);
        axios.delete(`${serverUrl}/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                // console.log(response);
                loadAllUsers();
                setIsActionLoading(false);
                showAlert('success', 'User Deleted', 'The user has been successfully deleted.');
            })
            .catch(function (error) {
                console.log(error);
                setIsActionLoading(false);
                showAlert('error', 'Deletion Failed', 'Failed to delete the user. Please try again.');
            });
    };


    //load all users
    const loadAllUsers = () => {
        axios.get(`${serverUrl}/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                // console.error(response);
                setUsers(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
                setAlert({ show: true, severity: 'error', title: 'Loading Error', message: 'Failed to load users. Please reload the page.' });
            });
    }

    // alerts
    const showAlert = (severity, title, message) => {
        setAlert({ open: true, severity, title, message });
        // Auto-hide the alert after 3 seconds
        setTimeout(() => {
            setAlert(prev => ({ ...prev, open: false }));
        }, 3000);
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert(prev => ({ ...prev, open: false }));
    };


    // Add validation for empty fields
    const validateForm = () => {
        let newErrors = {};
    
        if (openAddUser) {
            newErrors = {
                username: username === '',
                password: password === ''
            };
        } else {
            newErrors = {
                currentPassword: currentPassword === '',
                newPassword: newPassword === ''
            };
        }
    
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true); // Return true if no errors
    };
    

    const handleInputChangeAddUser = (e) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: value === ''
        }));
    };

    const handleInputChangeResetPw = (e) => {
        const { name, value } = e.target;
        if (name === 'currentPassword') {
            setCurrentPassword(value);
        } else if (name === 'newPassword') {
            setNewPassword(value);
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: value === ''
        }));
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 2, height: 'calc(100vh - 100px)' }} >
            {(isLoading || isActionLoading) && (
                <div className="loader-container">
                    <Loader />
                </div>
            )}
            <Typography variant="h4" fontWeight="550" gutterBottom>
                Manage Users
            </Typography>

            {alert.show && (
                <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, show: false })} sx={{ mb: 2 }}>
                    <AlertTitle>{alert.title}</AlertTitle>
                    {alert.message}
                </Alert>
            )}

            <Button variant="contained" color="primary" onClick={handleClickAddUser}>
                Add User
            </Button>
            <TableContainer component={Paper} style={{ marginTop: '20px', maxWidth: '50%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="warning" onClick={() => handleClickChangePassword(user)} sx={{ mr: 4 }}>
                                        Change Password
                                    </Button>

                                    {(user.id != 1 && loggedUser == "admin") && (
                                        <Tooltip title="Delete user">
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelBtnClick(user)}>
                                                <DeleteIcon color="red" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openAddUser} onClose={handleClose}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Username"
                        name="username"
                        type="text"
                        fullWidth
                        value={username}
                        onChange={handleInputChangeAddUser}
                        error={errors.username}
                        helperText={errors.username ? 'Username is required' : ''}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={handleInputChangeAddUser}
                        error={errors.password}
                        helperText={errors.password ? 'Password is required' : ''}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleAddUser} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openChangePassword} onClose={handleClose}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Current password"
                        name="currentPassword"
                        type="password"
                        fullWidth
                        value={currentPassword}
                        onChange={handleInputChangeResetPw}
                        error={errors.currentPassword}
                        helperText={errors.currentPassword ? ' Current password is required' : ''}
                    />
                    <TextField
                        margin="dense"
                        label="New Password"
                        name="newPassword"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={handleInputChangeResetPw}
                        error={errors.newPassword}
                        helperText={errors.newPassword ? 'New password is required' : ''}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={ChangePassword} color="primary">
                        Change
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={delMsgOpen}
                onClick={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Please Confirm"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting this user will remove all its data. Are you sure you want to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirm}>Yes</Button>
                    <Button onClick={handleDeleteCancel} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)' }}
            >
                <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
                    <AlertTitle>{alert.title}</AlertTitle>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Users;