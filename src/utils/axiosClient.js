import axios from "axios";

let mainURL = "https://json-api.uz/api/project/my-books";

export const axiosClient = axios.create({
  baseURL: mainURL,
});

axiosClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const errorObject = error.config;

    if (error.response && error.response.status === 403 && !errorObject._retry) {
      errorObject._retry = true;

      try {
        const refresh_token = window.localStorage.getItem("refresh_token");

        const { data } = await axios.post(`${mainURL}/auth/refresh-token`, {
          refresh_token,
        });

        window.localStorage.setItem("access_token", data.access_token); // Corrected typo here
        return axiosClient(errorObject);
      } catch (refreshError) {
        console.log(refreshError.message);
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("refresh_token");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

