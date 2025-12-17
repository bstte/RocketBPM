import React from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useProcessNavigation } from "../hooks/useProcessNavigation";

const ProcessMenu = ({ item, ProcessTitle, checkpublish, t }) => {
  const navigate = useNavigate();
  const { goToProcess } = useProcessNavigation();
  const getProcessTitle = (id) => {
    const process = ProcessTitle?.find((p) => p.id === parseInt(id));
    return process ? process.process_title : "";
  };

  const handleNavigate = (type) => {
    switch (type) {
      case "published":
        goToProcess({
          mode: "published",
          view: "map",
          processId: item.processId,
        });
        break;

      case "draft":
        goToProcess({
          mode: "draft",
          view: "map",
          processId: item.processId,
        });
        break;

      case "manage":
        navigate("/users", { state: { process: { id: parseInt(item.processId), user_id: item.id } } });
        break;

      case "setting":
        navigate("/setting", { state: { ProcessId: parseInt(item.processId) } });
        break;

      default:
        break;
    }
  };
  // const handleNavigate = (type) => {

  //   if (type === "published") {
  //     navigate(`/published-map-level/${item.processId}`);
  //   } else if (type === "draft") {
  //     navigate(`/draft-process-view/${item.processId}`);
  //   } else if (type === "manage") {
  //     navigate("/users", { state: { process: { id: parseInt(item.processId), user_id: item.id } } });
  //   } else if (type === "setting") {
  //     navigate("/setting", { state: { ProcessId: parseInt(item.processId) } });
  //   }
  // };

  const renderMenuItems = () => {
    if (item.type === "self") {
      return (
        <>
          {checkpublish && <p onClick={() => handleNavigate("published")} className="menuitems">{t('View_published')}</p>}
          <p onClick={() => handleNavigate("draft")} className="menuitems">{t('View_draft')}</p>
          <p onClick={() => handleNavigate("manage")} className="menuitems">{t('Manage_users')}</p>
          <p onClick={() => handleNavigate("setting")} className="menuitems">{t('Edit_settings')}</p>
        </>
      );
    }

    if (item.role === "Administrator") {
      return (
        <>
          {checkpublish && <p onClick={() => handleNavigate("published")} className="menuitems">{t('View_published')}</p>}
          <p onClick={() => handleNavigate("draft")} className="menuitems">{t('View_draft')}</p>
          <p onClick={() => handleNavigate("manage")} className="menuitems">{t('Manage_users')}</p>
          <p onClick={() => handleNavigate("setting")} className="menuitems">{t('Edit_settings')}</p>
        </>
      );
    }

    if (["User", "Modeler"].includes(item.role)) {
      return (
        <>
          {checkpublish && <p onClick={() => handleNavigate("published")} className="menuitems">{t('View_published')}</p>}
          <p onClick={() => handleNavigate("draft")} className="menuitems">{t('View_draft')}</p>
        </>
      );
    }

    return null;
  };


  return (
    <Box
      sx={{
        position: "absolute",
        top: 35,
        right: 10,
        width: "260px",
        bgcolor: "white",
        boxShadow: 3,
        borderRadius: 1,
        padding: 1,
        zIndex: 1000,
      }}
    >
      {renderMenuItems()}
    </Box>
  );
};

export default ProcessMenu;
