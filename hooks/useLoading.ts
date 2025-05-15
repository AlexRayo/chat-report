import { useState, useCallback } from "react";

function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);
  const toggleLoading = useCallback(() => setLoading((prev) => !prev), []);

  return {
    loading,
    startLoading,
    stopLoading,
    toggleLoading,
  };
}

export default useLoading;
