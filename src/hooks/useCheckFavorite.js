
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { checkFavProcess } from "../API/api";

const useCheckFavorite = ({ id, nodes = [], childNodes = [], setIsFavorite }) => {
  const LoginUser = useSelector((state) => state.user.user);

  useEffect(() => {
    const checkFav = async () => {
      const user_id = LoginUser?.id || null;
      const process_id = id || null;
      const PageGroupId =
        nodes.length > 0 ? nodes[0]?.PageGroupId : childNodes[0]?.PageGroupId;

      if (!user_id || !process_id) {
        console.error("Missing required fields:", { user_id, process_id });
        return;
      }

      try {
        const response = await checkFavProcess(user_id, process_id, PageGroupId);
        console.log("✅ checkFav response:", response);
        setIsFavorite(response.exists);
      } catch (error) {
        console.error("❌ checkFav error:", error);
      }
    };

    checkFav();
  }, [LoginUser, id]);
};

export default useCheckFavorite;
