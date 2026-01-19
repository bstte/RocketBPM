import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    TextField,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { getManagedProcesses } from "../../../API/api";

// Material UI Icon for Approval (Red Arrow)
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

// Helper for formatting dates "Feb 20, 2025"
const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const ManagedProcessesWidget = ({ userId }) => {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("process_name");
    const [filterText, setFilterText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId]);

    const fetchData = async () => {
        try {
            const response = await getManagedProcesses({ user_id: userId });
            if (response.status) {
                setProcesses(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch managed processes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };

    const filteredProcesses = processes.filter((row) =>
        row.process_name.toLowerCase().includes(filterText.toLowerCase())
    );

    const sortedProcesses = filteredProcesses.sort((a, b) => {
        const aValue = a[orderBy] || "";
        const bValue = b[orderBy] || "";

        if (order === "asc") {
            return aValue < bValue ? -1 : 1;
        } else {
            return aValue > bValue ? -1 : 1;
        }
    });

    return (
        <Box
            sx={{
                mt: 4,
                border: "1px solid #000",
                borderRadius: "4px",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    backgroundColor: "#fff",
                    p: 1.5,
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: "#1c39BB",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: "1rem",
                    }}
                >
                    <span style={{ fontSize: "1.2rem" }}>★</span> My managed Processes
                </Typography>

                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Filter..."
                    value={filterText}
                    onChange={handleFilterChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 200 }}
                />
            </Box>

            <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="managed processes table">
                    <TableHead>
                        <TableRow>
                            {[
                                { id: "process_name", label: "Process" },
                                { id: "process_world", label: "Process World" },
                                { id: "roles", label: "My BPM Roles" },
                                { id: "draft_date", label: "Draft" },
                                { id: "to_be_published_on", label: "To be published on" },
                                { id: "published_date", label: "Published" },
                                { id: "todo", label: "To-do" },
                            ].map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    sortDirection={orderBy === headCell.id ? order : false}
                                    sx={{
                                        fontWeight: "bold",
                                        color: "#1c39BB",
                                        fontSize: "0.80rem",
                                    }}
                                >
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : "asc"}
                                        onClick={() => handleRequestSort(headCell.id)}
                                    >
                                        {headCell.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : sortedProcesses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No managed processes found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedProcesses.map((row) => (
                                <TableRow
                                    key={row.id}
                                    hover
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        sx={{
                                            color: "#1c39BB",
                                            cursor: "pointer",
                                            fontWeight: 500,
                                        }}
                                        onClick={() => navigate(`/process/${row.id}/${row.target_level || 'Level0'}`)}
                                    >
                                        {row.process_name}
                                    </TableCell>
                                    <TableCell>{row.process_world}</TableCell>
                                    <TableCell>{row.roles.join(", ")}</TableCell>
                                    <TableCell>{formatDate(row.draft_date)}</TableCell>
                                    <TableCell>{formatDate(row.to_be_published_on)}</TableCell>
                                    <TableCell>{formatDate(row.published_date)}</TableCell>
                                    <TableCell>
                                        {row.todo === "Approval" && (
                                            <Box
                                                component="span"
                                                onClick={() => navigate(`/process/${row.id}/${row.target_level || 'Level0'}`)}
                                                sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                    color: "#ff364a",
                                                    cursor: "pointer",
                                                    fontWeight: "bold",
                                                    "&:hover": { textDecoration: "underline" },
                                                }}
                                            >
                                                <ArrowCircleRightIcon sx={{ color: "#ff364a", fontSize: "1.2rem" }} />
                                                Approval
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ManagedProcessesWidget;
