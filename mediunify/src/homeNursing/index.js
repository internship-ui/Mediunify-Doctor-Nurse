/**
 * MediUnify — Home Nursing Module
 * 
 * Central export for Home Nursing screens, navigation, context, and backend API services.
 */

// Context & Provider
export {
  HomeNursingProvider,
  useHomeNursing,
  DEFAULT_NURSE_PROFILE,
  INITIAL_SCHEDULE,
  INITIAL_LEAVES,
  INITIAL_ASSIGNMENTS,
  INITIAL_UPCOMING,
  INITIAL_HISTORY,
  INITIAL_NOTIFICATIONS,
} from './context/HomeNursingContext';

// Components
export { default as HomeNursingHeader } from './components/HomeNursingHeader';
export { default as CallModal } from './components/CallModal';
export { default as MapRoutePreview } from './components/MapRoutePreview';

// Screens
export { default as HomeNursingLoginScreen } from './screens/HomeNursingLoginScreen';
export { default as HomeNursingRegistrationScreen } from './screens/HomeNursingRegistrationScreen';
export { default as HomeNursingDashboardScreen } from './screens/HomeNursingDashboardScreen';
export { default as HomeNursingAvailabilityScreen } from './screens/HomeNursingAvailabilityScreen';
export { default as HomeNursingAssignmentDetailScreen } from './screens/HomeNursingAssignmentDetailScreen';
export { default as HomeNursingServiceStatusScreen } from './screens/HomeNursingServiceStatusScreen';
export { default as HomeNursingNotificationsScreen } from './screens/HomeNursingNotificationsScreen';
export { default as HomeNursingHistoryScreen } from './screens/HomeNursingHistoryScreen';
export { default as HomeNursingProfileScreen } from './screens/HomeNursingProfileScreen';
export { default as HomeNursingServicesScreen } from './screens/HomeNursingServicesScreen';

// Navigation
export { default as HomeNursingTabs } from './navigation/HomeNursingTabs';
export { default as HomeNursingNavigator } from './navigation/HomeNursingNavigator';

// API Services
export { homeNursingApi, API_BASE_URL } from './services/homeNursingApi';
