// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
// import { useSelector } from 'react-redux';
// import { RootState } from '../Redux/Store';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { COLORS } from '../styles/globalstyles';
// import { useTheme } from '../Theme/ThemeContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { markEventAsDeleteFavorite, markEventAsFavorite } from '../services/Apiservices';
// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// interface Events {
//   ageLimit: string;
//   artistName: string;
//   brief: string;
//   city: string;
//   createdAt: string;
//   description: string;
//   duration: string;
//   endDate: string;
//   eventDate: string;
//   eventId: number;
//   isFeatured: boolean;
//   isManual: boolean;
//   isPaid: boolean;
//   isPopular: boolean;
//   language: string;
//   location: string;
//   noOfTickets: number;
//   startDate: string;
//   state: string;
//   status: string;
//   thumbUrl: string | null;
//   title: string;
//   type: string;
//   updatedAt: string;
// }
// type RootStackParamList = {
//   EventDetails: { eventId: number };
// };

// const ExploreScreen: React.FC = () => {
//   const events = useSelector((state: RootState) => state.eventsData);
//   const { isDarkMode } = useTheme();
//    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [userId, setUserId] = useState<string | null>(null);
//   const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});  // Track favorites

//   console.log('userId', userId);

//   useEffect(() => {
//     const getUserId = async () => {
//       try {
//         const userData = await AsyncStorage.getItem('userData');
//         if (userData) {
//           const parsedData = JSON.parse(userData);
//           setUserId(parsedData.userId); // Ensure your AsyncStorage data contains `userId`
//         }
//       } catch (error) {
//         console.error('Error fetching user data from AsyncStorage:', error);
//       }
//     };

//     getUserId();
//   }, []);

//   const handleEventPress = (eventId: number) => {
//     // Handle event press (e.g., navigate to event details)
//     navigation.navigate('EventDetails', { eventId });
//   };

//   const handleFavoritePress = async (eventId: number) => {
//     if (userId) {
//       try {
//         if (favorites[eventId]) {
//           // Delete favorite if it's already marked
//           const response = await markEventAsDeleteFavorite(Number(userId), eventId);
//           console.log('Deleted favorite:', response);
//         } else {
//           // Add to favorites if not already marked
//           const data = {
//             userId: Number(userId),
//             eventId: eventId,
//           };
//           const response = await markEventAsFavorite(data);
//           console.log('Added favorite:', response);
//         }
//         // Update local state
//         setFavorites((prevFavorites) => ({
//           ...prevFavorites,
//           [eventId]: !prevFavorites[eventId],
//         }));
//       } catch (error) {
//         console.error('Error toggling favorite status:', error);
//       }
//     } else {
//       console.log('User is not logged in.');
//     }
//   };


//   const formatEventDateTime = (date: string) => {
//     const eventDate = new Date(date);
//     return eventDate.toLocaleString();
//   };

//   const renderEventItem = (item: Events) => {
//     const isFavorite = favorites[item.eventId] || item.isPopular;  // Check if event is a favorite

//     return (
//       <TouchableOpacity
//         key={item.eventId}
//         style={[styles.eventContainer, { backgroundColor: isDarkMode ? 'gray' : '#fff' }]}
//         onPress={() => handleEventPress(item.eventId)}
//       >
//         <View style={styles.eventDetails}>
//           {item.thumbUrl ? (
//             <Image source={{ uri: item.thumbUrl }} style={styles.eventImage} />
//           ) : (
//             <Image source={require('../../assests/images/altimg.jpg')} style={styles.eventImage} />
//           )}
//           <Text style={[styles.eventTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{item.title}</Text>
//           <Text style={[styles.eventType, { color: isDarkMode ? '#fff' : '#000' }]}>
//             {item.city} {item.state}
//           </Text>
//           <View style={styles.eventFooter}>
//             <Text style={styles.eventDate}>
//               {formatEventDateTime(item.eventDate)}
//             </Text>
//             <TouchableOpacity
//               onPress={() => handleFavoritePress(item.eventId)}
//               style={styles.favoriteIconContainer}
//             >
//               <Icon
//                 name={isFavorite ? 'heart' : 'heart-outline'}
//                 size={30}
//                 color={isFavorite ? 'red' : '#000'}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const filteredEvents = events.filter((event) => {
//     const searchText = searchTerm.toLowerCase();
//     return (
//       event.title.toLowerCase().includes(searchText) ||
//       event.city.toLowerCase().includes(searchText) ||
//       event.state.toLowerCase().includes(searchText) ||
//       event.description.toLowerCase().includes(searchText)
//     );
//   });

//   // Group filtered events into pairs for each row
//   const groupedEvents: Events[][] = filteredEvents.reduce((acc: Events[][], event, index) => {
//     if (index % 2 === 0) {
//       acc.push([event]);  // Start a new row
//     } else {
//       acc[acc.length - 1].push(event);  // Add to the last row
//     }
//     return acc;
//   }, []);

