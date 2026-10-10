import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MapRoutePreview({
  location = '12th Main, Indiranagar',
  distance = '3.2 km',
  eta = 'about 14 min',
  onMapPress,
}) {
  const handleOpenMaps = () => {
    if (onMapPress) {
      onMapPress();
      return;
    }
    const query = encodeURIComponent(location + ', Bengaluru');
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    Linking.openURL(url).catch(() => {
      Alert.alert('Open Maps', `Navigation to ${location}`);
    });
  };

  return (
    <View style={styles.cardContainer}>
      {/* MAP GRAPHIC CANVAS */}
      <View style={styles.mapCanvas}>
        {/* Background Grid Roads */}
        <View style={styles.roadHorizontal1} />
        <View style={styles.roadHorizontal2} />
        <View style={styles.roadVertical1} />
        <View style={styles.roadVertical2} />

        {/* Decorative City Area Blocks */}
        <View style={styles.cityBlock1} />
        <View style={styles.cityBlock2} />
        <View style={styles.cityBlock3} />
        <View style={styles.cityBlock4} />

        {/* ROUTE LINE (Curved / Dotted Path) */}
        <View style={styles.routeContainer}>
          {/* Start Point Pin (Dark Navy Circle) */}
          <View style={styles.startDotWrap}>
            <View style={styles.startDot} />
          </View>

          {/* Dotted Trail Representation */}
          <View style={styles.trailRow}>
            {[...Array(14)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.trailSegment,
                  {
                    transform: [
                      {
                        translateY: Math.sin((i / 13) * Math.PI) * -16 + (i * -1.8),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>

          {/* Destination Target Marker (Green Ring with inner dot) */}
          <View style={styles.destPinWrap}>
            <View style={styles.destOuterRing}>
              <View style={styles.destInnerCore} />
            </View>
          </View>
        </View>

        {/* Floating ETA chip */}
        <View style={styles.etaChip}>
          <Ionicons name="time" size={11} color="#00B894" />
          <Text style={styles.etaChipText}>{eta}</Text>
        </View>
      </View>

      {/* FOOTER BAR WITH LOCATION & MAP BUTTON */}
      <View style={styles.footerRow}>
        <View style={styles.locationWrap}>
          <View style={styles.pinCircle}>
            <Ionicons name="location" size={17} color="#00B894" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.locationTitle} numberOfLines={1}>
              {location}
            </Text>
            <Text style={styles.distanceMeta}>
              {distance} · {eta}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.mapBtn}
          onPress={handleOpenMaps}
          activeOpacity={0.75}
        >
          <Ionicons name="navigate-outline" size={13} color="#08317C" style={{ marginRight: 4 }} />
          <Text style={styles.mapBtnText}>Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#08317C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 12,
  },
  mapCanvas: {
    height: 120,
    backgroundColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  /* Abstract Street Grid */
  roadHorizontal1: {
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: '#FFFFFF',
  },
  roadHorizontal2: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: '#FFFFFF',
  },
  roadVertical1: {
    position: 'absolute',
    left: '28%',
    top: 0,
    bottom: 0,
    width: 14,
    backgroundColor: '#FFFFFF',
  },
  roadVertical2: {
    position: 'absolute',
    right: '25%',
    top: 0,
    bottom: 0,
    width: 16,
    backgroundColor: '#FFFFFF',
  },
  cityBlock1: {
    position: 'absolute',
    top: 8,
    left: 10,
    width: 80,
    height: 24,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    opacity: 0.6,
  },
  cityBlock2: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    width: 70,
    height: 14,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    opacity: 0.6,
  },
  cityBlock3: {
    position: 'absolute',
    top: 8,
    right: 14,
    width: 60,
    height: 22,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    opacity: 0.6,
  },
  cityBlock4: {
    position: 'absolute',
    top: 56,
    right: 12,
    width: 60,
    height: 36,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    opacity: 0.6,
  },

  /* ROUTE OVERLAY */
  routeContainer: {
    position: 'absolute',
    left: 30,
    right: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  startDotWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(8, 49, 124, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#08317C',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  trailRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  trailSegment: {
    width: 6,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#08317C',
  },
  destPinWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  destOuterRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#00B894',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  destInnerCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00B894',
  },
  etaChip: {
    position: 'absolute',
    top: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    zIndex: 15,
  },
  etaChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#08317C',
  },

  /* FOOTER */
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  pinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  locationTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#08317C',
  },
  distanceMeta: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mapBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#08317C',
  },
});
