"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import authService from "@/services/authService"
import type { User } from "@/types/uiTypes"

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (username: string, password: string) => Promise<boolean>
    register: (username: string, email: string, password: string) => Promise<boolean>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is already logged in
        const loadUser = async () => {
            console.log("Loading user data...")
            try {
                const userData = await AsyncStorage.getItem("user")
                if (userData) {
                    setUser(JSON.parse(userData))
                }
            } catch (error) {
                console.error("Failed to load user data:", error)
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [])

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const userData = await authService.login(username, password)
            setUser(userData)
            await AsyncStorage.setItem("user", JSON.stringify(userData))
            return true
        } catch (error) {
            console.error("Login error:", error)
            throw error
        }
    }

    const register = async (username: string, email: string, password: string): Promise<boolean> => {
        try {
            await authService.register(username, email, password)
            return true
        } catch (error) {
            console.error("Registration error:", error)
            throw error
        }
    }

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("user")
            setUser(null)
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

