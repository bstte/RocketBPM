import { useEffect, useState } from "react";
import { getLanguages } from "../API/api";

export function useLanguages() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const response = await getLanguages();
        // console.log("total translation get ",response.data)
        setLanguages(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLanguages();
  }, []);

  return { languages, loading, error };
}
