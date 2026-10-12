import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography } from '../../theme/colors';

export default function CallModal({ visible, onClose, patientPhone, patientName }) {
  const handleMakeCall = (number, label) => {
    onClose();
    Alert.alert(
      `Calling ${label}`,
      `Dialing ${number}...`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${number}`).catch(() => {
              Alert.alert('Phone Call', `Would dial ${number}`);
            });
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.phoneIconWrap}>
              <Ionicons name="call" size={22} color="#00B894" />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.title}>Quick Call / Emergency</Text>
              <Text style={styles.subtitle}>Direct lines for home nursing support</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.optionsList}>
            {patientPhone && (
              <TouchableOpacity
                style={[styles.optionItem, styles.patientItem]}
                onPress={() => handleMakeCall(patientPhone, patientName || 'Patient')}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="person" size={20} color="#0284C7" />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>Call Patient ({patientName || 'Assigned Patient'})</Text>
                  <Text style={styles.optionNumber}>{patientPhone}</Text>
                </View>
                <Ionicons name="call-outline" size={20} color="#0284C7" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => handleMakeCall('+91 80 4567 8900', 'MediUnify Admin Desk')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: '#E6FAF6' }]}>
                <Ionicons name="business" size={20} color="#00B894" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Home Nursing Admin Desk</Text>
                <Text style={styles.optionNumber}>+91 80 4567 8900 (24x7 Helpdesk)</Text>
              </View>
              <Ionicons name="call-outline" size={20} color="#00B894" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => handleMakeCall('+91 98450 99881', 'Nursing Supervisor')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="medkit" size={20} color="#D97706" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Nursing Clinical Supervisor</Text>
                <Text style={styles.optionNumber}>+91 98450 99881 (Emergency escalations)</Text>
              </View>
              <Ionicons name="call-outline" size={20} color="#D97706" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionItem, styles.emergencyItem]}
              onPress={() => handleMakeCall('108', 'Emergency Medical Ambulance')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="warning" size={20} color="#DC2626" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={[styles.optionTitle, { color: '#DC2626' }]}>Emergency Ambulance</Text>
                <Text style={styles.optionNumber}>108 (Urgent Patient Critical Care)</Text>
              </View>
              <Ionicons name="call" size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.cancelBtnText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 17, 39, 0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  phoneIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6FAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#08317C',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  optionsList: {
    gap: 12,
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  patientItem: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  emergencyItem: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  optionNumber: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cancelBtn: {
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
});
