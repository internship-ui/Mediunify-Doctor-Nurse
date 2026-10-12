import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doctor, appointments } from '../../data/mockData';

export default function DoctorEarningsPage() {
  const [payoutRequested, setPayoutRequested] = useState(false);

  const transactions = [
    { id: 'tx-1', patient: 'Rahul Kumar', service: 'Video Consultation', date: 'Today, 10:00 AM', amount: 500, status: 'Settled' },
    { id: 'tx-2', patient: 'Priya Sharma', service: 'In-Clinic Consultation', date: 'Today, 11:30 AM', amount: 500, status: 'Pending' },
    { id: 'tx-3', patient: 'Arjun Menon', service: 'Video Consultation (Diabetes)', date: 'Today, 01:00 PM', amount: 500, status: 'Settled' },
    { id: 'tx-4', patient: 'Sneha Iyer', service: 'In-Clinic Follow-up', date: 'Yesterday, 04:30 PM', amount: 500, status: 'Settled' },
    { id: 'tx-5', patient: 'Vikram Singh', service: 'Home Nursing Assessment', date: '28 Aug 2026', amount: 1200, status: 'Settled' },
    { id: 'tx-6', patient: 'Sunita Patel', service: 'Prescription Renewal', date: '27 Aug 2026', amount: 350, status: 'Settled' },
  ];

  const totalBalance = 24650;
  const todayEarnings = 1500;
  const thisMonthTotal = 42800;

  const handlePayout = () => {
    setPayoutRequested(true);
    setTimeout(() => {
      alert('Withdrawal request of ₹24,650 submitted to verified bank account (HDFC Bank ••••4128). Expected credit in 24 hours.');
    }, 400);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Earnings & Financial Billing</Text>
          <Text style={styles.pageSub}>Track consultation revenue, payout settlement history, and tax statements</Text>
        </View>

        <TouchableOpacity
          style={[styles.payoutBtn, payoutRequested && styles.payoutBtnDisabled]}
          onPress={handlePayout}
          disabled={payoutRequested}
          activeOpacity={0.8}
        >
          <Ionicons name="card" size={16} color="#FFFFFF" />
          <Text style={styles.payoutBtnText}>
            {payoutRequested ? 'Withdrawal Processing' : 'Withdraw Balance to Bank'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Financial Stat Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Available Balance</Text>
          <Text style={[styles.statValue, { color: '#00B894' }]}>₹{totalBalance.toLocaleString()}</Text>
          <Text style={styles.statSub}>Ready for bank withdrawal</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Today's Earnings</Text>
          <Text style={styles.statValue}>₹{todayEarnings.toLocaleString()}</Text>
          <Text style={styles.statSub}>From 3 consultations today</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Current Month (Oct 2026)</Text>
          <Text style={styles.statValue}>₹{thisMonthTotal.toLocaleString()}</Text>
          <Text style={styles.statSub}>+18.4% compared to last month</Text>
        </View>
      </View>

      {/* Transaction Ledger Table */}
      <View style={styles.tableCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>RECENT TRANSACTION HISTORY</Text>
          <Text style={styles.cardSub}>Direct patient consultations & telehealth credits</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 1.5 }]}>TRANSACTION ID</Text>
          <Text style={[styles.th, { flex: 2 }]}>PATIENT & SERVICE</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>DATE & TIME</Text>
          <Text style={[styles.th, { flex: 1.2 }]}>STATUS</Text>
          <Text style={[styles.th, { flex: 1.2, textAlign: 'right' }]}>AMOUNT</Text>
        </View>

        {transactions.map((tx, idx) => (
          <View key={tx.id} style={[styles.tableRow, idx % 2 === 1 && styles.rowAlt]}>
            <Text style={[styles.td, { flex: 1.5, color: '#64748B', fontWeight: '700' }]}>{tx.id}</Text>
            <View style={{ flex: 2 }}>
              <Text style={styles.patientName}>{tx.patient}</Text>
              <Text style={styles.serviceName}>{tx.service}</Text>
            </View>
            <Text style={[styles.td, { flex: 1.5, color: '#475569' }]}>{tx.date}</Text>
            <View style={{ flex: 1.2 }}>
              <View style={[styles.statusBadge, tx.status === 'Settled' ? styles.statusSettled : styles.statusPending]}>
                <Text style={[styles.statusBadgeText, tx.status === 'Settled' ? styles.textSettled : styles.textPending]}>
                  {tx.status}
                </Text>
              </View>
            </View>
            <Text style={[styles.td, { flex: 1.2, textAlign: 'right', fontWeight: '800', color: '#0F172A', fontSize: 13 }]}>
              +₹{tx.amount}
            </Text>
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
  payoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#00B894',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0, 184, 148, 0.35)',
  },
  payoutBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  payoutBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    gap: 4,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 4,
  },
  statSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 2,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.6,
  },
  cardSub: {
    fontSize: 11,
    color: '#64748B',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  th: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowAlt: {
    backgroundColor: '#FAFCFE',
  },
  td: {
    fontSize: 12,
  },
  patientName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  serviceName: {
    fontSize: 11,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusSettled: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  textSettled: {
    color: '#16A34A',
  },
  textPending: {
    color: '#D97706',
  },
});
