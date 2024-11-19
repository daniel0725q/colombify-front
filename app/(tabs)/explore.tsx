import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Playlists from '../components/playListID';
import PlaylistDetail from '../components/playlistdetail';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Playlists" component={Playlists} />
      <Tab.Screen name="PlaylistDetail" component={PlaylistDetail} />
    </Tab.Navigator>
  );
}
