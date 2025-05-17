import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
  RefreshControl,
  Modal,
} from 'react-native';
import {
  format,
  isToday,
  isYesterday,
  isTomorrow,
  addWeeks,
  startOfWeek,
  addDays,
  isSameDay,
} from 'date-fns';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/theme';

const screenWidth = Dimensions.get('window').width;
const DAYS_IN_WEEK = 7;
const WEEK_ITEM_WIDTH = screenWidth;
const HEADER_MAX_HEIGHT = 215;
const HEADER_MIN_HEIGHT = 75;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const generateWeek = (startDate: Date) =>
  Array.from({ length: DAYS_IN_WEEK }, (_, i) => addDays(startDate, i));

const generateWeeks = (centerDate: Date, range = 50) => {
  let weeks = [];
  for (let offset = -range; offset <= range; offset++) {
    const start = startOfWeek(addWeeks(centerDate, offset), { weekStartsOn: 1 });
    weeks.push(generateWeek(start));
  }
  return weeks;
};

const medicationsData: Record<string, {
    image: any;
    name: string; 
    grams: string; 
    capsules: string; 
    daily: string; 
    time: string; 
  }[]> = {
    '2025-05-15': [
      {
        image: require('../../assets/images/icon.png'),
        name: 'Paracetamol',
        grams: '500mg',
        capsules: '2',
        daily: 'Daily',
        time: '08:00 AM',
      },
      {
        image: require('../../assets/images/icon.png'),
        name: 'Vitamin C',
        grams: '1000mg',
        capsules: '1',
        daily: 'Daily',
        time: '12:00 PM',
      },
    ],
    '2025-05-16': [
      {
        image: require('../../assets/images/icon.png'),
        name: 'Ibuprofen',
        grams: '200mg',
        capsules: '1',
        daily: 'Daily',
        time: '09:00 AM',
      },
      {
        image: require('../../assets/images/icon.png'),
        name: 'Paracetamol',
        grams: '500mg',
        capsules: '2',
        daily: 'Daily',
        time: '08:00 AM',
      },
      {
        image: require('../../assets/images/icon.png'),
        name: 'Vitamin C',
        grams: '1000mg',
        capsules: '1',
        daily: 'Daily',
        time: '12:00 PM',
      },
      {
        image: require('../../assets/images/icon.png'),
        name: 'Paracetamol',
        grams: '500mg',
        capsules: '2',
        daily: 'Daily',
        time: '08:00 AM',
      },
      {
        image: require('../../assets/images/icon.png'),
        name: 'Vitamin C',
        grams: '1000mg',
        capsules: '1',
        daily: 'Daily',
        time: '12:00 PM',
      },
      {
        image: require('../../assets/images/icon.png'),
        name: 'Paracetamol',
        grams: '500mg',
        capsules: '2',
        daily: 'Daily',
        time: '08:00 AM',
      },
      {
        image: require('../../assets/images/icon.png'),
        name: 'Vitamin C',
        grams: '1000mg',
        capsules: '1',
        daily: 'Daily',
        time: '12:00 PM',
      },
      {
        image: require('../../assets/images/icon.png'),
        name: 'Paracetamol',
        grams: '500mg',
        capsules: '2',
        daily: 'Daily',
        time: '08:00 AM',
      },
      {
        image: require('../../assets/images/icon.png'),
        name: 'Vitamin C',
        grams: '1000mg',
        capsules: '1',
        daily: 'Daily',
        time: '12:00 PM',
      },
      {
        image: require('../../assets/images/icon.png'),
        name: 'Paracetamol',
        grams: '500mg',
        capsules: '2',
        daily: 'Daily',
        time: '08:00 AM',
      },
      {
        image: require('../../assets/images/icon.png'),
        name: 'Vitamin C',
        grams: '1000mg',
        capsules: '1',
        daily: 'Daily',
        time: '12:00 PM',
      },
    ],  
};

