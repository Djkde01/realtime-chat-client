"use client"

import { useState } from "react"
import { SafeAreaView, ActivityIndicator, Alert } from "react-native"
import styled from "styled-components/native"
import { useAuth } from "@/context/AuthContext"
import { MessageSquare } from "@/components/ui/Icons"

import { ButtonProps } from "@/types/props"
import { router } from "expo-router"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const success = await login(username, password)
      if (success) {
        router.replace("/chat")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Please check your credentials and try again"
      Alert.alert("Login Failed", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <ContentContainer>
          <LogoContainer>
            <MessageSquare size={50} color="#0084ff" />
            <AppTitle>Real-time Chat</AppTitle>
          </LogoContainer>

          <FormContainer>
            <FormTitle>Login</FormTitle>

            <InputContainer>
              <InputLabel>Username</InputLabel>
              <StyledInput
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </InputContainer>

            <InputContainer>
              <InputLabel>Password</InputLabel>
              <StyledInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </InputContainer>

            <LoginButton onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <ButtonText>Login</ButtonText>}
            </LoginButton>

            <RegisterLink onPress={() => router.push("/register")} disabled={loading}>
              <RegisterText>Don't have an account? Register</RegisterText>
            </RegisterLink>
          </FormContainer>
        </ContentContainer>
      </SafeAreaView>
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  background-color: #121212;
`

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
`

const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: 40px;
`

const AppTitle = styled.Text`
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  margin-top: 10px;
`

const FormContainer = styled.View`
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
`

const FormTitle = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`

const InputContainer = styled.View`
  margin-bottom: 15px;
`

const InputLabel = styled.Text`
  color: #fff;
  font-size: 16px;
  margin-bottom: 5px;
`

const StyledInput = styled.TextInput`
  background-color: #333;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  padding: 12px 15px;
`

const LoginButton = styled.TouchableOpacity`
  background-color: #0084ff;
  border-radius: 5px;
  padding: 15px;
  align-items: center;
  margin-top: 10px;
  opacity: ${(props: ButtonProps) => (props.disabled ? 0.7 : 1)};
`

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`

const RegisterLink = styled.TouchableOpacity`
  margin-top: 20px;
  align-items: center;
`

const RegisterText = styled.Text`
  color: #0084ff;
  font-size: 16px;
`

