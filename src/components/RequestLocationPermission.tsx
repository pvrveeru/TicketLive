// import { PermissionsAndroid, Platform } from 'react-native';
// import Geolocation from 'react-native-geolocation-service';

// const AskLocationPermission = async (): Promise<boolean> => {
//   if (Platform.OS === 'ios') {
//     return true;
//   }
//   const granted = await PermissionsAndroid.request(
//     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     {
//       title: 'Geolocation Permission',
//       message: 'Can we access your location?',
//       buttonNeutral: 'Ask Me Later',
//       buttonNegative: 'Cancel',
//       buttonPositive: 'OK',
//     }
//   );
//   return granted === PermissionsAndroid.RESULTS.GRANTED;
// };

// export const RequestLocationPermission = async (): Promise<boolean> => {
//   try {
//     if (Platform.OS === 'ios') {
//       const auth = await Geolocation.requestAuthorization('whenInUse');
//       return auth === 'granted';
//     }
//     const locationAllowed = await PermissionsAndroid.check(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//     );
//     if (locationAllowed) {
//       return true;
//     } else {
//       const granted = await AskLocationPermission();
//       if (granted) {
//         GetLocation();
//         return true;
//       }
//       return false;
//     }
//   } catch (err) {
//     console.error('RequestLocationPermission error:', err);
//     return false;
//   }
// };

// export const GetLocation = (): void => {
//   PermissionsAndroid.check(
//     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//   ).then(res => {
//     console.log('Permission status:', res);
//   });
// };
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const GetLocation = async (): Promise<void> => {
  try {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      console.log('Permission status:', auth === 'granted');
      return;
    }

    const isGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    console.log('Permission status:', isGranted); // Prints true or false

  } catch (error) {
    console.error('GetLocation error:', error);
  }
};
