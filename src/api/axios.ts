import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { decryptData, encryptData } from "../utils/utils";
import { toast } from "react-toastify";
import { toasts } from "../component/common/ui/Toast/Toast";
import ENVIRONMENT, {
  ENCRYPTION_EXCLUDED,
  ROUTES,
} from "../contants/constants";

/* ---------------------------------- */
/* AXIOS INSTANCE */
/* ---------------------------------- */

export const axiosApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST || ENVIRONMENT.API_HOST,
});

// Debug log to help identify if env vars are loaded correctly
if (import.meta.env.DEV) {
  console.log("Axios Base URL:", axiosApi.defaults.baseURL);
}

/* ---------------------------------- */
/* REQUEST INTERCEPTOR */
/* ---------------------------------- */

axiosApi.interceptors.request.use(
  (
    config: import("axios").InternalAxiosRequestConfig
  ): import("axios").InternalAxiosRequestConfig => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("forgotPassToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ---------------------------------- */
/* RESPONSE INTERCEPTOR */
/* ---------------------------------- */

axiosApi.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (Number(ENVIRONMENT.ENABLE_ENCRYPTION)) {
      const decryptedData = decryptData(response?.data?.resData);

      response.data = {
        ...response.data,
        data: decryptedData,
      };
    }

    return response;
  },
  (error: AxiosError<any>) => {
    if (Number(ENVIRONMENT.ENABLE_ENCRYPTION)) {
      const decryptedData = decryptData(error?.response?.data?.resData);
      handleError(decryptedData);
      throw decryptedData;
    }

    handleError(error);
    throw error;
  }
);

/* ---------------------------------- */
/* HELPERS */
/* ---------------------------------- */

const formatUrl = (
  url: string,
  params?: Record<string, string | number>
): string => {
  if (!params || Object.keys(params).length === 0) return url;
  return `${url}?${new URLSearchParams(
    params as Record<string, string>
  ).toString()}`;
};

const clearWaitingQueue = (): void => {
  toast.clearWaitingQueue();
};

const handleError = (error: any): void => {
  const errorStatus: number | undefined =
    error?.response?.status || error?.status;

  const errorMessage: string | undefined =
    error?.response?.data?.message || error?.data?.message || error?.message;

  if (errorStatus === 401 || errorStatus === 403) {
    toasts.error("Please re-login, last login session expired.");

    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    clearWaitingQueue();

    if (window.location.pathname !== ROUTES.ROOT) {
      window.location.replace(ROUTES.ROOT);
    }
  } else {
    errorMessage && toasts.error(errorMessage);
    clearWaitingQueue();
  }
};

const handleSuccess = (res: any): void => {
  if (res?.status === 200 || res?.status === 201) {
    res?.message && toasts.success(res.message);
    res?.data?.message && toasts.success(res.data.message);
  }

  if (res?.status === 400 || res?.status === 403) {
    res?.message && toasts.warning(res.message);
  }
};

const getPayloadData = (data: any, url = ""): any => {
  if (!data) return data;

  if (
    Number(ENVIRONMENT.ENABLE_ENCRYPTION) &&
    !ENCRYPTION_EXCLUDED.includes(url)
  ) {
    return { reqData: encryptData(data) };
  }

  return data;
};

/* ---------------------------------- */
/* HTTP METHODS */
/* ---------------------------------- */

export const apiCallGet = async <T = any>(
  url: string,
  params: Record<string, string | number> = {},
  toastOn?: boolean
): Promise<T> => {
  try {
    const res = await axiosApi.get(formatUrl(url, params));
    toastOn && handleSuccess(res.data);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const apiCallPost = async <T = any>(
  url: string,
  data: any,
  params: Record<string, string | number> = {},
  toastOn?: boolean,
  header?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = await axiosApi.post(
      formatUrl(url, params),
      getPayloadData(data, url),
      header || {}
    );

    toastOn && handleSuccess(res.data);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const apiCallPatch = async <T = any>(
  url: string,
  data: any,
  params: Record<string, string | number> = {},
  toastOn?: boolean
): Promise<T> => {
  try {
    const res = await axiosApi.patch(
      formatUrl(url, params),
      getPayloadData(data, url)
    );

    toastOn && handleSuccess(res.data);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const apiCallPut = async <T = any>(
  url: string,
  data: any,
  params: Record<string, string | number> = {},
  toastOn?: boolean
): Promise<T> => {
  try {
    const res = await axiosApi.put(
      formatUrl(url, params),
      getPayloadData(data, url)
    );

    toastOn && handleSuccess(res.data);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const apiCallDelete = async <T = any>(
  url: string,
  data: any = {},
  params: Record<string, string | number> = {},
  toastOn?: boolean
): Promise<T> => {
  try {
    const res = await axiosApi.delete(formatUrl(url, params), {
      data: getPayloadData(data, url),
    });

    toastOn && handleSuccess(res.data);
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
