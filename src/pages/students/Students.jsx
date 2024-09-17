import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, TextField, Button, Select, IconButton,
    MenuItem, FormControl, InputLabel, Paper, Table, Tooltip,
    TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from "axios";
import { Edit as EditIcon, Delete as DeleteIcon } from 'lucide-react';

const token = localStorage.getItem('token');

const Students = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [newStudent, setNewStudent] = useState({
        id: '',
        name: '',
        email: '',
        tel_no: '',
        address: '',
        courses: [],
        appPassword: '',
    });
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchId, setSearchId] = useState('')

    useEffect(() => {
        // Fetch courses from database
        // This is a mock implementation
        loadAllStudents();
        loadAllCourses();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewStudent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearchById = () => {
        axios.get(`http://localhost:8080/student/${searchId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                //console.log(response);
                setNewStudent({
                    id: response.data.id,
                    name: response.data.name,
                    email: response.data.email,
                    tel_no: response.data.tel_no,
                    address: response.data.address,
                    courses: response.data.courses,
                    appPassword: response.data.appPassword,
                });
            })
            .catch(function (error) {
                console.log(error);

            });
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
    };

    const handleAddStudent = () => {

        axios.post('http://localhost:8080/student/student_with_course', {
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
                console.log(response);
                clearFields();
                loadAllStudents();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleUpdateStudent = () => {

        axios.put(`http://localhost:8080/student/student_with_course/${newStudent.id}`, {
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
                console.log(response);
                setEditingStudent(null);
                clearFields();
                loadAllStudents();
            })
            .catch(function (error) {
                console.log(error);

            });
    };

    const handleDeleteStudent = (id) => {
        axios.delete(`http://localhost:8080/student/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                // console.log(response);
                loadAllStudents();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const loadAllStudents = () => {
        axios.get('http://localhost:8080/student', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                // console.log(response);
                setStudents(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const loadAllCourses = () => {
        axios.get('http://localhost:8080/course', {
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
    }
    return (
        <Container maxWidth="xl" sx={{ mt: 2, height: 'calc(100vh - 100px)' }}>
            <Typography variant="h4" fontWeight="550" gutterBottom>
                Manage Student
            </Typography>
            <Grid container spacing={3} sx={{ height: 'calc(100% - 60px)' }}>
                <Grid size={6} sx={{ height: '100%', overflowY: 'auto' }}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Paper elevation={1} sx={{ p: 1, mb: 2, width: '100%' }}>
                            <TextField
                                id="standard-search"
                                label="Search Id"
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
                                        name="tel_no"
                                        value={newStudent.tel_no}
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

                                <Grid size={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Courses Enrolled</InputLabel>
                                        <Select
                                            multiple
                                            value={newStudent.courses} // This should hold the entire course objects
                                            onChange={handleCourseChange}
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
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={clearFields}
                                        sx={{ml:2}}
                                    >
                                        Clear
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
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteStudent(student.id)}>
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
        </Container>
    );
};

export default Students;