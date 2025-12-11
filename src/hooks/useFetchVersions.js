import { useEffect, useState, useCallback } from "react";
import { versionlist } from "../API/api";
import { getLevelKey } from "../utils/getLevel";

export const useFetchVersions = ({
    processId,
    currentLevel,
    currentParentId,
    LoginUser,
    status,
}) => {
    const [responseData, setResponseData] = useState(null);

    const fetchVersions = useCallback(async () => {
        try {
            const LoginUserId = LoginUser ? LoginUser.id : null;

            // const levelParam =
            //     currentParentId !== null
            //         ? `level${currentLevel}_${currentParentId}`
            //         : `level${currentLevel}`;
const levelParam = getLevelKey(currentLevel, currentParentId);

            const response = await versionlist(
                processId,
                levelParam,
                LoginUserId,
                status
            );

            setResponseData(response);
            return response; // useful when called manually
        } catch (error) {
            console.error("Error fetching versions:", error);
        }
    }, [processId, currentLevel, currentParentId, LoginUser, status]);

    // initial load
    useEffect(() => {
        fetchVersions();
    }, [fetchVersions]);

    return { responseData, refetch: fetchVersions };
};