export default function Index() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [weeks] = useState(() => generateWeeks(today, 50));
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showMedModal, setShowMedModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
const flatListRef = useRef<FlatList<any>>(null);

  const initialIndex = useMemo(() => {
    return weeks.findIndex((week) =>
      week.some((d) => isSameDay(d, selectedDate))
    );
  }, [selectedDate, weeks]);

  const onRefresh = () => {
    setRefreshing(true);
    setSelectedDate(today);
    
    const weekIndex = weeks.findIndex(week =>
    week.some(day => 
  day.getFullYear() === today.getFullYear() &&
  day.getMonth() === today.getMonth() &&
  day.getDate() === today.getDate()
)

  );
  if (weekIndex !== -1 && flatListRef.current) {
    flatListRef.current.scrollToIndex({ index: weekIndex, animated: true });
  }

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMMM d');
  };

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const medications = medicationsData[selectedDateKey] || [];

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const dateOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const dateTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const renderHeader = () => (
    <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerTopRow}>
          <Image
            source={require('../../assets/images/logow2.png')}
            style={styles.logo}
          />
          <View style={styles.headerIconsContainer}>
            <TouchableOpacity 
              onPress={() => setShowNotifications(true)}
              style={styles.notificationButton}
            >
              <MaterialCommunityIcons name="bell-outline" size={24} color="#FFF" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <Image
              source={require('../../assets/images/default-user.jpg')}
              style={styles.profile}
            />
          </View>
        </View>

        <Animated.View style={[
          styles.dateContainer,
          { opacity: dateOpacity, transform: [{ translateY: dateTranslateY }] }
        ]}>
          <Text style={styles.todayText}>{getLabel(selectedDate)}</Text>
          <Text style={styles.fullDateText}>
            {format(selectedDate, 'EEEE, MMMM d')}
          </Text>
        </Animated.View>

        <Animated.View style={[
          styles.calendarContainer,
          { opacity: dateOpacity, transform: [{ translateY: dateTranslateY }] }
        ]}>
          <FlatList
          ref={flatListRef}
            data={weeks}
            keyExtractor={(_, index) => `week-${index}`}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({
              length: WEEK_ITEM_WIDTH,
              offset: WEEK_ITEM_WIDTH * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={styles.weekContainer}>
                {item.map((date) => (
                  <TouchableOpacity
                    key={date.toISOString()}
                    onPress={() => setSelectedDate(date)}
                    style={[
                      styles.calendarItem,
                      isSameDay(date, selectedDate) && styles.selectedDate,
                      isToday(date) && !isSameDay(date, selectedDate) && styles.todayIndicator,
                    ]}
                  >
                    <Text style={[
                      styles.day,
                      isSameDay(date, selectedDate) && styles.selectedText,
                      !isSameDay(date, selectedDate) && styles.unselectedDay,
                    ]}>
                      {format(date, 'EEE')}
                    </Text>
                    <Text style={[
                      styles.date,
                      isSameDay(date, selectedDate) && styles.selectedText,
                      !isSameDay(date, selectedDate) && styles.unselectedDate,
                    ]}>
                      {format(date, 'd')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  );

  const renderMedItem = ({ item }: { item: typeof medications[0] }) => (
    <TouchableOpacity onPress={() => {
      setSelectedMedication(item);
      setShowMedModal(true);
    }}>
      <View style={styles.medRow}>
        <View style={styles.medIconContainer}>
          <Image source={item.image} style={styles.pillImage} />
        </View>
        <View style={styles.medDetails}>
          <Text style={styles.medName}>{item.name}</Text>
          <Text style={styles.medGrams}>{item.grams}</Text>
          <View style={styles.medInfoContainer}>
            <Text style={styles.medInfo}>{item.capsules} Capsules</Text>
            <Text style={styles.medInfo}> • {item.daily}</Text>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderModals = () => (
    <>
      {/* Notifications Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotifications}
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity 
                onPress={() => setShowNotifications(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#4682B4" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.notificationItem}>
              <MaterialCommunityIcons 
                name="pill" 
                size={20} 
                color="#4682B4" 
                style={styles.notificationIcon}
              />
              <View>
                <Text style={styles.notificationTitle}>Medication Reminder</Text>
                <Text style={styles.notificationText}>Time to take your Ibuprofen</Text>
                <Text style={styles.notificationTime}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.notificationItem}>
              <MaterialCommunityIcons 
                name="doctor" 
                size={20} 
                color="#4682B4" 
                style={styles.notificationIcon}
              />
              <View>
                <Text style={styles.notificationTitle}>Doctor Appointment</Text>
                <Text style={styles.notificationText}>Your appointment is tomorrow at 10:00 AM</Text>
                <Text style={styles.notificationTime}>Yesterday</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Medication Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMedModal}
        onRequestClose={() => setShowMedModal(false)}
      >
        <View style={styles.medModalOverlay}>
          <View style={styles.medModalContainer}>
            {selectedMedication && (
              <>
                <View style={styles.medModalHeader}>
                  <Text style={styles.medModalTitle}>Medication Details</Text>
                  <TouchableOpacity 
                    onPress={() => setShowMedModal(false)}
                    style={styles.medModalCloseButton}
                  >
                    <MaterialCommunityIcons name="close" size={24} color="#4682B4" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.medModalContent}>
                  <Image 
                    source={selectedMedication.image} 
                    style={styles.medModalImage}
                  />
                  <Text style={styles.medModalName}>{selectedMedication.name}</Text>
                  <Text style={styles.medModalDose}>{selectedMedication.grams} • {selectedMedication.capsules} Capsules</Text>
                  <Text style={styles.medModalSchedule}>{selectedMedication.daily} at {selectedMedication.time}</Text>
                  
                  <View style={styles.medModalButtons}>
                    <TouchableOpacity 
                      style={[styles.medModalButton, styles.skipButton]}
                      onPress={() => {
                        console.log('Skipped:', selectedMedication.name);
                        setShowMedModal(false);
                      }}
                    >
                      <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.medModalButton, styles.takeButton]}
                      onPress={() => {
                        console.log('Taken:', selectedMedication.name);
                        setShowMedModal(false);
                      }}
                    >
                      <Text style={styles.takeButtonText}>Take</Text>
                      <MaterialCommunityIcons name="check" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <Animated.FlatList
        data={medications}
        keyExtractor={(_, idx) => `med-${idx}`}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: HEADER_MAX_HEIGHT + 16 }
        ]}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#4682B4"
            progressViewOffset={HEADER_MAX_HEIGHT}
          />
        }
        renderItem={renderMedItem}
        ListEmptyComponent={
          <View style={styles.noMedContainer}>
            <Image 
              source={require('../../assets/images/no-entry.png')} 
              style={styles.emptyStateImage}
            />
            <Text style={styles.noMedText}>No medications scheduled</Text>
            <Text style={styles.noMedSubText}>for {getLabel(selectedDate)}</Text>
          </View>
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
      {renderModals()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    width: '100%',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4682B4',
    zIndex: 1000,
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  dateContainer: {
    paddingHorizontal: 24,
    marginVertical: 8,
  },
  calendarContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  logo: {
    width: 90,
    height: 40,
    resizeMode: 'contain',
    tintColor: '#FFF',
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  todayText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF4BE',
    marginBottom: 4,
  },
  fullDateText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  weekContainer: {
    width: WEEK_ITEM_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  calendarItem: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    width: 48,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDate: {
    backgroundColor: '#FFF',
  },
  todayIndicator: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 4,
  },
  unselectedDate: {
    color: 'rgba(255,255,255,0.8)',
  },
  day: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  unselectedDay: {
    color: 'rgba(255,255,255,0.7)',
  },
  selectedText: {
    color: '#4682B4',
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  medRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  medIconContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pillImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  medDetails: {
    flex: 1,
  },
  medName: {
    fontWeight: '700',
    fontSize: 16,
    color: '#3D4B6B',
    marginBottom: 2,
  },
  medGrams: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 6,
  },
  medInfoContainer: {
    flexDirection: 'row',
  },
  medInfo: {
    fontSize: 13,
    color: '#64748B',
  },
  timeContainer: {
    backgroundColor: '#BBE2EC',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  timeText: {
    color: '#3D4B6B',
    fontWeight: 500,
    fontSize: 12,
  },
  noMedContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateImage: {
    width: 120,
    height: 120,
    opacity: 0.5,
    marginBottom: 24,
  },
  noMedText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  noMedSubText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  headerIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: '#FFF4BE',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.blue,
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  closeButton: {
    padding: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  notificationTitle: {
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  notificationText: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    color: '#94A3B8',
    fontSize: 12,
  },
  medModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medModalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    padding: 20,
  },
  medModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  medModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  medModalCloseButton: {
    padding: 8,
  },
  medModalContent: {
    alignItems: 'center',
  },
  medModalImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  medModalName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  medModalDose: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  medModalSchedule: {
    fontSize: 16,
    color: '#4682B4',
    marginBottom: 30,
    fontWeight: '500',
  },
  medModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  medModalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  skipButton: {
    backgroundColor: '#F1F5F9',
    marginRight: 10,
  },
  takeButton: {
    backgroundColor: '#4682B4',
    marginLeft: 10,
  },
  skipButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 16,
  },
  takeButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
});