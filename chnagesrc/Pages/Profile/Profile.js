import React from 'react';
import { Box, Typography, Avatar, Card, CardContent, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import CustomDrawer from '../../components/CustomDrawer';

const Profile = () => {
    const user = useSelector((state) => state.user.user); // Assuming user contains 'name', 'email', and 'type'

    return (
        <div>
            <CustomDrawer title="Profile" />
            <Box sx={{ padding: 4 ,marginTop:"64px"}}>
                <Card sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            {/* Left Side: Avatar */}
                            <Grid item xs={3}>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        bgcolor: '#3f51b5', // Profile avatar background color
                                    }}
                                >
                                    {user.first_name.charAt(0).toUpperCase()}
                                </Avatar>
                            </Grid>

                            {/* Right Side: User Details */}
                            <Grid item xs={9}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    {`Name: ${user.first_name}`}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                                    {`Email: ${user.email}`}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                                    {` Type: ${user.type}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
};

export default Profile;
