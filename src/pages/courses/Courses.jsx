import React, { useState } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Box, Tooltip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from 'lucide-react';

function Courses() {
    const [courses, setCourses] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({ id: '', title: '', description: '', videoPaths: [] });
    const [isEditing, setIsEditing] = useState(false);
    const folderPath = "C:/Users/course-videos";

    const handleOpenDialog = (course = null) => {
        if (course) {
            setCurrentCourse(course);
            setIsEditing(true);
        } else {
            setCurrentCourse({ id: '', title: '', description: '', videoPaths: [] });
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentCourse({ id: '', title: '', description: '', videoPaths: [] });
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (isEditing) {
            setCourses(courses.map(course => course.id === currentCourse.id ? currentCourse : course));
        } else {
            setCourses([...courses, { ...currentCourse }]);
        }
        handleCloseDialog();
        console.log(courses)
    };

    const handleDelete = (id) => {
        setCourses(courses.filter(course => course.id !== id));
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 2 }} >
            <Typography variant="h4" fontWeight="550" gutterBottom>
                Manage Course
            </Typography>
            <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
                Add Course
            </Button>
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
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(course.id)}>
                                        <DeleteIcon color="red" />
                                    </IconButton>
                                </Tooltip>
                            </>
                        }
                    >
                        <ListItemText
                            primary={
                                <Typography variant="h6">
                                    {course.title}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="body">
                                    {`ID: ${course.id} | ${course.description}`}
                                    <br />
                                    {`${course?.videoPaths?.lenght} videos`}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>

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

                    <Box sx={{ mt: 2 }}>
                        <input
                            accept="video/*"
                            style={{ display: 'none' }}
                            id="video-file"
                            type="file"
                            multiple
                            onChange={(e) => {
                                const newPaths = Array.from(e.target.files).map(file => `${folderPath}/${file.name}`);
                                setCurrentCourse(prev => ({ ...prev, videoPaths: isEditing ? newPaths : [...(prev.videoPaths || []), ...newPaths] }));
                            }}

                        />
                        <label htmlFor="video-file">
                            <Button variant="contained" component="span">
                                Select Videos
                            </Button>
                        </label>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {currentCourse?.videoPaths?.length > 0
                                ?
                                <Box sx={{ mt: 2 }}>
                                    {currentCourse.videoPaths?.map((path, index) => (
                                        <Typography key={index} variant="body2">
                                            {path}
                                            <IconButton onClick={() => {
                                                const updatedPaths = currentCourse.videoPaths.filter((_, i) => i !== index);
                                                setCurrentCourse(prev => ({ ...prev, videoPaths: updatedPaths }));
                                            }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Typography>
                                    ))}
                                </Box>
                                /*`Selected: ${currentCourse.videoPaths.join(', ')}`*/
                                : 'No videos selected'}
                        </Typography>
                    </Box>

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