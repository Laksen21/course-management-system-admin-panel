import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, TextField, Button, Select,
    MenuItem, FormControl, InputLabel, Paper, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [newStudent, setNewStudent] = useState({
        id: '',
        name: '',
        email: '',
        tel: '',
        address: '',
        coursesEnrolled: [],
        appPassword: '',
        enrollmentDate: new Date(),
    });
    const [editingStudent, setEditingStudent] = useState(null);

    useEffect(() => {
        // Fetch courses from database
        // This is a mock implementation
        setCourses(['Math', 'Science', 'History', 'English']);
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewStudent((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setNewStudent((prev) => ({ ...prev, enrollmentDate: date }));
    };

    const handleCourseChange = (event) => {
        setNewStudent((prev) => ({ ...prev, coursesEnrolled: event.target.value }));
    };

    const handleAddStudent = () => {
        setStudents((prev) => [...prev, { ...newStudent, id: Date.now().toString() }]);
        setNewStudent({
            id: '',
            name: '',
            email: '',
            tel: '',
            address: '',
            coursesEnrolled: [],
            appPassword: '',
            enrollmentDate: new Date(),
        });
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setNewStudent(student);
    };

    const handleUpdateStudent = () => {
        setStudents((prev) =>
            prev.map((student) => (student.id === editingStudent.id ? newStudent : student))
        );
        setEditingStudent(null);
        setNewStudent({
            id: '',
            name: '',
            email: '',
            tel: '',
            address: '',
            coursesEnrolled: [],
            appPassword: '',
            enrollmentDate: new Date(),
        });
    };

    const handleDeleteStudent = (id) => {
        setStudents((prev) => prev.filter((student) => student.id !== id));
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 2, height: 'calc(100vh - 100px)' }}>
            <Typography variant="h4" fontWeight="550" gutterBottom>
                Manage Student
            </Typography>
            <Grid container spacing={3} sx={{ height: 'calc(100% - 60px)' }}>
                <Grid size={6} sx={{ height: '100%', overflowY: 'auto' }}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Paper elevation={1} sx={{ p: 1, mb: 2, width: '100%' }}>
                            <TextField id="standard-search" label="Search Id" type="search" sx={{ mr: { sm: 2 }, width: '25ch' }} />
                            <Button variant="contained" sx={{ mt: '1px', height: '55px' }} >Search</Button>
                        </Paper>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto'}}>
                            <Grid container spacing={2} sx={{  mt: 2, }}>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        name="name"
                                        value={newStudent.name}
                                        onChange={handleInputChange}
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
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="Telephone"
                                        name="tel"
                                        value={newStudent.tel}
                                        onChange={handleInputChange}
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
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        name="address"
                                        value={newStudent.address}
                                        onChange={handleInputChange}
                                    />
                                </Grid>

                                <Grid size={8}>
                                    <FormControl fullWidth>
                                        <InputLabel>Courses Enrolled</InputLabel>
                                        <Select
                                            multiple
                                            value={newStudent.coursesEnrolled}
                                            onChange={handleCourseChange}
                                            renderValue={(selected) => selected.join(', ')}
                                        >
                                            {courses.map((course) => (
                                                <MenuItem key={course} value={course}>
                                                    {course}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={4}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Enrollment Date"
                                            value={newStudent.enrollmentDate}
                                            onChange={handleDateChange}
                                            textField={(params) => <TextField {...params} fullWidth />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid size={12} >
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
                                    >
                                        {editingStudent ? 'Update Student' : 'Add Student'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={6} sx={{ height: '100%', overflowY: 'auto' }}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                                            <TableCell>{student.coursesEnrolled.join(', ')}</TableCell>
                                            <TableCell>
                                                <Button color='warning' onClick={() => handleEditStudent(student)}>Edit</Button>
                                                <Button color='error' onClick={() => handleDeleteStudent(student.id)}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Students;