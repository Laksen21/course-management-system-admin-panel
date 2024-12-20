import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, TextField, Button, Select, IconButton,
    MenuItem, FormControl, InputLabel, Paper, Table, Tooltip, Snackbar,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    DialogActions, DialogContent, DialogTitle, Dialog, DialogContentText
} from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid2';
import axios from "axios";
import { Edit as EditIcon, Trash2 as DeleteIcon } from 'lucide-react';

import Loader from '../../components/loader/Loader';

function Students() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [newStudent, setNewStudent] = useState({
        id: '',
        name: '',
        email: '',
        tel_no: '',
        address: '',
        appPassword: '',
        courses: [],
    });
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchId, setSearchId] = useState('');
    const [errors, setErrors] = useState({ name: false, email: false, tel_no: false, address: false, appPassword: false, courses: false });
    const [alert, setAlert] = useState({ show: false, severity: 'success', title: '', message: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteBtnVisible, setDeleteBtnVisible] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [delMsgOpen, setDelMsgOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [isTokenValid, setTokenValid] = useState(true);
    const serverUrl = "http://localhost:8080";
    const token = localStorage.getItem('token');

    useEffect(() => {
        loadAllStudents();
        loadAllCourses();
        handleTokenValidation();
    }, [isTokenValid]);

    const handleTokenValidation = () => {
        if (!isTokenValid) {
            localStorage.removeItem('token');
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewStudent((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false })); // Remove error when input changes
        }
    };

    // Add validation for empty fields
    const validateForm = () => {
        const newErrors = {
            name: newStudent.name.trim() === '',
            email: newStudent.email.trim() === '',
            tel_no: newStudent.tel_no.trim() === '',
            address: newStudent.address.trim() === '',
            appPassword: newStudent.appPassword.trim() === '',
            // courses: newStudent.courses.length === 0
        };
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true); // Return true if no errors
    };

    const handleCourseChange = (event) => {
        const { target: { value } } = event;

        // Since value will already contain full course objects, just update the state directly
        setNewStudent((prevState) => ({
            ...prevState,
            courses: value, // set the selected course objects directly
        }));
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);

        const selectedCourses = student.courses.map((studentCourse) => {
            return courses.find((course) => course.code === studentCourse.code);
        });

        setNewStudent({
            ...student,
            courses: selectedCourses, // set full course objects
        });
        setDeleteBtnVisible(true);
    };

    //alets
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

    // search by id 
    const handleSearchById = () => {
        setIsActionLoading(true);
        axios.get(`${serverUrl}/student/${searchId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                //console.log(response);
                setIsActionLoading(false);
                setNewStudent({
                    id: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                    tel_no: response.data.tel_no,
                    address: response.data.address,
                    appPassword: response.data.appPassword
                });

                const selectedCourses = response.data.courses.map((studentCourse) => {
                    return courses.find((course) => course.code === studentCourse.code);
                });
                setNewStudent({
                    ...response.data,
                    courses: selectedCourses, // set full course objects
                });

                setEditingStudent(response.data);
                setDeleteBtnVisible(true);
            })
            .catch(function (error) {
                console.log(error);
                setIsActionLoading(false);
                showAlert('error', 'Student Not Found', 'The student could not be found. Please check the Id and try again.');
            });
    };

    // add/save student 
    const handleAddStudent = () => {
        if (!validateForm()) return; // Prevent submission if validation fails
        axios.post(`${serverUrl}/student/student_with_course`, {
            "name": newStudent.name,
            "email": newStudent.email,
            "address": newStudent.address,
            "tel_no": newStudent.tel_no,
            "appPassword": newStudent.appPassword,
            "courses": newStudent.courses
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                // console.log(response);
                clearFields();
                loadAllStudents();
                showAlert('success', 'Student Added', 'The new student has been successfully added.');
            })
            .catch(function (error) {
                console.log(error);
                showAlert('error', 'Addition Failed', 'Failed to add the new student. Please try again.');
            });
    };

    // update student
    const handleUpdateStudent = () => {
        if (!validateForm()) return; // Prevent submission if validation fails
        axios.put(`${serverUrl}/student/student_with_course/${newStudent.id}`, {
            "name": newStudent.name,
            "email": newStudent.email,
            "address": newStudent.address,
            "tel_no": newStudent.tel_no,
            "appPassword": newStudent.appPassword,
            "courses": newStudent.courses
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                // console.log(response);
                setEditingStudent(null);
                clearFields();
                loadAllStudents();
                showAlert('success', 'Student Updated', 'The student has been successfully updated.');
            })
            .catch(function (error) {
                console.log(error);
                showAlert('error', 'Update Failed', 'Failed to update the student. Please try again.');
            });
    };

    const handleDelBtnClick = (student) => {
        setStudentToDelete(student);
        setDelMsgOpen(true);
    };

    const handleClose = () => {
        setDelMsgOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (studentToDelete) {
            handleDeleteStudent(studentToDelete.id);
        }
        setDelMsgOpen(false);
    };

    const handleDeleteCancel = () => {
        setStudentToDelete(null);
        setDelMsgOpen(false);
    };

    // delete student
    const handleDeleteStudent = (id) => {
        axios.delete(`${serverUrl}/student/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                // console.log(response);
                loadAllStudents();
                clearFields();
                showAlert('success', 'Student Deleted', 'The student has been successfully deleted.');
            })
            .catch(function (error) {
                console.log(error);
                showAlert('error', 'Deletion Failed', 'Failed to delete the student. Please try again.');
            });
    };

    // load all students
    const loadAllStudents = () => {
        setIsLoading(true);
        axios.get(`${serverUrl}/student`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                // console.log(response);
                setIsLoading(false);
                setStudents(response.data);
            })
            .catch(function (error) {
                console.log(error);
                setIsLoading(false);
                setAlert({ show: true, severity: 'error', title: 'Loading Error', message: 'Failed to load students. Please reload the page.' });
            });
    }

    // load all courses
    const loadAllCourses = () => {
        axios.get(`${serverUrl}/course`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const clearFields = () => {
        setNewStudent({
            id: '',
            name: '',
            email: '',
            tel_no: '',
            address: '',
            courses: [],
            appPassword: '',
        });
        setEditingStudent(null);
        setErrors({ name: false, email: false, tel_no: false, address: false, appPassword: false, courses: false });
        setDeleteBtnVisible(false);
    }
    return (
        <Container maxWidth="xl" sx={{ mt: 2, height: 'calc(100vh - 100px)' }}>

            {(isLoading || isActionLoading) && (
                <div className="loader-container">
                    <Loader />
                </div>
            )}

            <Typography variant="h4" fontWeight="550" gutterBottom>
                Manage Students
            </Typography>

            {alert.show && (
                <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, show: false })} sx={{ mb: 2 }}>
                    <AlertTitle>{alert.title}</AlertTitle>
                    {alert.message}
                </Alert>
            )}

            <Grid container spacing={1} sx={{ mt: 2, height: 'calc(100% - 60px)' }}>
                <Grid size={6} sx={{ height: '100%', overflowY: 'auto' }}>
                    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Paper elevation={2} sx={{ p: 1, mb: 2, width: '51%' }}>
                            <TextField
                                id="standard-search"
                                label="Search Student Id"
                                type="search"
                                name='searchId'
                                value={searchId}
                                onChange={(e) => { setSearchId(e.target.value) }}
                                sx={{ mr: { sm: 2 }, width: '25ch' }} />
                            <Button variant="contained" sx={{ mt: '1px', height: '55px' }} onClick={handleSearchById}>Search</Button>
                        </Paper>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                            <Grid container spacing={2} sx={{ mt: 2, }}>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        name="name"
                                        value={newStudent.name}
                                        onChange={handleInputChange}
                                        error={errors.name}
                                        helperText={errors.name ? 'Name is required' : ''}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={newStudent.email}
                                        onChange={handleInputChange}
                                        error={errors.email}
                                        helperText={errors.email ? 'Email adddress is required' : ''}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        inputProps={{ maxLength: 10, pattern: "[0-9]{10}" }}
                                        fullWidth
                                        type='tel'
                                        label="Tel No"
                                        name="tel_no"
                                        value={newStudent.tel_no}
                                        onChange={handleInputChange}
                                        error={errors.tel_no}
                                        helperText={errors.tel_no ? 'Tel No is required' : ''}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="App Password"
                                        name="appPassword"
                                        type="password"
                                        value={newStudent.appPassword}
                                        onChange={handleInputChange}
                                        error={errors.appPassword}
                                        helperText={errors.appPassword ? 'App password is required' : ''}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        name="address"
                                        value={newStudent.address}
                                        onChange={handleInputChange}
                                        error={errors.address}
                                        helperText={errors.address ? 'Address is required' : ''}
                                    />
                                </Grid>

                                <Grid size={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Courses Enrolled</InputLabel>
                                        <Select
                                            multiple
                                            value={newStudent.courses} // This should hold the entire course objects
                                            onChange={handleCourseChange}
                                            // error={errors.courses}
                                            // helperText={errors.courses ? 'Code is required' : ''}
                                            renderValue={(selected) => selected.map(course => course.title).join(', ')} // Display course titles in the input
                                        >
                                            {courses.map((course) => (
                                                <MenuItem key={course.id} value={course}>
                                                    {course.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={12} >
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
                                    >
                                        {editingStudent ? 'Update Student' : 'Add Student'}
                                    </Button>
                                    {isDeleteBtnVisible && (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDelBtnClick(newStudent)}
                                            sx={{ ml: 2 }}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={clearFields}
                                        sx={{ ml: 2 }}
                                    >
                                        Clear
                                    </Button>

                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={6} sx={{ height: '100%', overflowY: 'auto' }}>
                    <Paper sx={{ pl: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Courses</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>{student.id}</TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>
                                                {student.courses && student.courses.length > 0
                                                    ? student.courses.map((course) => course.title).join(', ')
                                                    : 'No courses'}
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Edit student">
                                                    <IconButton sx={{ mr: 2 }} edge="end" aria-label="edit" onClick={() => handleEditStudent(student)}>
                                                        <EditIcon color="blue" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete student">
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelBtnClick(student)}>
                                                        <DeleteIcon color="red" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
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
                        Deleting this student will remove all its data. Are you sure you want to continue?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirm}>Yes</Button>
                    <Button onClick={handleDeleteCancel} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            {/* alerts */}
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

export default Students;