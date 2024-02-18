import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../../../hooks/UserContext";

const Settings = () => {
  // Assuming useUserContext provides the current user data
  const { user, loading, logout } = useUserContext(); // Destructure logout from the context

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>user not found</Text>
      </View>
    );
  }

  // State hooks for user inputs
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editMode, setEditMode] = useState({ name: false, email: false });
  const navigation = useNavigation();

  const handleUpdateProfile = () => {
    // Implement your profile update logic here
    alert("Profile updated");
    // Optionally reset edit mode here
    setEditMode({ name: false, email: false });
  };

  const handleChangePassword = () => {
    // Implement your password change logic here
    alert("Password changed");
  };
  const handleLogOut = async () => {
    await logout();
    navigation.reset({
      screen: "Login",
    });
  };

  const toggleEdit = (field) => {
    setEditMode((prevMode) => ({ ...prevMode, [field]: !prevMode[field] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Personal Information</Text>
      <View style={styles.inputGroup}>
        <Icon name="account" size={20} style={styles.icon} />
        <TextInput
          editable={editMode.name}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={[styles.input, editMode.name && styles.editableInput]}
        />
        <TouchableOpacity onPress={() => toggleEdit("name")}>
          <Icon name="pencil" size={20} color="#007bff" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputGroup}>
        <Icon name="email" size={20} style={styles.icon} />
        <TextInput
          editable={editMode.email}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, editMode.email && styles.editableInput]}
        />
        <TouchableOpacity onPress={() => toggleEdit("email")}>
          <Icon name="pencil" size={20} color="#007bff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Change Password</Text>
      <View style={styles.inputGroup}>
        <Icon name="lock" size={20} style={styles.icon} />
        <TextInput
          placeholder="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>
      <View style={styles.inputGroup}>
        <Icon name="lock-reset" size={20} style={styles.icon} />
        <TextInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>
      <View style={styles.inputGroup}>
        <Icon name="lock-check" size={20} style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logout} onPress={handleLogOut}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  header: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingBottom: 5,
    marginBottom: 15,
    width: "100%",
  },
  icon: {
    marginRight: 10,
    color: "#64748b",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 16,
  },
  editableInput: {
    borderColor: "#007bff",
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#64748b",
    width: "100%",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  logout: {
    backgroundColor: "red",
    width: "100%",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default Settings;
