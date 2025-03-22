import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Dimensions } from "react-native";
import VideoPlayer from "@/components/VideoPlayer";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [videos, setVideos] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<string | null>(null);

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    const { data, error } = await supabase
      .from("Video")
      .select("*,User(username)")
      .order("created_at", { ascending: false });
    getSignedUrls(data);
  };

  const getSignedUrls = async (videos: any[]) => {
    const { data, error } = await supabase.storage
      .from("videos")
      .createSignedUrls(
        videos.map((video) => video.uri),
        60 * 60 * 24 * 7
      );

    let videosUrls = videos?.map((item) => {
      item.signedUrl = data?.find(
        (signedUrl) => signedUrl.path === item.uri
      )?.signedUrl;
      return item;
    });
    setVideos(videosUrls);
  };
  return (

    <SafeAreaView style={{flex:1}}>
    <View className="flex flex-1 items-center justify-center bg-white">
      <FlatList
        data={videos}
        snapToInterval={Dimensions.get("window").height}
        snapToStart
        decelerationRate="fast"
        onViewableItemsChanged={e => setActiveIndex(e.viewableItems[0].key)}
        renderItem={({ item }) => (
          <VideoPlayer video={item} isViewable={activeIndex === item.id} />
        )}
      />
    </View>
    </SafeAreaView>
  );
}