//   return (
//     <>
//       <View style={[styles.main, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
//         <View style={styles.header}>
//           <Text style={[styles.headerText, { color: isDarkMode ? '#fff' : '#000' }]}>Explore Events</Text>
//         </View>
//         <TextInput
//           style={[styles.searchBar, { color: isDarkMode ? '#fff' : '#000' }]}
//           placeholder="Search events..."
//           value={searchTerm}
//           onChangeText={setSearchTerm}
//           placeholderTextColor={isDarkMode ? '#bbb' : '#555'}
//         />
//         <Text style={[styles.length, { color: isDarkMode ? '#fff' : '#000' }]}>Events: {filteredEvents.length ? filteredEvents.length : events.length}</Text>
//         <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
//           {groupedEvents.map((row: Events[], index: number) => (
//             <View key={index} style={styles.row}>
//               {row.map((event: Events) => (
//                 <View key={event.eventId} style={styles.columnItem}>
//                   {renderEventItem(event)}
//                 </View>
//               ))}
//             </View>
//           ))}
//         </ScrollView>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     flex: 1,
//     textAlign: 'center',
//   },
//   darkBackground: {
//     backgroundColor: '#121212',
//   },
//   lightBackground: {
//     backgroundColor: '#FFFFFF',
//   },
//   length: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   noResultsText: {
//     textAlign: 'center',
//     fontSize: 18,
//     color: 'gray',
//   },
//   main: {
//     flex: 1,
//     padding: 15,
//   },
//   searchBar: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingLeft: 10,
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   container: {
//     flexGrow: 1,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   columnItem: {
//     width: '48%',  // Ensures two items per row
//     marginHorizontal: '1%',  // Small margin between items
//   },
//   eventContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     overflow: 'hidden',
//     elevation: 3,
//   },
//   eventDetails: {
//     padding: 10,
//     borderRadius: 8,
//   },
//   eventImage: {
//     width: '100%',
//     height: 150,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   eventTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   eventType: {
//     color: 'gray',
//     marginTop: 5,
//   },
//   eventFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   eventDate: {
//     width: '70%',
//     fontSize: 14,
//     color: COLORS.red,
//     fontWeight: 'bold',
//     flexWrap: 'wrap',
//   },
//   favoriteIconContainer: {
//     padding: 5,
//   },
// });

// export default ExploreScreen;
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchFeaturedEvents, fetchManualEvents, fetchPopularEvents } from '../services/Apiservices';
import EventCard from '../components/EventCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllEvents } from '../services/Apiservices'; // assuming you have a getAllEvents API

type EventData = {
  ageLimit?: string;
  artistName?: string;
  bannerImageUrl?: string;
  brief?: string;
  categoryId?: {
    categoryId?: number;
    name?: string;
  };
  city?: string;
  createdAt?: string;
  description?: string;
  duration?: string;
  endDate?: string;
  eventDate?: string;
  eventId?: number;
  favoritesCount?: number;
  galleryImages?: string[];
  isFavorite?: boolean;
  isFeatured?: boolean;
  isManual?: boolean;
  isPaid?: boolean;
  isPopular?: boolean;
  language?: string;
  layoutImageUrl?: string;
  layoutStatus?: string;
  location?: string;
  musicType?: string;
  noOfTickets?: number;
  startDate?: string;
  state?: string;
  status?: string;
  thumbUrl?: string;
  title?: string;
  updatedAt?: string;
  venueStatus?: string;
};

type UserDataTypes = {
  userId: number;
  [key: string]: any;
};

const ExploreScreen: React.FC = () => {
  const route = useRoute();
  const { type } = route.params as { type?: string }; // type can be undefined
  const [events, setEvents] = useState<EventData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [userId, setUserId] = useState<number | null>(null);

  const toggleFavorite = (eventId: number) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [eventId]: !prevFavorites[eventId],
    }));
  };

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData: UserDataTypes = JSON.parse(userData);
          setUserId(parsedData.userId);
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    loadEvents();
  }, [page]);

  const loadEvents = async () => {
    if (!userId) return; // Avoid fetching if userId is not set
    setLoading(true);
    try {
      let data;
      if (type) {
        // Fetch based on the type passed from the screen
        if (type === 'Featured') data = await fetchFeaturedEvents(userId, 10);
        else if (type === 'Popular') data = await fetchPopularEvents(userId, 10);
        else data = await fetchManualEvents(userId, 10);
      } else {
        // Fetch all events if no type is passed
        data = await getAllEvents(); // Assuming it fetches all events
      }

      setEvents((prev) => [...prev, ...data]);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => setPage((prev) => prev + 1);
console.log('events', events);
  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.eventId?.toString() ?? `${Math.random()}`}
        renderItem={({ item }) => (
          <EventCard
            imageUrl={item.thumbUrl ?? ''}
            title={item.title ?? 'Untitled Event'}
            dateTime={item.eventDate ?? ''}
            location={item.location ?? 'Unknown Location'}
            isFavorite={favorites[item.eventId ?? 0] || false}
            onPress={() => console.log(`Clicked on ${item.title}`)}
            onFavoritePress={() => toggleFavorite(item.eventId ?? 0)}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ExploreScreen;

