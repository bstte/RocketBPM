import { useEffect } from "react";
import { useSelector } from "react-redux";
import { checkFavProcess } from "../API/api";

const useCheckFavorite = ({ id, nodes = [], childNodes = [], setIsFavorite }) => {
  const LoginUser = useSelector((state) => state.user.user);

  // ✅ PageGroupId ko effect ke bahar nikal lo
  const PageGroupId =
    nodes.length > 0 ? nodes[0]?.PageGroupId : childNodes[0]?.PageGroupId;

  useEffect(() => {
    const checkFav = async () => {
      const user_id = LoginUser?.id || null;
      const process_id = id || null;

      if (!user_id || !process_id) {
        console.error("Missing required fields:", { user_id, process_id });
        return;
      }

      try {
        const response = await checkFavProcess(user_id, process_id, PageGroupId);
      
        setIsFavorite(response.exists);
      } catch (error) {
        console.error("❌ checkFav error:", error);
      }
    };

    checkFav();
  }, [LoginUser, id, PageGroupId]); // ✅ ab error nahi aayega
};

export default useCheckFavorite;
