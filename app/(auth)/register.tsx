"use client"

import { useState } from "react"
import { SafeAreaView, ActivityIndicator, Alert } from "react-native"
import styled from "styled-components/native"
import { useAuth } from "@/context/AuthContext"
import { MessageSquare } from "@/components/ui/Icons"

import { ButtonProps } from "@/types/props"
import { router } from "expo-router"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const success = await register(username, email, password)
      if (success) {
        Alert.alert("Success", "Registration successful! Please login.", [
          { text: "OK", onPress: () => router.push("/login") },
        ])
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Please try again with different credentials"
      Alert.alert("Registration Failed", errorMessage)
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
            <FormTitle>Register</FormTitle>

            <InputContainer>
              <InputLabel>Username</InputLabel>
              <StyledInput
                value={username}
                onChangeText={setUsername}
                placeholder="Choose a username"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </InputContainer>

            <InputContainer>
              <InputLabel>Email</InputLabel>
              <StyledInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </InputContainer>

            <InputContainer>
              <InputLabel>Password</InputLabel>
              <StyledInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </InputContainer>

            <InputContainer>
              <InputLabel>Confirm Password</InputLabel>
              <StyledInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                secureTextEntry
              />
            </InputContainer>

            <RegisterButton onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <ButtonText>Register</ButtonText>}
            </RegisterButton>

            <LoginLink onPress={() => router.push('/login')} disabled={loading}>
              <LoginText>Already have an account? Login</LoginText>
            </LoginLink>
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

const RegisterButton = styled.TouchableOpacity`
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

const LoginLink = styled.TouchableOpacity`
  margin-top: 20px;
  align-items: center;
`

const LoginText = styled.Text`
  color: #0084ff;
  font-size: 16px;
`

