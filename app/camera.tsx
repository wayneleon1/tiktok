import Ionicons from "@expo/vector-icons/Ionicons";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
} from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Audio } from "expo-av";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";

export default function App() {
  const { user } = useAuth();
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [audioPermission, setAudioPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Request microphone permission
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setAudioPermission(status === "granted");
    })();
  }, []);

  if (!permission || !audioPermission) {
    // Camera or microphone permissions are still loading.
    return <View />;
  }

  if (!permission.granted || !audioPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to access the camera and microphone
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const recordVideo = async () => {
    if (isRecording) {
      console.log("Stopping recording...");
      setIsRecording(false);
      await cameraRef.current?.stopRecording();
    } else {
      setIsRecording(true);
      try {
        const video = await cameraRef.current?.recordAsync();
        if (video) {
          setVideoUrl(video.uri);
        }
      } catch (error) {
        console.error("Recording error:", error);
        setIsRecording(false);
      }
    }
  };

  const saveVideo = async () => {
    const formData = new FormData();
    const fileName = videoUrl?.split("/").pop();
    if (videoUrl && fileName) {
      const videoFile = {
        uri: videoUrl,
        type: `video/${fileName.split(".").pop()}`,
        name: fileName,
      } as any;
      formData.append("file", videoFile);
    }

    const { data, error } = await supabase.storage
      .from("videos")
      .upload(fileName, formData, {
        cacheControl: "3600000000",
        upsert: false,
      });
    if (error) console.log(error);

    const { error: videoError } = await supabase.from("Video").insert({
      title: "Test Title",
      uri: data?.path,
      user_id: user?.id,
    });
    if (videoError) console.log(videoError);
    router.back();
  };

  return (
    <CameraView
      mode="video"
      ref={cameraRef}
      style={{ flex: 1 }}
      facing={facing}
    >
      <View className="flex-1 justify-end">
        <View className="flex-row items-center justify-around mb-10">
          <TouchableOpacity
            className="justify-end items-end"
            onPress={toggleCameraFacing}
          >
            <Ionicons name="camera-reverse" size={50} color="transparent" />
          </TouchableOpacity>

          {videoUrl ? (
            <TouchableOpacity
              className="justify-end items-end"
              onPress={saveVideo}
            >
              <Ionicons name="checkmark-circle" size={100} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="justify-end items-end"
              onPress={recordVideo}
            >
              {!isRecording ? (
                <Ionicons name="radio-button-on" size={100} color="white" />
              ) : (
                <Ionicons name="pause-circle" size={100} color="red" />
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="justify-end items-end"
            onPress={toggleCameraFacing}
          >
            <Ionicons name="camera-reverse" size={50} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
