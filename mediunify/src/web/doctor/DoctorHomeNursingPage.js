import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { patients } from '../../data/mockData';

export default function DoctorHomeNursingPage() {
  const [nursingOrders, setNursingOrders] = useState([
    {
      id: 'hn-101',
      patient: 'Vikram Singh',
      age: 68,
      address: '74, Palm Avenue, Indiranagar, Bengaluru',
      task: 'Post-operative knee dressing & passive mobility exercises',
      nurse: 'Sister Mary Joseph, RN',
      nurseContact: '+91 98765 43210',
      schedule: 'Daily (Morning 10:00 AM)',
      status: 'Active',
      lastVitals: { bp: '130/84', pulse: '74', spo2: '98%' },
    },
    {
      id: 'hn-102',
      patient: 'Arjun Menon',
      age: 45,
      address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru',
      task: 'Diabetic foot ulcer sterile cleaning & blood glucose monitoring',
      nurse: 'Nurse Rajesh Kumar, GNM',
      nurseContact: '+91 98765 11223',
      schedule: 'Alternate Days (02:00 PM)',
      status: 'Active',
      lastVitals: { bp: '128/82', pulse: '80', spo2: '99%' },
    },
    {
      id: 'hn-103',
      patient: 'Sunita Patel',
      age: 72,
      address: '12, 5th Cross, Malleshwaram, Bengaluru',
      task: 'Subcutaneous insulin administration & elderly fall-risk assessment',
      nurse: 'Sister Ancy Philip, BSc Nursing',
      nurseContact: '+91 98765 99887',
      schedule: 'Twice Daily (Morning & Evening)',
      status: 'Scheduled',
      lastVitals: { bp: '136/88', pulse: '76', spo2: '97%' },
    },
  ]);

  const handleDispatchNurse = () => {
    alert('Home nursing dispatch request opened! Select patient and care protocol.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Home Nursing & At-Home Care Coordination</Text>
          <Text style={styles.pageSub}>
            Coordinate home nursing visits, monitor patient vitals remotely, and assign verified nurses
          </Text>
        </View>

        <TouchableOpacity style={styles.dispatchBtn} onPress={handleDispatchNurse} activeOpacity={0.8}>
          <Ionicons name="add-circle" size={16} color="#FFFFFF" />
          <Text style={styles.dispatchBtnText}>Assign New Nurse</Text>
        </TouchableOpacity>
      </View>

      {/* Orders Grid */}
      <View style={styles.ordersGrid}>
        {nursingOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderCardTop}>
              <View style={styles.patientInfoRow}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={18} color="#00B894" />
                </View>
                <View>
                  <Text style={styles.patientName}>{order.patient}</Text>
                  <Text style={styles.patientSub}>{order.age} yrs • ID: {order.id}</Text>
                </View>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
              </View>
            </View>

            {/* Address */}
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={15} color="#64748B" />
              <Text style={styles.addressText} numberOfLines={1}>{order.address}</Text>
            </View>

            {/* Task */}
            <View style={styles.taskBox}>
              <Text style={styles.taskLabel}>CARE DIRECTIVE & PROCEDURE:</Text>
              <Text style={styles.taskText}>{order.task}</Text>
            </View>

            {/* Assigned Nurse */}
            <View style={styles.nurseRow}>
              <View style={styles.nurseInfo}>
                <Ionicons name="medkit" size={15} color="#08317C" />
                <View>
                  <Text style={styles.nurseName}>{order.nurse}</Text>
                  <Text style={styles.scheduleText}>{order.schedule}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.callNurseBtn}
                onPress={() => alert(`Dialing ${order.nurse} at ${order.nurseContact}`)}
              >
                <Ionicons name="call" size={14} color="#00B894" />
              </TouchableOpacity>
            </View>

            {/* Last Logged Vitals by Nurse */}
            <View style={styles.vitalsFooter}>
              <Text style={styles.vitalsFootLabel}>LATEST VITALS:</Text>
              <View style={styles.vitalsPillRow}>
                <Text style={styles.vitalTag}>BP: <Text style={styles.bold}>{order.lastVitals.bp}</Text></Text>
                <Text style={styles.vitalTag}>Pulse: <Text style={styles.bold}>{order.lastVitals.pulse}</Text></Text>
                <Text style={styles.vitalTag}>SpO2: <Text style={styles.bold}>{order.lastVitals.spo2}</Text></Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    gap: 20,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  pageSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  dispatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00B894',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  dispatchBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  ordersGrid: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    gap: 14,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  orderCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  patientSub: {
    fontSize: 11,
    color: '#64748B',
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressText: {
    fontSize: 12,
    color: '#64748B',
  },
  taskBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    gap: 4,
  },
  taskLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#08317C',
    letterSpacing: 0.5,
  },
  taskText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  nurseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
  },
  nurseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nurseName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  scheduleText: {
    fontSize: 11,
    color: '#64748B',
  },
  callNurseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  vitalsFootLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  vitalsPillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  vitalTag: {
    fontSize: 11,
    color: '#475569',
  },
  bold: {
    fontWeight: '700',
    color: '#00B894',
  },
});
