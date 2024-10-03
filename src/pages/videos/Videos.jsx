import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Accordion, Container, Typography, Button, Box, Dialog, IconButton, DialogTitle, DialogContent, DialogActions, TextField, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Edit as EditIcon, Trash2 as DeleteIcon } from 'lucide-react';

function Videos() {
    const [courses, setCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState({ id: '', code: '', title: '', description: '', videos: [] });
    const [currentVideo, setCurrentVideo] = useState({
        id: '',
        name: '',
        videoFile: null,
        thumbnailFile: null
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [isTokenValid, setTokenValid] = useState(true);
    const token = localStorage.getItem('token');
    const serverUrl = "http://localhost:8080";

    useEffect(() => {
        loadAllCourses();
        handleTokenValidation();
    }, [isTokenValid]);

    const handleTokenValidation = () => {
        if (!isTokenValid) {
            localStorage.removeItem('token');
        }
    }

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
        setCurrentVideo({ id: '', name: '', videoFile: null, thumbnailFile: null });
        //setIsEditing(false);
    };

    const handleVideoClick = (video) => {
        setCurrentVideo(video);
        setIsEditing(true);
        setOpenDialog(true);
    };

    const handleAddVideoClick = () => {
        setCurrentVideo({ id: '', name: '', videoFile: null, thumbnailFile: null });
        setIsEditing(false);
        setOpenDialog(true);
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        // Append video and thumbnail files to the FormData object
        if (currentVideo.videoFile) {
            formData.append('video', currentVideo.videoFile);
        }
        if (currentVideo.thumbnailFile) {
            formData.append('thumbnail', currentVideo.thumbnailFile);
        }

        try {
            if (isEditing) {
                // Update video details
                const response = await axios.put(`${serverUrl}/video/update/${currentVideo.id}`, {
                    name: currentVideo.name,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                await axios.post(`${serverUrl}/video/file-upload/${response.data.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });

            } else {
                // Add new video
                const response = await axios.post(`${serverUrl}/video/add/${currentCourse.id}`, {
                    name: currentVideo.name,
                    
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                // console.log(response)
                // Upload files to the server
                await axios.post(`${serverUrl}/video/file-upload/${response.data.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            // Reload courses and close dialog
            loadAllCourses();
            handleCloseDialog();
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };


    const handleDeleteVideo = (videoId) => {
        axios.delete(`${serverUrl}/video/delete/${videoId}`, {
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
        axios.get(`${serverUrl}/course`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                // console.log(response);
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

                                        >
                                            <CardMedia
                                                sx={{ height: 140 }}
                                                image={`${serverUrl}/video/thumbnail/${video.id}`}
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
                                            <CardActions style={{ justifyContent: 'flex-end', marginRight: 10 }}>
                                                <Tooltip title="Edit video">
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleVideoClick(video)}>
                                                        <EditIcon color="blue" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Remove video">
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteVideo(video.id)}>
                                                        <DeleteIcon color="red" style={{ marginLeft: 10 }} />
                                                    </IconButton>
                                                </Tooltip>
                                                {/* <Button size="small" onClick={() => handleDeleteVideo(video.id)}>Remove video</Button> */}
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
                    <input
                        accept="video/*"
                        style={{ display: 'none' }}
                        id="video-file"
                        type="file"
                        onChange={(e) => setCurrentVideo({ ...currentVideo, videoFile: e.target.files[0] })}
                    />

                    <label htmlFor="video-file">
                        <Button variant="contained" component="span" style={{ marginRight: 5 }}>
                            Upload Video
                        </Button>
                    </label>
                    {currentVideo.videoFile && <Typography>{currentVideo.videoFile.name}</Typography>}

                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="thumbnail-file"
                        type="file"
                        onChange={(e) => setCurrentVideo({ ...currentVideo, thumbnailFile: e.target.files[0] })}
                    />

                    <label htmlFor="thumbnail-file">
                        <Button variant="contained" component="span">
                            Upload Thumbnail
                        </Button>
                    </label>
                    {currentVideo.thumbnailFile && <Typography>{currentVideo.thumbnailFile.name}</Typography>}
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