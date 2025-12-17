import { useParams } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import MapLevel from "../../Pages/Map_level/MapLevel";
import DraftProcesMapLevel from "../../Pages/Map_level/DraftProcessView/DraftProcesMapLevel";
import PublishedMapLevel from "../../Pages/Map_level/PublishedProcess/PublishedMapLevel";


const MapResolver = () => {
    const { mode } = useParams();

    let Component;

    switch (mode) {
        case "edit":
            Component = MapLevel;
            break;

        case "draft":
            Component = DraftProcesMapLevel;
            break;

        case "published":
            Component = PublishedMapLevel;
            break;

        default:
            return <div>Invalid mode</div>;
    }

    //   return (
    //     <ReactFlowProvider>
    //       <Component />
    //     </ReactFlowProvider>
    //   );

    return (

        <Component />

    );
};

export default MapResolver;
