import type { User } from "@/types/uiTypes"

const API_URL = "https://your-api-url.com/api"
const authService = {
    async login(username: string, password: string): Promise<User> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Login failed")
            }

            const data = await response.json()
            return {
                id: data.user.id,
                username: data.user.username,
                email: data.user.email,
                token: data.token,
            }
        } catch (error) {
            console.error("Login service error:", error)
            throw error
        }
    },

    async register(username: string, email: string, password: string): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Registration failed")
            }
        } catch (error) {
            console.error("Register service error:", error)
            throw error
        }
    },
}

export default authService