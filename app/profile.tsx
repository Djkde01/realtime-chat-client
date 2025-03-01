"use client"

import { useState } from "react";
import { SafeAreaView, ActivityIndicator, Alert, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { useAuth } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

export default function ProfileScreen() {
    const { user, updateProfile, uploadProfileImage, logout } = useAuth();
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    const handleUpdateProfile = async () => {
        if (!username || !email) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await updateProfile({ username, email });
            Alert.alert("Success", "Profile updated successfully");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
            Alert.alert("Update Failed", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission Required", "Please grant access to your photo library");
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImageLoading(true);
                const imageUri = result.assets[0].uri;
                await uploadProfileImage(imageUri);
                Alert.alert("Success", "Profile image updated");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
            Alert.alert("Image Upload Failed", errorMessage);
        } finally {
            setImageLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Container>
            <SafeAreaView style={{ flex: 1 }}>
                <HeaderContainer>
                    <HeaderTitle>Your Profile</HeaderTitle>
                    <LogoutButton onPress={handleLogout}>
                        <LogoutButtonText>Logout</LogoutButtonText>
                    </LogoutButton>
                </HeaderContainer>

                <ContentContainer>
                    <ProfileImageContainer onPress={handleImagePick}>
                        {imageLoading ? (
                            <ActivityIndicator size="large" color="#0084ff" />
                        ) : (
                            <>
                                <ProfileImage
                                    source={user?.profileImage ? { uri: user.profileImage } : require('@/assets/images/react-logo.png')}
                                />
                                <ChangePhotoText>Change Photo</ChangePhotoText>
                            </>
                        )}
                    </ProfileImageContainer>

                    <FormContainer>
                        <InputContainer>
                            <InputLabel>Username</InputLabel>
                            <StyledInput
                                value={username}
                                onChangeText={setUsername}
                                placeholder="Your username"
                                placeholderTextColor="#999"
                            />
                        </InputContainer>

                        <InputContainer>
                            <InputLabel>Email</InputLabel>
                            <StyledInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Your email"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </InputContainer>

                        <UpdateButton onPress={handleUpdateProfile} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <ButtonText>Update Profile</ButtonText>}
                        </UpdateButton>

                        <BackButton onPress={() => router.back()}>
                            <BackButtonText>Back to Chat</BackButtonText>
                        </BackButton>
                    </FormContainer>
                </ContentContainer>
            </SafeAreaView>
        </Container>
    );
}

const Container = styled.View`
  flex: 1;
  background-color: #121212;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px;
  background-color: #1e1e1e;
`;

const HeaderTitle = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

const LogoutButton = styled.TouchableOpacity`
  padding: 8px 12px;
  background-color: #333;
  border-radius: 5px;
`;

const LogoutButtonText = styled.Text`
  color: #ff5252;
  font-size: 14px;
`;

const ContentContainer = styled.View`
  flex: 1;
  padding: 20px;
`;

const ProfileImageContainer = styled.TouchableOpacity`
  align-items: center;
  margin-bottom: 30px;
`;

const ProfileImage = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: #333;
`;

const ChangePhotoText = styled.Text`
  color: #0084ff;
  margin-top: 10px;
  font-size: 16px;
`;

const FormContainer = styled.View`
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 20px;
`;

const InputContainer = styled.View`
  margin-bottom: 15px;
`;

const InputLabel = styled.Text`
  color: #fff;
  font-size: 16px;
  margin-bottom: 5px;
`;

const StyledInput = styled.TextInput`
  background-color: #333;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  padding: 12px 15px;
`;

const UpdateButton = styled.TouchableOpacity`
  background-color: #0084ff;
  border-radius: 5px;
  padding: 15px;
  align-items: center;
  margin-top: 20px;
  opacity: ${(props: { disabled: boolean }) => (props.disabled ? 0.7 : 1)};
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const BackButton = styled.TouchableOpacity`
  margin-top: 15px;
  padding: 15px;
  align-items: center;
`;

const BackButtonText = styled.Text`
  color: #0084ff;
  font-size: 16px;
`;