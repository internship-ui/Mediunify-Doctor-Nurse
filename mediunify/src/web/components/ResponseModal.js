import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResponseModal({
  visible,
  title = 'Action Completed',
  message = 'Your request has been processed successfully.',
  details = null,
  type = 'success',
  buttonText = 'OK',
  onOk,
  onClose,
}) {
  if (!visible) return null;

  const handleDismiss = onOk || onClose || (() => {});
  const iconName = type === 'success' ? 'checkmark-circle' : type === 'warning' ? 'alert-circle' : 'information-circle';
  const iconColor = type === 'success' ? '#00B894' : type === 'warning' ? '#F59E0B' : '#0284C7';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleDismiss}
      >
        <TouchableOpacity
          style={styles.card}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation && e.stopPropagation()}
        >
          {/* Top Status Icon */}
          <View style={[styles.iconCircle, { backgroundColor: `${iconColor}18` }]}>
            <Ionicons name={iconName} size={48} color={iconColor} />
          </View>

          {/* Title & Message */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Optional Details Box */}
          {details && (
            <View style={styles.detailsBox}>
              {Array.isArray(details) ? (
                details.map((item, idx) => (
                  <View key={idx} style={styles.detailRow}>
                    <Ionicons name="checkmark-done" size={14} color="#00B894" />
                    <Text style={styles.detailText}>{item}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.detailText}>{details}</Text>
              )}
            </View>
          )}

          {/* OK Button */}
          <TouchableOpacity
            style={styles.okButton}
            onPress={handleDismiss}
            activeOpacity={0.88}
          >
            <Text style={styles.okButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 30, 62, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 99999,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#081E3E',
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  message: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  detailsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    flex: 1,
  },
  okButton: {
    backgroundColor: '#081E3E',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#081E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
