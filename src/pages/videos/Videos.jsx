import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Accordion, Container, Typography, Button, Box, Dialog, IconButton, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, Tooltip, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid2';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Edit as EditIcon, Trash2 as DeleteIcon } from 'lucide-react';

import Loader from '../../components/loader/Loader';

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
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [delMsgOpen, setDelMsgOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState(null);
    const [alert, setAlert] = useState({ show: false, severity: 'success', title: '', message: '' });
    const [errors, setErrors] = useState({ name: false, videoFile: false, thumbnailFile: false });
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

    const handleAccordionChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentVideo(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false })); // Remove error when input changes
        }
    };

    // Add validation for empty fields
    const validateForm = () => {
        const newErrors = {
            name: currentVideo.name.trim() === '',
            thumbnailFile: !isEditing && currentVideo.thumbnailFile === null,
            videoFile: !isEditing && currentVideo.videoFile === null,
        };
        setErrors(newErrors);
        return !Object.values(newErrors).includes(true);
    };

    const handleSelectCourse = (course) => {
        setCurrentCourse(course);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentVideo({ id: '', name: '', videoFile: null, thumbnailFile: null });
        //setIsEditing(false);
        setErrors({ name: false, videoFile: false, thumbnailFile: false });
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
        setErrors({ name: false, videoFile: false, thumbnailFile: false });
    };

    //alerts
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

    const handleSubmit = async () => {
        if (!validateForm()) return; // Prevent submission if validation fails
        setIsActionLoading(true);
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
                })
                    .catch(function (error) {
                        console.log(error);
                        setIsActionLoading(false);
                        showAlert('error', 'Update Failed', 'Failed to update the video. Please try again.');
                    });

                await axios.post(`${serverUrl}/video/file-upload/${response.data.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(function (response) {
                        // console.log(response);
                        setIsActionLoading(false);
                        showAlert('success', 'Video Updated', 'The video has been successfully updated.');
                    })
                    .catch(function (error) {
                        console.log(error);
                        setIsActionLoading(false);
                        showAlert('error', 'Update Failed', 'Failed to update the video. Please try again.');
                    });

            } else {
                // Add new video
                const response = await axios.post(`${serverUrl}/video/add/${currentCourse.id}`, {
                    name: currentVideo.name,

                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .catch(function (error) {
                        console.log(error);
                        setIsActionLoading(false);
                        showAlert('error', 'Addition Failed', 'Failed to add the video. Please try again.');
                    });

                // console.log(response)
                // Upload files to the server
                await axios.post(`${serverUrl}/video/file-upload/${response.data.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    }
                })
                    .then(function (response) {
                        // console.log(response);
                        setIsActionLoading(false);
                        showAlert('success', 'Video Added', 'The video has been successfully added.');
                    })
                    .catch(function (error) {
                        console.log(error);
                        setIsActionLoading(false);
                        showAlert('error', 'Addition Failed', 'Failed to add the video. Please try again.');
                    });
            }

            // Reload courses and close dialog
            loadAllCourses();
            handleCloseDialog();
            setIsActionLoading(false);

        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    // delete video
    const handleDeleteVideo = (videoId) => {
        setIsActionLoading(true);
        axios.delete(`${serverUrl}/video/delete/${videoId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(function (response) {
                // console.log(response);
                loadAllCourses();
                setIsActionLoading(false);
                showAlert('success', 'Video Deleted', 'The video has been successfully deleted.');
            })
            .catch(function (error) {
                console.log(error);
                setIsActionLoading(false);
                showAlert('error', 'Deletion Failed', 'Failed to delete the video. Please try again.');
            });
    };

    const handleDelBtnClick = (video) => {
        setVideoToDelete(video);
        setDelMsgOpen(true);
    };

    const handleClose = () => {
        setDelMsgOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (videoToDelete) {
            handleDeleteVideo(videoToDelete.id);
        }
        setDelMsgOpen(false);
    };

    const handleDeleteCancel = () => {
        setVideoToDelete(null);
        setDelMsgOpen(false);
    };

    // load courses
    const loadAllCourses = () => {
        axios.get(`${serverUrl}/course`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                // console.log(response);
                setCourses(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
                setAlert({ show: true, severity: 'error', title: 'Loading Error', message: 'Failed to load course videos. Please reload the page.' });
            });
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 2, height: 'calc(100vh - 100px)' }}>
            {(isLoading || isActionLoading) && (
                <div className="loader-container">
                    <Loader />
                </div>
            )}
            <Typography variant="h4" fontWeight="550" gutterBottom>
                Manage Videos
            </Typography>

            {alert.show && (
                <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, show: false })} sx={{ mb: 2 }}>
                    <AlertTitle>{alert.title}</AlertTitle>
                    {alert.message}
                </Alert>
            )}

            <Grid container spacing={3} sx={{ height: 'calc(100% - 80px)' }}>
                <Grid size={12} sx={{ height: '100%', overflowY: 'auto' }}>
                    {courses.map((course) => (
                        <Accordion sx={{ margin: 2 }}
                            key={course.id}
                            expanded={expanded === course.id}
                            onChange={handleAccordionChange(course.id)}
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
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelBtnClick(video)}>
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
                        error={errors.name}
                        helperText={errors.name ? 'Name is required' : ''}
                    />
                    <input
                        accept="video/*"
                        style={{ display: 'none' }}
                        id="video-file"
                        type="file"
                        onChange={(e) => {
                            setCurrentVideo({ ...currentVideo, videoFile: e.target.files[0] });
                            setErrors(prev => ({ ...prev, videoFile: false }));
                        }}
                    />

                    <label htmlFor="video-file">
                        <Button variant="contained" component="span" style={{ marginRight: 5 }}>
                            Upload Video
                        </Button>
                    </label>
                    {currentVideo.videoFile && <Typography>{currentVideo.videoFile.name}</Typography>}
                    {errors.videoFile && <Typography color="error" sx={{ fontSize: '12px' }}>Video file is required</Typography>}

                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="thumbnail-file"
                        type="file"
                        onChange={(e) => {
                            setCurrentVideo({ ...currentVideo, videoFile: e.target.files[0] });
                            setErrors(prev => ({ ...prev, videoFile: false }));
                        }}
                    />

                    <label htmlFor="thumbnail-file">
                        <Button variant="contained" component="span">
                            Upload Thumbnail
                        </Button>
                    </label>
                    {currentVideo.thumbnailFile && <Typography>{currentVideo.thumbnailFile.name}</Typography>}
                    {errors.thumbnailFile && <Typography color="error" sx={{ fontSize: '12px' }}>Thumbnail file is required</Typography>}
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
                        Deleting this video will remove all its data. Are you sure you want to continue?
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
}

export default Videos;