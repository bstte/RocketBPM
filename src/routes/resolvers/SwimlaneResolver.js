import { useParams } from "react-router-dom";
import SwimlaneModel from "../../Pages/Map_level/Swimlane_model";
import DraftSwimlineLevel from "../../Pages/Map_level/DraftProcessView/DraftSwimlineLevel";
import PublishedSwimlaneModel from "../../Pages/Map_level/PublishedProcess/PublishedSwimlaneModel";


const SwimlaneResolver = () => {
    const { mode } = useParams();

    let Component;

    switch (mode) {
        case "edit":
            Component = SwimlaneModel;
            break;

        case "draft":
            Component = DraftSwimlineLevel;
            break;

        case "published":
            Component = PublishedSwimlaneModel;
            break;

        default:
            return <div>Invalid mode</div>;
    }

    return <Component />;
};

export default SwimlaneResolver;
