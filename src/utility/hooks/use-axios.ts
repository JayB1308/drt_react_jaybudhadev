import { useState } from "react";
import axiosInstance from "@configs/axios";

type Params = { [key: string]: string | number | boolean };

export function useAxios() {
  const [loading, setLoading] = useState(false);

  const get = async ({ url, params }: { url: string; params?: Params }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(url, {
        params,
      });
      return response.data;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    get,
    loading,
  };
}
