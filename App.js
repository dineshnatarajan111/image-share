import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView, Header } from 'react-native';
import logo from './assets/logo.png';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

export default function App() {
  let [selectedImage, setSelectedImage] = React.useState(null);
  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if(permissionResult.granted == false) {
      alert("Permission to access camera is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync(); 
    if (pickerResult.cancelled === true) {
      return;
    }

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    }
    else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  };

  let openShareDialogAsync = async () => {
    if(!(await Sharing.isAvailableAsync())) {
      alert(`The selected image is available for shareing at: ${selectedImage.remoteUri}`);
      return;
    }
    Sharing.shareAsync(selectedImage.remoteUri || selectedImage.localUri);
  };

  if (selectedImage !== null) {
    return(
      <View style={styles.container}>
        <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />

        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
          <Text style={styles.buttonText}>Share this photo</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}> 
      <Image source={logo} style={styles.logo} />
      <Text style={styles.instruction}>
        To share a photo from your phone to your friend, just press the below button
      </Text>
      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.instruction1}>Pick a photo
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({

  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instruction: {
    color: '#888',
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  instruction1: {
    fontSize: 20, 
    color: '#fff'
  },
  button: {
    backgroundColor:'blue',
    padding: 20,
    borderRadius: 10,
  },
  head: {
    margin: 50,
  }
});
