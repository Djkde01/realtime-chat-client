import { api } from "./apiClient";
import type { User } from "@/types/uiTypes";

interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

interface RegisterResponse {
  message: string;
}

interface LogoutResponse {
  message: string;
}

const authService = {
  async login(username: string, password: string): Promise<User> {
    const { data, error, status } = await api.post<LoginResponse>(
      "/api/auth/login/",
      {
        username,
        password,
      }
    );

    if (error || status !== 200) {
      throw new Error(error || "Invalid credentials");
    }

    // Add token to user object for easier access
    const user: User = {
      ...data.user,
      token: data.access,
    };

    return user;
  },

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<boolean> {
    const { error, status } = await api.post<RegisterResponse>(
      "/api/auth/register/",
      {
        username,
        email,
        password,
      }
    );

    if (error || status !== 201) {
      throw new Error(error || "Registration failed");
    }

    return true;
  },

  async logout(token: string): Promise<boolean> {
    const { error, status } = await api.post<LogoutResponse>("/auth/logout", {
      token,
    });

    // Even if the server fails, we should clear local storage
    return true;
  },

  async updateProfile(
    userId: string,
    profileData: Partial<User>
  ): Promise<User> {
    const { data, error, status } = await api.put<User>(
      `/api/users/${userId}/profile/`,
      profileData
    );

    if (error || status !== 200) {
      throw new Error(error || "Profile update failed");
    }

    return data;
  },

  async uploadProfileImage(
    userId: string,
    imageUri: string
  ): Promise<{ imageUrl: string }> {
    // Create form data for image upload
    const formData = new FormData();

    // Get file name from URI
    const filename = imageUri.split("/").pop() || "profile.jpg";

    // Create file object for form data
    // @ts-ignore - FormData append type issue in React Native
    formData.append("image", {
      uri: imageUri,
      name: filename,
      type: "image/jpeg",
    });

    const { data, error, status } = await api.uploadFormData<{
      imageUrl: string;
    }>(`/api/users/${userId}/profile-image/`, formData);

    if (error || status !== 200) {
      throw new Error(error || "Image upload failed");
    }

    return data;
  },
};

export default authService;
