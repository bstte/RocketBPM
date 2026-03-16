import React, { useState, useEffect, useContext } from "react";
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
import { getManagedProcesses, checkRecordWithGetLinkDraftData, checkPublishRecord } from "../../../API/api";
import { useTranslation } from "../../../hooks/useTranslation";
import { useProcessNavigation } from "../../../hooks/useProcessNavigation";

// Material UI Icon for Approval (Red Arrow)
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { BreadcrumbsContext } from "../../../context/BreadcrumbsContext";
import { buildBreadcrumbs } from "../../../utils/buildBreadcrumbs";

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
    const t = useTranslation();
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("process_world"); // Default sort by Node Name (Process column)
    const [filterText, setFilterText] = useState("");
    const { goToProcess } = useProcessNavigation();

    const { addBreadcrumb } = useContext(BreadcrumbsContext);

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId]);

    const fetchData = async () => {
        try {
            const response = await getManagedProcesses({ user_id: userId });
            console.log("managed weight data", response.data);
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
        (row.process_world || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (row.process_name || "").toLowerCase().includes(filterText.toLowerCase())
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

    // Navigation Logic matching Dashboard 
    const handleRowClick = async (row) => {
        try {
            const Process_id = row.id;
            const user_id = userId;
            const parentNodeId = row.target_node_id; // 👈 parent_id from backend

            const user = { id: user_id, type: "managed_process_click" };

            // 🧠 Level calculate (same as dashboard)
            // const newLevel = parentNodeId ? 1 : 0;

            const newLevel = parentNodeId?.match(/^level(\d+)/)?.[1]
                ? parseInt(parentNodeId.match(/^level(\d+)/)[1], 10) + 1
                : 0;
            // Level param construction (node based)
            // const levelParam = newLevel === 0
            //     ? "level0"
            //     : `level${newLevel}_${parentNodeId}`;

            const levelParam = `level${newLevel}${parentNodeId ? `_${parentNodeId}` : ""}`;
            console.log("Navigate:", levelParam, Process_id, parentNodeId);

            const [nodeData, publishdata] = await Promise.all([
                checkRecordWithGetLinkDraftData(
                    levelParam,
                    parseInt(user_id),
                    Process_id,
                    parentNodeId
                ),
                checkPublishRecord(levelParam, Process_id),
            ]);

            if (!nodeData?.status) {
                alert("First create next model of this existing model");
                return;
            }

            const processTitle = nodeData.processTitle?.process_title;
            const TitleTranslation = JSON.parse(
                nodeData.processTitle?.translations || "{}"
            );

            // 🌱 Root breadcrumb
            const state = { Process_id, processTitle, TitleTranslation };
            const basePath = publishdata.status
                ? `/published/map/${Process_id}`
                : `/draft/map/${Process_id}`;

            addBreadcrumb(processTitle, basePath, state);

            // 🌳 Child breadcrumbs (same logic as dashboard)
            const breadcrumbs = buildBreadcrumbs(
                nodeData.allNodes,
                nodeData.ids,
                Process_id,
                publishdata.status ? "Publish" : "draft"
            );

            breadcrumbs.forEach(({ label, path, state }) => {
                addBreadcrumb(label, path, state);
            });

            // 🚀 Navigation
            const mode = publishdata.status ? "published" : "draft";
            const view =
                nodeData.Page_Title === "Swimlane" ? "swimlane" : "map";

            if (newLevel === 0) {
                goToProcess({
                    mode,
                    view,
                    processId: Process_id,
                });
            } else {
                goToProcess({
                    mode,
                    view,
                    processId: Process_id,
                    level: newLevel,
                    parentId: parentNodeId,
                });
            }

        } catch (error) {
            console.error("Managed Process Navigation Error:", error);
        }
    };


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
                    <span style={{ fontSize: "1.2rem" }}>★</span> {t("my_managed_processes") || "My managed Processes"}
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
                                { id: "process_world", label: t("Process") || "Process" }, // Node Label in Process Column
                                { id: "process_name", label: t("process_world") || "Process World" }, // Root Name in PW Column
                                { id: "roles", label: t("my_bpm_roles") || "My BPM Roles" },
                                { id: "draft_date", label: t("Draft") },
                                { id: "to_be_published_on", label: t("to_be_published_on") },
                                { id: "published_date", label: t("Published") },
                                { id: "todo", label: t("todo") },
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
                                    {t("loading")}
                                </TableCell>
                            </TableRow>
                        ) : sortedProcesses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    {t("no_managed_processes_found") || "No managed processes found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedProcesses.map((row) => (
                                <TableRow
                                    key={row.unique_key || row.id}
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
                                        onClick={() => handleRowClick(row)}
                                    >
                                        {row.process_world}
                                    </TableCell>
                                    <TableCell>{row.process_name}</TableCell>
                                    <TableCell>{row.roles.join(", ")}</TableCell>
                                    <TableCell>{formatDate(row.draft_date)}</TableCell>
                                    <TableCell>{formatDate(row.to_be_published_on)}</TableCell>
                                    <TableCell>{formatDate(row.published_date)}</TableCell>
                                    <TableCell>
                                        {row.todo === "Approval" && (
                                            <Box
                                                component="span"
                                                onClick={() => handleRowClick(row)}
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
                                                {t("approval") || "Approval"}
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
