import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Container, DialogContentText, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Edit as EditIcon, Trash2 as DeleteIcon } from 'lucide-react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import Loader from '../../components/Loader/Loader';

function Courses() {
    const [courses, setCourses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({ id: '', code: '', title: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [delMsgOpen, setDelMsgOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [isTokenValid, setTokenValid] = useState(true);
    const [alert, setAlert] = useState({ show: false, severity: 'success', title: '', message: '' });
    const [errors, setErrors] = useState({ code: false, title: false });
    const serverUrl = "http://localhost:8080";
    const token = localStorage.getItem('token');

    useEffect(() => {
        loadAllCourses();
        handleTokenValidation();
    }, [isTokenValid]);

    const handleTokenValidation = () => {
        if (!isTokenValid) {
            localStorage.removeItem('token');
            showAlert('error', 'Authentication Error', 'Your session has expired. Please log in again.');
        }
    }

    const handleOpenDialog = (course = null) => {
        if (course) {
            setCurrentCourse(course);
            setIsEditing(true);
        } else {
            setCurrentCourse({ id: '', code: '', title: '', description: '' });
            setIsEditing(false);
        }
        setErrors({ code: false, title: false });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentCourse({ id: '', code: '', title: '', description: '' });
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCourse(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false })); // Remove error when input changes
        }
    };

    // Add validation for empty fields
    const validateForm = () => {
        const newErrors = {
            code: currentCourse.code.trim() === '',
            title: currentCourse.title.trim() === ''
        };
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true); // Return true if no errors
    };

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

    // add/update course 
    const handleSubmit = () => {
        if (!validateForm()) return; // Prevent submission if validation fails
        setIsActionLoading(true);
        if (isEditing) {
            axios.put(`${serverUrl}/course/${currentCourse.id}`, {
                "code": currentCourse.code,
                "title": currentCourse.title,
                "description": currentCourse.description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(function (response) {
                    clearFields();
                    setIsActionLoading(false);
                    loadAllCourses();
                    showAlert('success', 'Course Updated', 'The course has been successfully updated.');
                })
                .catch(function (error) {
                    console.log(error);
                    setIsActionLoading(false);
                    showAlert('error', 'Update Failed', 'Failed to update the course. Please try again.');
                });

        } else {
            axios.post(`${serverUrl}/course`, {
                "code": currentCourse.code,
                "title": currentCourse.title,
                "description": currentCourse.description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(function (response) {
                    clearFields();
                    setIsActionLoading(false);
                    loadAllCourses();
                    setAlert('success', 'Course Added', 'The new course has been successfully added.');
                })
                .catch(function (error) {
                    console.log(error);
                    setIsActionLoading(false);
                    setAlert('error', 'Addition Failed', 'Failed to add the new course. Please try again.');
                });
        }
        handleCloseDialog();
    };

    // load all courses
    const loadAllCourses = () => {
        setIsLoading(true);
        axios.get(`${serverUrl}/course`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                // console.error(response);
                setCourses(response.data);
                setTokenValid(true);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                if (error.response && error.response.status === 403) {
                    setTokenValid(false);
                } else {
                    setIsLoading(false);
                    setAlert({ show: true, severity: 'error', title: 'Loading Error', message: 'Failed to load courses. Please reload the page.' });

                }
            });
    };

    const handleDelBtnClick = (course) => {
        setCourseToDelete(course);
        setDelMsgOpen(true);
    };

    const handleClose = () => {
        setDelMsgOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (courseToDelete) {
            handleDeleteCourse(courseToDelete.id);
        }
        setDelMsgOpen(false);
    };

    const handleDeleteCancel = () => {
        setCourseToDelete(null);
        setDelMsgOpen(false);
    };

    // delete course
    const handleDeleteCourse = (id) => {
        setIsActionLoading(true);
        axios.delete(`${serverUrl}/course/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                setIsActionLoading(false);
                loadAllCourses();
                setAlert('success', 'Course Deleted', 'The course has been successfully deleted.');
            })
            .catch(function (error) {
                console.log(error);
                setIsActionLoading(false);
                setAlert('error', 'Deletion Failed', 'Failed to delete the course. Please try again.');
            });
    };

    const clearFields = () => {
        setCurrentCourse({ code: '', title: '', description: '' });
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 2, height: 'calc(100vh - 100px)' }} >
            {(isLoading || isActionLoading) && (
                <div className="loader-container">
                    <Loader />
                </div>
            )}
            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)' }}
            >
                <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
                    <AlertTitle>{alert.title}</AlertTitle>
                    {alert.message}
                </Alert>
            </Snackbar>

            <Typography variant="h4" fontWeight="550" gutterBottom>
                Manage Course
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
                Add Course
            </Button>

            {alert.show && (
                <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, show: false })} sx={{ mb: 2 }}>
                    <AlertTitle>{alert.title}</AlertTitle>
                    {alert.message}
                </Alert>
            )}

            <Grid container spacing={3} sx={{ height: 'calc(100% - 110px)' }}>
                <Grid size={12} sx={{ height: '100%', overflowY: 'auto' }}>
                    <List>
                        {courses.map((course) => (
                            <ListItem
                                key={course.id}
                                secondaryAction={
                                    <>
                                        <Tooltip title="Edit course">
                                            <IconButton sx={{ mr: 2 }} edge="end" aria-label="edit" onClick={() => handleOpenDialog(course)}>
                                                <EditIcon color="blue" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete course">
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelBtnClick(course)}>
                                                <DeleteIcon color="red" />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                }
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" fontWeight="600">
                                            {course.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body">
                                            {`Code: ${course.code} | ${course.description}`}
                                            <br />
                                            {`${course.video_file_path} videos`}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Edit Course' : 'Add Course'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="code"
                        label="Code"
                        type="text"
                        fullWidth
                        value={currentCourse.code}
                        onChange={handleInputChange}
                        error={errors.code}
                        helperText={errors.code ? 'Code is required' : ''}
                    />
                    <TextField
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        value={currentCourse.title}
                        onChange={handleInputChange}
                        error={errors.title}
                        helperText={errors.title ? 'Title is required' : ''}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={currentCourse.description}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {isEditing ? 'Save' : 'Add'}
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
                        Deleting this course will remove all its data. Are you sure you want to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirm}>Yes</Button>
                    <Button onClick={handleDeleteCancel} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Courses;