"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import authService from "@/services/authService"
import type { User } from "@/types/uiTypes"
import { router } from "expo-router"

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (username: string, password: string) => Promise<boolean>
    register: (username: string, email: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
    updateProfile: (profileData: Partial<User>) => Promise<User>
    uploadProfileImage: (imageUri: string) => Promise<string>
    isAuthenticated: boolean
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
            console.log("🚀 ~ login ~ userData:", userData)
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
            const success = await authService.register(username, email, password)
            return success
        } catch (error) {
            console.error("Registration error:", error)
            throw error
        }
    }

    const logout = async () => {
        try {
            if (user?.token) {
                await authService.logout(user.token)
            }
            await AsyncStorage.removeItem("user")
            setUser(null)
            router.replace('/login')
        } catch (error) {
            console.error("Logout error:", error)
            // Still remove from storage and redirect even if API fails
            await AsyncStorage.removeItem("user")
            setUser(null)
            router.replace('/login')
        }
    }

    const updateProfile = async (profileData: Partial<User>): Promise<User> => {
        try {
            if (!user?.id) {
                throw new Error("User not logged in")
            }

            const updatedUser = await authService.updateProfile(user.id, profileData)

            // Update local state and storage with new user data
            const newUserData = { ...user, ...updatedUser }
            setUser(newUserData)
            await AsyncStorage.setItem("user", JSON.stringify(newUserData))

            return updatedUser
        } catch (error) {
            console.error("Profile update error:", error)
            throw error
        }
    }

    const uploadProfileImage = async (imageUri: string): Promise<string> => {
        try {
            if (!user?.id) {
                throw new Error("User not logged in")
            }

            const { imageUrl } = await authService.uploadProfileImage(user.id, imageUri)

            // Update user with new image URL
            const updatedUser = { ...user, profileImage: imageUrl }
            setUser(updatedUser)
            await AsyncStorage.setItem("user", JSON.stringify(updatedUser))

            return imageUrl
        } catch (error) {
            console.error("Image upload error:", error)
            throw error
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                updateProfile,
                uploadProfileImage,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}