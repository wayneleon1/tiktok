import { useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";

export default function ({
  video,
  isViewable,
}: {
  video: any;
  isViewable: boolean;
}) {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (isViewable) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [isViewable]);

  return (
    <Video
      ref={videoRef}
      source={{
        uri: video.signedUrl,
      }}
      // useNativeControls
      style={{
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      }}
      resizeMode={ResizeMode.COVER}
      isLooping
      // onPlaybackStatusUpdate={(status) => setStatus(() => status)}
    />
  );
}
