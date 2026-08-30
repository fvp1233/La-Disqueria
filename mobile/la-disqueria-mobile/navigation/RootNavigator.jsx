import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import VerifyCodeScreen from '../screens/Register/VerifyCodeScreen';
import ForgotPasswordEmailScreen from '../screens/PasswordRecovery/ForgotPasswordEmailScreen';
import ForgotPasswordCodeScreen from '../screens/PasswordRecovery/ForgotPasswordCodeScreen';
import ForgotPasswordNewScreen from '../screens/PasswordRecovery/ForgotPasswordNewScreen';
import PasswordResetDoneScreen from '../screens/PasswordRecovery/PasswordResetDoneScreen';
import ProductDetailScreen from '../screens/ProductDetail/ProductDetailScreen';
import CartScreen from '../screens/Cart/CartScreen';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import OrderConfirmedScreen from '../screens/Checkout/OrderConfirmedScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';

const Stack = createNativeStackNavigator();

// Pila de navegación de toda la aplicación, desde la apertura hasta las compras.
export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmailScreen} />
      <Stack.Screen name="ForgotPasswordCode" component={ForgotPasswordCodeScreen} />
      <Stack.Screen name="ForgotPasswordNew" component={ForgotPasswordNewScreen} />
      <Stack.Screen name="PasswordResetDone" component={PasswordResetDoneScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderConfirmed" component={OrderConfirmedScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
