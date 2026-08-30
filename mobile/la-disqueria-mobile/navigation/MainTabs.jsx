import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeScreen from '../screens/Home/HomeScreen';
import CatalogScreen from '../screens/Catalog/CatalogScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { colors, fonts } from '../theme';

const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: 'home',
  Catalog: 'disc',
  Profile: 'user',
};

// Navegación principal por pestañas disponible después de iniciar sesión.
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: 76,
          paddingTop: 8,
          paddingBottom: 14,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.body,
          fontSize: 10,
          fontWeight: '700',
        },
        tabBarIcon: ({ color }) => (
          <Feather name={tabIcons[route.name]} size={21} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{ tabBarLabel: 'Catálogo' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}
