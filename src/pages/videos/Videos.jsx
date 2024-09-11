import * as React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Accordion, Container, Typography, Button } from '@mui/material';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

export default function Videos() {
    const [data, setData] = useState([]);
    const [courses, setCourses] = useState([
        { id: 'sdf453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
        { id: 'sdf67453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
        { id: 'sdf467453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
        { id: 'sdfg453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
        { id: 'sdfq453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
        { id: 'sdrf453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
        { id: 'sdjf453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
    ]);
    const [videos, setvideos] = useState([
        { id: 'sdf453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
        { id: 'sdf67453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
        { id: 'sdf467453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
        { id: 'sdfg453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
        { id: 'sdfq453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
        { id: 'sdrf453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
        { id: 'sdjf453', title: 'Testing', description: 'Testing decripption', videoPaths: ["r565657", "ghjghj"] },
    ]);

    useEffect(() => {
        loadAll();
    }, [])

    const loadAll = () => {
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(function (response) {
                console.log(response);
                setData(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Typography variant="h4" fontWeight="550" gutterBottom>
                Manage Videos
            </Typography>

            {courses.map((course) => (
                <Accordion sx={{ mb: 1 }}
                    key={course.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography variant="h6" fontWeight="550" gutterBottom>
                            {`ID: ${course.id} | ${course.title}`}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                sx={{ height: 140 }}
                                image='src/assets/images/contemplative-reptile.jpg'
                                title="green iguana"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    Lizard
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Lizards are a widespread group of squamate reptiles, with over 6,000
                                    species, ranging across all continents except Antarctica
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Share</Button>
                                <Button size="small">Learn More</Button>
                            </CardActions>
                        </Card>
                    </AccordionDetails>
                    <AccordionActions>
                        <Button>Cancel</Button>
                        <Button>Agree</Button>
                    </AccordionActions>
                </Accordion>
            ))}
        </Container>
    );
}