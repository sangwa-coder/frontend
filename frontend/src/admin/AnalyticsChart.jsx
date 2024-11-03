import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Grid, Typography, useTheme } from '@mui/material';
import { getUsers, getResearch, getThreads } from '../services/AdminService';


const AnalyticsChart = () => {
    const [usersData, setUsersData] = useState([]);
    const [researchData, setResearchData] = useState([]);
    const [threadsData, setThreadsData] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await getUsers();
                const research = await getResearch();
                const threads = await getThreads();

                console.log('Users Data:', users);
                console.log('Research Data:', research);
                console.log('Threads Data:', threads);

                setUsersData(prepareUsersChartData(users));
                setResearchData(prepareChartData(research, 'datePublished'));
                setThreadsData(prepareThreadsChartData(threads));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const prepareUsersChartData = (data) => {
        const roles = data.reduce((acc, user) => {
            if (acc[user.role]) {
                acc[user.role] += 1;
            } else {
                acc[user.role] = 1;
            }
            return acc;
        }, {});

        return Object.keys(roles).map(role => ({
            name: role,
            count: roles[role]
        }));
    };

    const prepareChartData = (data, dateField) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartData = months.map(month => ({ name: month, count: 0 }));

        data.forEach(item => {
            const date = item[dateField] ? new Date(item[dateField]) : null;
            if (date) {
                const month = date.getMonth();
                if (chartData[month]) {
                    chartData[month].count += 1;
                }
            }
        });

        console.log('Prepared Chart Data:', chartData);

        return chartData;
    };

    const prepareThreadsChartData = (data) => {
        const chartData = [
            { name: 'Jan', count: 0 },
            { name: 'Feb', count: 0 },
            { name: 'Mar', count: 0 },
            { name: 'Apr', count: 0 },
            { name: 'May', count: 0 },
            { name: 'Jun', count: 0 },
            { name: 'Jul', count: 0 },
            { name: 'Aug', count: 0 },
            { name: 'Sep', count: 0 },
            { name: 'Oct', count: 0 },
            { name: 'Nov', count: 0 },
            { name: 'Dec', count: 0 }
        ];

        data.forEach(thread => {
            const date = thread.created_at ? new Date(thread.created_at) : null;
            if (date) {
                const month = date.getMonth();
                chartData[month].count += 1;
            }
        });

        return chartData;
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                    Users by Role
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={usersData}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill={theme.palette.primary.main}
                            label
                        >
                            {usersData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={theme.palette.primary[500]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                    Research by Month
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={researchData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill={theme.palette.secondary.main} />
                    </BarChart>
                </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                    Threads by Month
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={threadsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Grid>
        </Grid>
    );
};

export default AnalyticsChart;
