import AsyncStorage from "@react-native-async-storage/async-storage";

interface ApiResponse<T = any> {
  data: T;
  error?: string;
  status: number;
}

type QueryParams = Record<string, string | number | boolean>;


class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders(): Promise<Headers> {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    // Add auth token if available
    const userData = await AsyncStorage.getItem("user");
    if (userData) {
      const { token } = JSON.parse(userData);
      headers.append("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  async get<T>(endpoint: string, options?: { params?: QueryParams }): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();

      // Build URL with query params if provided
      let url = `${this.baseUrl}${endpoint}`;

      if (options?.params) {
        const queryParams = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          data: {} as T,
          error: data.message || "An error occurred",
          status: response.status,
        };
      }

      return { data, status: response.status };
    } catch (error) {
      return {
        data: {} as T,
        error: error instanceof Error ? error.message : "Network error",
        status: 500,
      };
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();


      if (!response.ok) {
        return {
          data: {} as T,
          error: data.message || "An error occurred",
          status: response.status,
        };
      }

      return { data, status: response.status };
    } catch (error) {
      return {
        data: {} as T,
        error: error instanceof Error ? error.message : "Network error",
        status: 500,
      };
    }
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          data: {} as T,
          error: data.message || "An error occurred",
          status: response.status,
        };
      }

      return { data, status: response.status };
    } catch (error) {
      return {
        data: {} as T,
        error: error instanceof Error ? error.message : "Network error",
        status: 500,
      };
    }
  }

  async uploadFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      // Remove content-type to let the browser set it with the boundary
      headers.delete("Content-Type");

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          data: {} as T,
          error: data.message || "An error occurred",
          status: response.status,
        };
      }

      return { data, status: response.status };
    } catch (error) {
      return {
        data: {} as T,
        error: error instanceof Error ? error.message : "Network error",
        status: 500,
      };
    }
  }
}

export const api = new ApiClient(process.env.EXPO_PUBLIC_API_URL || "");
