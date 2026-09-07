import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../screens/Loading/LoadingScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import VerifyCodeScreen from '../screens/Register/VerifyCodeScreen';
import ForgotPasswordEmailScreen from '../screens/PasswordRecovery/ForgotPasswordEmailScreen';
import ForgotPasswordCodeScreen from '../screens/PasswordRecovery/ForgotPasswordCodeScreen';
import ForgotPasswordNewScreen from '../screens/PasswordRecovery/ForgotPasswordNewScreen';
import PasswordResetDoneScreen from '../screens/PasswordRecovery/PasswordResetDoneScreen';
import MainTabs from './MainTabs';
import ProductDetailScreen from '../screens/ProductDetail/ProductDetailScreen';
import CartScreen from '../screens/Cart/CartScreen';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import OrderConfirmedScreen from '../screens/Checkout/OrderConfirmedScreen';
import OrdersScreen from '../screens/Orders/OrdersScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import HelpScreen from '../screens/Help/HelpScreen';

const Stack = createNativeStackNavigator();

// Define la pila de pantallas según haya o no una sesión activa.
export default function RootNavigator() {
  const { initializing, user, onboardingSeen } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Group>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="OrderConfirmed" component={OrderConfirmedScreen} />
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          {!onboardingSeen ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : null}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
          <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmailScreen} />
          <Stack.Screen name="ForgotPasswordCode" component={ForgotPasswordCodeScreen} />
          <Stack.Screen name="ForgotPasswordNew" component={ForgotPasswordNewScreen} />
          <Stack.Screen name="PasswordResetDone" component={PasswordResetDoneScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
