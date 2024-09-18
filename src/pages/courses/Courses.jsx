import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Edit as EditIcon, Delete as DeleteIcon } from 'lucide-react';

function Courses() {
    const [courses, setCourses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({ id:'', code: '', title: '', description: ''});
    const [isEditing, setIsEditing] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        loadAllCourses();
    }, []);

    const handleOpenDialog = (course = null) => {
        if (course) {
            setCurrentCourse(course);
            setIsEditing(true);
        } else {
            setCurrentCourse({ id: '', code: '', title: '', description: '' });
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentCourse({ id:'', code: '', title: '', description: '' });
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCourse(prev => ({ ...prev, [name]: value }));
    };

    // add/update course 
    const handleSubmit = () => {
        if (isEditing) {
            axios.put(`http://localhost:8080/course/${currentCourse.id}`, {
                "code": currentCourse.code,
                "title": currentCourse.title,
                "description": currentCourse.description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(function (response) {
                    // console.log(response);
                    clearFields();
                    loadAllCourses();
                })
                .catch(function (error) {
                    console.log(error);
                });
            
        } else {
            axios.post('http://localhost:8080/course', {
                "code": currentCourse.code,
                "title": currentCourse.title,
                "description": currentCourse.description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(function (response) {
                    // console.log(response);
                    clearFields();  
                    loadAllCourses();
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        handleCloseDialog();
    };
    
    // load all courses
    const loadAllCourses = () => {
        axios.get('http://localhost:8080/course', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                // console.log(response.data   );
                setCourses(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    };

    // delete course
    const handleDeleteCourse = (id) => {
        axios.delete(`http://localhost:8080/course/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                // console.log(response);
                loadAllCourses();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const clearFields = () => {
        setCurrentCourse({ code: '', title: '', description: ''});
    }


    return (
        <Container maxWidth="xl" sx={{ mt: 2, height: 'calc(100vh - 100px)' }} >
            <Typography variant="h4" fontWeight="550" gutterBottom>
                Manage Course
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
                Add Course
            </Button>
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
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCourse(course.id)}>
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
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        value={currentCourse.title}
                        onChange={handleInputChange}
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
        </Container>
    );
};

export default Courses;