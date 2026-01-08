import { useState, useEffect, useCallback } from "react";
import { contectApprovalStatus } from "../API/api";
import { getLevelKey } from "../utils/getLevel";

export const useApprovalStatus = ({ processId, currentLevel, currentParentId }) => {
    const [pendingApproval, setPendingApproval] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchApprovalStatus = useCallback(async () => {
        if (!processId || currentLevel === undefined) return;

        try {
            setLoading(true);
            const payload = {
                process_id: processId,
                level: getLevelKey(currentLevel, currentParentId),
            };

            const res = await contectApprovalStatus(payload);
            console.log("Approval status response:", res);
            if (res?.data?.status === true) {
                setPendingApproval(res.data.data);
            } else {
                setPendingApproval(null);
            }
        } catch (error) {
            console.error("Approval status error:", error);
            setPendingApproval(null);
        } finally {
            setLoading(false);
        }
    }, [processId, currentLevel, currentParentId]);

    useEffect(() => {
        fetchApprovalStatus();
    }, [fetchApprovalStatus]);

    return { pendingApproval, loading, refetch: fetchApprovalStatus };
};
