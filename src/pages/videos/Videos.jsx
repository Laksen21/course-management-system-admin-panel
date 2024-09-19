import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Accordion, Container, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

function Videos() {
    const [courses, setCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState({ id: '', code: '', title: '', description: '', videos: [] });
    const [currentVideo, setCurrentVideo] = useState({ id: '', name: '', videoFilePath: '', thumbnailFilePath: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        loadAllCourses();
    }, [])

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentVideo(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectCourse = (course) => {
        setCurrentCourse(course);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentVideo({ id: '', name: '', videoFilePath: '', thumbnailFilePath: '' });
        //setIsEditing(false);
    };

    const handleVideoClick = (video) => {
        setCurrentVideo(video);
        setIsEditing(true);
        setOpenDialog(true);
    };

    const handleAddVideoClick = () => {
        setCurrentVideo({ id: '', name: '', videoFilePath: '', thumbnailFilePath: '' });
        setIsEditing(false);
        setOpenDialog(true);
    };

    const handleSubmit = () => {
        if (isEditing) {
            axios.put(`http://localhost:8080/video/update/${currentVideo.id}`, {
                "name": currentVideo.name,
                "videoFilePath": currentVideo.videoFilePath,
                "thumbnailFilePath": currentVideo.thumbnailFilePath
            }, {
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
        } else {
            axios.post(`http://localhost:8080/video/add/${currentCourse.id}`, {
                "name": currentVideo.name,
                "videoFilePath": currentVideo.videoFilePath,
                "thumbnailFilePath": currentVideo.thumbnailFilePath
            }, {
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
        }
        handleCloseDialog();
    };

    const handleDeleteVideo = (videoId) => {
        axios.delete(`http://localhost:8080/video/delete/${videoId}`, {
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

    return (
        <Container maxWidth="xl" sx={{ mt: 2, height: 'calc(100vh - 100px)' }}>
            <Typography variant="h4" fontWeight="550" gutterBottom>
                Manage Videos
            </Typography>
            <Grid container spacing={3} sx={{ height: 'calc(100% - 80px)' }}>
                <Grid size={12} sx={{ height: '100%', overflowY: 'auto' }}>
                    {courses.map((course) => (
                        <Accordion sx={{ margin: 2 }}
                            key={course.id}
                            expanded={expanded === course.id} 
                            onChange={handleChange(course.id)}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon fontSize="large" />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                onClick={() => handleSelectCourse(course)}
                            >
                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                    {` ${course.code} | ${course.title}`}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', overflowX: 'auto' }}>
                                    {course.videos.map((video) => (
                                        <Card sx={{ maxWidth: 345, margin: 1 }}
                                            key={video.id}
                                            onClick={() => handleVideoClick(video)}
                                        >
                                            <CardMedia
                                                sx={{ height: 140 }}
                                                image={video.thumbnailFilePath} //|| 'src/assets/images/contemplative-reptile.jpg'
                                                title={video.name}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h6" component="div">
                                                    {video.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Video : {video.videoFilePath}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Thumbnail : {video.thumbnailFilePath}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small" onClick={() => handleDeleteVideo(video.id)}>Remove video</Button>
                                            </CardActions>
                                        </Card>
                                    ))}
                                    <Card sx={{ maxWidth: 345, margin: 1 }} onClick={handleAddVideoClick} style={{ cursor: 'pointer' }}>
                                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <AddCircleOutlineIcon fontSize="large" />
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Add video
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Edit Video' : 'Add Video'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={currentVideo.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="videoFilePath"
                        label="Video file path"
                        type="text"
                        fullWidth
                        value={currentVideo.videoFilePath}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="thumbnailFilePath"
                        label="Thumbnail file path"
                        type="text"
                        fullWidth
                        value={currentVideo.thumbnailFilePath}
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
}

export default Videos;