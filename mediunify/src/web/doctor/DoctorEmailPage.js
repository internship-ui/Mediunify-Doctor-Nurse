import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doctor } from '../../data/mockData';

export default function DoctorEmailPage({ setActiveTab, onNavigateHome }) {
  const doctorEmail = doctor?.email || 'dr.arvind.rao@mediunify.com';

  const [activeFolder, setActiveFolder] = useState('inbox'); // 'inbox' | 'clinical' | 'dispatch' | 'starred' | 'sent'
  const [selectedEmailId, setSelectedEmailId] = useState('email-1');
  const [searchMailQuery, setSearchMailQuery] = useState('');
  const [showComposeModal, setShowComposeModal] = useState(false);

  // Compose Form
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // Sample Emails Dataset matching user image
  const [emails, setEmails] = useState([
    {
      id: 'email-1',
      folder: 'inbox',
      category: 'clinical',
      senderName: 'Dr. Arvind Rao (Lead Physician)',
      senderEmail: 'dr.arvind.rao@mediunify.com',
      avatarBg: '#E0F2FE',
      avatarColor: '#0284C7',
      initials: 'AR',
      subject: 'Patient Care Plan Update: Priya Sharma (Indiranagar)',
      snippet: 'Please verify wound healing progress and check sterile dressing on left forearm. Advise low sodium and report vitals...',
      date: 'Today, 10:45 AM',
      unread: true,
      starred: true,
      priority: 'High Priority',
      body: `Dear Clinical Care Team,

Regarding patient Priya Sharma (Indiranagar, Bangalore) scheduled for consultation and dressing review today:

1. Please inspect the surgical incision site on the left forearm for any signs of erythema or exudate.
2. Apply the fresh silver sulfadiazine dressing as prescribed.
3. Record blood pressure, pulse, and temperature immediately on arrival using your MediUnify care mobile app.
4. If patient complains of throbbing pain (>4 on VAS), please notify the attending physician desk promptly.

All sterile consumables have been allocated to your care kit at Indiranagar Hub Station #3.

Warm regards,
Dr. Arvind Rao, MD
Consultant Physician & Home Care Lead
MediUnify Health Network`,
      attachments: [
        { name: 'Priya_Sharma_Care_Protocol.pdf', size: '1.2 MB' },
        { name: 'Prescription_Dressing_Rx.pdf', size: '640 KB' },
      ],
    },
    {
      id: 'email-2',
      folder: 'inbox',
      category: 'dispatch',
      senderName: 'MediUnify Dispatch Hub',
      senderEmail: 'dispatch.bengaluru@mediunify.com',
      avatarBg: '#FEF3C7',
      avatarColor: '#D97706',
      initials: 'DH',
      subject: 'New Service Assignment: Indiranagar Cluster #4',
      snippet: 'New wound dressing service dispatched. Target arrival 4:00 PM today. Travel allowance token generated...',
      date: 'Today, 09:30 AM',
      unread: true,
      starred: false,
      priority: 'Standard',
      body: `Hello Doctor & Care Coordinators,

Service booking #MN-99214 has been confirmed and routed to the clinician schedule.

• Patient: Priya Sharma (28 yrs, Female)
• Service: In-Person Consultation & Dressing Review
• Schedule Time: Today, 4:00 PM
• Location: 12th Main, Indiranagar (3.2 km from clinic hub)
• Dispatch Token: #DISP-77401

The consultation summary and electronic prescription form are primed in your Appointments dossier.

MediUnify Automated Dispatch Central`,
      attachments: [{ name: 'Dispatch_Route_Sheet.pdf', size: '420 KB' }],
    },
    {
      id: 'email-3',
      folder: 'inbox',
      category: 'admin',
      senderName: 'Karnataka State Nursing Council (KSNC)',
      senderEmail: 'registrar@ksnc-verification.gov.in',
      avatarBg: '#DCFCE7',
      avatarColor: '#166534',
      initials: 'KS',
      subject: 'Confirmation: Registration Certificate Renewal Verified',
      snippet: 'Your medical license credential KNC-2020-554128 has been re-verified for 2026-2027 clinical service compliance...',
      date: '08 Oct 2026',
      unread: false,
      starred: true,
      priority: 'Official',
      body: `Dear Dr. Arvind Rao,

This is to confirm that the clinical staff credentials and hospital affiliation tokens for MediUnify Clinician Desk have been verified.

Digital verification certificate status: "Active & Certified".

Registrar,
Karnataka Medical Council & Indian Medical Council`,
      attachments: [{ name: 'Verified_Credential_Certificate_2026.pdf', size: '1.8 MB' }],
    },
    {
      id: 'email-4',
      folder: 'inbox',
      category: 'patient',
      senderName: 'Family of Rohan Mehta',
      senderEmail: 'rohan.mehta.personal@gmail.com',
      avatarBg: '#F3E8FF',
      avatarColor: '#7E22CE',
      initials: 'RM',
      subject: 'Thank you for yesterday’s compassionate home care visit',
      snippet: 'Father’s BP has normalized and he is sleeping comfortably. Thank you for your patience and careful administration...',
      date: '06 Oct 2026',
      unread: false,
      starred: false,
      priority: 'Feedback',
      body: `Dear Dr. Rao,

We wanted to extend our sincere gratitude for reviewing my father's blood pressure reports and adjusting the medications yesterday. His readings are down to 128/82 mmHg and he is resting well.

We will share the follow-up readings next Tuesday via MediUnify.

Best regards,
Rohan Mehta & Family`,
      attachments: [],
    },
  ]);

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  const filteredEmails = emails.filter((e) => {
    if (activeFolder === 'clinical') return e.category === 'clinical';
    if (activeFolder === 'dispatch') return e.category === 'dispatch';
    if (activeFolder === 'starred') return e.starred;
    if (activeFolder === 'sent') return e.folder === 'sent';
    if (searchMailQuery.trim()) {
      const q = searchMailQuery.toLowerCase();
      return (
        e.senderName.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.snippet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = emails.filter((e) => e.unread).length;

  const handleSendEmail = () => {
    if (!composeTo.trim() || !composeSubject.trim()) {
      alert('Please fill recipient email and subject.');
      return;
    }
    const newMail = {
      id: `email-${Date.now()}`,
      folder: 'sent',
      category: 'clinical',
      senderName: 'Dr. Arvind Rao',
      senderEmail: doctorEmail,
      avatarBg: '#E2E8F0',
      avatarColor: '#1E293B',
      initials: 'AR',
      subject: composeSubject,
      snippet: composeBody.slice(0, 80) + '...',
      date: 'Just now',
      unread: false,
      starred: false,
      priority: 'Sent',
      body: composeBody || 'No content provided.',
      attachments: [],
    };
    setEmails([newMail, ...emails]);
    setShowComposeModal(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
    alert('Email message sent successfully!');
  };

  const toggleStar = (id) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e))
    );
  };

  const markAsRead = (id) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, unread: false } : e))
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header Bar matching user screenshot */}
      <View style={styles.topHeader}>
        <View style={styles.headerTitleGroup}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setActiveTab('dashboard')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={17} color="#081E3E" />
            <Text style={styles.backBtnText}>Dashboard</Text>
          </TouchableOpacity>
          <View style={styles.separatorDot} />
          <Text style={styles.pageTitle}>Messages & Email Communications</Text>
        </View>

        <TouchableOpacity
          style={styles.composeBtn}
          onPress={() => setShowComposeModal(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="create-outline" size={16} color="#FFFFFF" />
          <Text style={styles.composeBtnText}>Compose Email</Text>
        </TouchableOpacity>
      </View>

      {/* Main Mail Workstation (3 Columns) */}
      <View style={styles.mailWorkstation}>
        {/* COLUMN 1: Folders & Quick Contacts */}
        <View style={styles.foldersCol}>
          <Text style={styles.folderSectionTitle}>MAILBOX</Text>

          <TouchableOpacity
            style={[styles.folderItem, activeFolder === 'inbox' && styles.folderItemActive]}
            onPress={() => setActiveFolder('inbox')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="mail-outline"
              size={17}
              color={activeFolder === 'inbox' ? '#0062E0' : '#64748B'}
            />
            <Text
              style={[
                styles.folderItemText,
                activeFolder === 'inbox' && styles.folderItemTextActive,
              ]}
            >
              Inbox
            </Text>
            {unreadCount > 0 && (
              <View style={styles.badgePill}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.folderItem, activeFolder === 'clinical' && styles.folderItemActive]}
            onPress={() => setActiveFolder('clinical')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="medkit-outline"
              size={17}
              color={activeFolder === 'clinical' ? '#0062E0' : '#64748B'}
            />
            <Text
              style={[
                styles.folderItemText,
                activeFolder === 'clinical' && styles.folderItemTextActive,
              ]}
            >
              Clinical Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.folderItem, activeFolder === 'dispatch' && styles.folderItemActive]}
            onPress={() => setActiveFolder('dispatch')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="paper-plane-outline"
              size={17}
              color={activeFolder === 'dispatch' ? '#0062E0' : '#64748B'}
            />
            <Text
              style={[
                styles.folderItemText,
                activeFolder === 'dispatch' && styles.folderItemTextActive,
              ]}
            >
              Dispatch Notices
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.folderItem, activeFolder === 'starred' && styles.folderItemActive]}
            onPress={() => setActiveFolder('starred')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="star-outline"
              size={17}
              color={activeFolder === 'starred' ? '#0062E0' : '#64748B'}
            />
            <Text
              style={[
                styles.folderItemText,
                activeFolder === 'starred' && styles.folderItemTextActive,
              ]}
            >
              Starred
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.folderItem, activeFolder === 'sent' && styles.folderItemActive]}
            onPress={() => setActiveFolder('sent')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="send-outline"
              size={17}
              color={activeFolder === 'sent' ? '#0062E0' : '#64748B'}
            />
            <Text
              style={[
                styles.folderItemText,
                activeFolder === 'sent' && styles.folderItemTextActive,
              ]}
            >
              Sent
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerH} />

          <Text style={styles.folderSectionTitle}>QUICK CONTACTS</Text>
          <View style={styles.contactChip}>
            <View style={[styles.contactDot, { backgroundColor: '#00B894' }]} />
            <Text style={styles.contactChipText} numberOfLines={1}>
              Dr. Arvind Rao (Physician)
            </Text>
          </View>
          <View style={styles.contactChip}>
            <View style={[styles.contactDot, { backgroundColor: '#0284C7' }]} />
            <Text style={styles.contactChipText} numberOfLines={1}>
              Indiranagar Dispatch Desk
            </Text>
          </View>
          <View style={styles.contactChip}>
            <View style={[styles.contactDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.contactChipText} numberOfLines={1}>
              MediUnify Pharmacy Store
            </Text>
          </View>
        </View>

        {/* COLUMN 2: Message List */}
        <View style={styles.messagesListCol}>
          {/* Search inside email */}
          <View style={styles.searchBarWrap}>
            <Ionicons name="search-outline" size={16} color="#94A3B8" />
            <TextInput
              style={styles.searchMailInput}
              placeholder="Search sender, subject or keyword..."
              placeholderTextColor="#94A3B8"
              value={searchMailQuery}
              onChangeText={setSearchMailQuery}
            />
            {searchMailQuery ? (
              <TouchableOpacity onPress={() => setSearchMailQuery('')}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Email list scroll */}
          <ScrollView style={styles.emailsScroll} showsVerticalScrollIndicator={false}>
            {filteredEmails.map((item) => {
              const isSelected = item.id === selectedEmail?.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.emailCard,
                    isSelected && styles.emailCardSelected,
                    item.unread && styles.emailCardUnread,
                  ]}
                  onPress={() => {
                    setSelectedEmailId(item.id);
                    markAsRead(item.id);
                  }}
                  activeOpacity={0.88}
                >
                  <View style={styles.emailCardHeader}>
                    <View style={styles.senderWrap}>
                      <View
                        style={[
                          styles.senderAvatar,
                          { backgroundColor: item.avatarBg },
                        ]}
                      >
                        <Text style={[styles.senderInitials, { color: item.avatarColor }]}>
                          {item.initials}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.senderNameText,
                            item.unread && styles.senderNameUnread,
                          ]}
                          numberOfLines={1}
                        >
                          {item.senderName}
                        </Text>
                        <Text style={styles.dateStampText}>{item.date}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => toggleStar(item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name={item.starred ? 'star' : 'star-outline'}
                        size={16}
                        color={item.starred ? '#F59E0B' : '#CBD5E1'}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[
                      styles.emailSubjectText,
                      item.unread && styles.emailSubjectUnread,
                    ]}
                    numberOfLines={1}
                  >
                    {item.subject}
                  </Text>
                  <Text style={styles.emailSnippetText} numberOfLines={2}>
                    {item.snippet}
                  </Text>

                  <View style={styles.emailMetaRow}>
                    <View style={styles.priorityPill}>
                      <Text style={styles.priorityPillText}>{item.priority}</Text>
                    </View>
                    {item.attachments.length > 0 && (
                      <View style={styles.attachCountPill}>
                        <Ionicons name="attach" size={12} color="#64748B" />
                        <Text style={styles.attachCountText}>
                          {item.attachments.length} files
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* COLUMN 3: Reading Pane (Full Message Body) */}
        <View style={styles.readingPaneCol}>
          {selectedEmail ? (
            <ScrollView style={styles.readingScroll} showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.readingHeader}>
                <Text style={styles.readingSubjectTitle}>{selectedEmail.subject}</Text>

                <View style={styles.readingSenderRow}>
                  <View
                    style={[
                      styles.readingAvatarLarge,
                      { backgroundColor: selectedEmail.avatarBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.readingAvatarInitials,
                        { color: selectedEmail.avatarColor },
                      ]}
                    >
                      {selectedEmail.initials}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.readingSenderName}>{selectedEmail.senderName}</Text>
                    <Text style={styles.readingSenderEmail}>
                      {selectedEmail.senderEmail} · To: {doctorEmail}
                    </Text>
                  </View>

                  <Text style={styles.readingDate}>{selectedEmail.date}</Text>
                </View>

                {/* Actions Row */}
                <View style={styles.readingActionsRow}>
                  <TouchableOpacity
                    style={styles.actionBtnSmall}
                    onPress={() => {
                      setComposeTo(selectedEmail.senderEmail);
                      setComposeSubject(`Re: ${selectedEmail.subject}`);
                      setShowComposeModal(true);
                    }}
                  >
                    <Ionicons name="return-up-back-outline" size={14} color="#0A2342" />
                    <Text style={styles.actionBtnSmallText}>Reply</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtnSmall}
                    onPress={() => {
                      setComposeSubject(`Fwd: ${selectedEmail.subject}`);
                      setComposeBody(`\n\n--- Forwarded Message ---\n${selectedEmail.body}`);
                      setShowComposeModal(true);
                    }}
                  >
                    <Ionicons name="return-up-forward-outline" size={14} color="#0A2342" />
                    <Text style={styles.actionBtnSmallText}>Forward</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtnSmall}
                    onPress={() => alert('Printing clinical order sheet...')}
                  >
                    <Ionicons name="print-outline" size={14} color="#0A2342" />
                    <Text style={styles.actionBtnSmallText}>Print</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Message Body */}
              <View style={styles.readingBodyBox}>
                <Text style={styles.readingBodyText}>{selectedEmail.body}</Text>
              </View>

              {/* Attachments Section */}
              {selectedEmail.attachments.length > 0 && (
                <View style={styles.attachmentsCard}>
                  <Text style={styles.attachmentsHeaderTitle}>
                    Attachments ({selectedEmail.attachments.length})
                  </Text>
                  <View style={styles.attachmentsGrid}>
                    {selectedEmail.attachments.map((att, i) => (
                      <View key={i} style={styles.attachmentTile}>
                        <View style={styles.pdfIconBox}>
                          <Ionicons name="document-text" size={18} color="#DC2626" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.attNameText} numberOfLines={1}>
                            {att.name}
                          </Text>
                          <Text style={styles.attSizeText}>{att.size}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.downloadIconBtn}
                          onPress={() => alert(`Downloading ${att.name}...`)}
                        >
                          <Ionicons name="cloud-download-outline" size={16} color="#0062E0" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          ) : (
            <View style={styles.emptyReadingPane}>
              <Ionicons name="mail-unread-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyReadingText}>Select an email message to view details</Text>
            </View>
          )}
        </View>
      </View>

      {/* Compose Email Modal */}
      <Modal
        visible={showComposeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowComposeModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.composeModalCard}>
            <View style={styles.composeModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="create-outline" size={18} color="#0062E0" />
                <Text style={styles.composeModalTitle}>New Email Message</Text>
              </View>
              <TouchableOpacity onPress={() => setShowComposeModal(false)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.composeFieldRow}>
              <Text style={styles.composeFieldLabel}>From:</Text>
              <Text style={styles.composeFromText}>{doctorEmail}</Text>
            </View>

            <View style={styles.composeFieldRow}>
              <Text style={styles.composeFieldLabel}>To:</Text>
              <TextInput
                style={styles.composeInput}
                placeholder="Recipient email address (e.g. nurse, patient, lab)..."
                placeholderTextColor="#94A3B8"
                value={composeTo}
                onChangeText={setComposeTo}
              />
            </View>

            <View style={styles.composeFieldRow}>
              <Text style={styles.composeFieldLabel}>Subject:</Text>
              <TextInput
                style={styles.composeInput}
                placeholder="Subject of communication..."
                placeholderTextColor="#94A3B8"
                value={composeSubject}
                onChangeText={setComposeSubject}
              />
            </View>

            <View style={styles.composeBodyWrap}>
              <TextInput
                style={styles.composeBodyInput}
                placeholder="Write your clinical notes, patient update, or dispatch query here..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={8}
                value={composeBody}
                onChangeText={setComposeBody}
              />
            </View>

            <View style={styles.composeFooterRow}>
              <TouchableOpacity
                style={styles.attachBtn}
                onPress={() => alert('File attachment dialogue opened.')}
              >
                <Ionicons name="attach" size={16} color="#64748B" />
                <Text style={styles.attachBtnText}>Attach document</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={styles.cancelComposeBtn}
                  onPress={() => setShowComposeModal(false)}
                >
                  <Text style={styles.cancelComposeText}>Discard</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sendEmailBtn} onPress={handleSendEmail}>
                  <Ionicons name="send" size={14} color="#FFFFFF" />
                  <Text style={styles.sendEmailText}>Send Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081E3E',
  },
  separatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  composeBtn: {
    backgroundColor: '#0062E0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  composeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  mailWorkstation: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  // COLUMN 1
  foldersCol: {
    width: 200,
    flexShrink: 0,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  folderSectionTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 7,
    marginBottom: 3,
  },
  folderItemActive: {
    backgroundColor: '#EFF6FF',
  },
  folderItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  folderItemTextActive: {
    color: '#0062E0',
    fontWeight: '700',
  },
  badgePill: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  dividerH: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  contactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  contactDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  contactChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },

  // COLUMN 2
  messagesListCol: {
    width: 320,
    flexShrink: 0,
    backgroundColor: '#F8FAFC',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    flexDirection: 'column',
  },
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchMailInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#0F172A',
    outlineStyle: 'none',
  },
  emailsScroll: {
    flex: 1,
  },
  emailCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    cursor: 'pointer',
  },
  emailCardSelected: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 3,
    borderLeftColor: '#0062E0',
  },
  emailCardUnread: {
    backgroundColor: '#FAFCFF',
  },
  emailCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  senderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  senderAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  senderInitials: {
    fontSize: 11,
    fontWeight: '800',
  },
  senderNameText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  senderNameUnread: {
    fontWeight: '800',
    color: '#0F172A',
  },
  dateStampText: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  emailSubjectText: {
    fontSize: 12.5,
    color: '#475569',
    marginBottom: 4,
  },
  emailSubjectUnread: {
    fontWeight: '700',
    color: '#0F172A',
  },
  emailSnippetText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 8,
  },
  emailMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  attachCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attachCountText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },

  // COLUMN 3
  readingPaneCol: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  readingScroll: {
    flex: 1,
    padding: 24,
  },
  readingHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 16,
    marginBottom: 20,
  },
  readingSubjectTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
    lineHeight: 24,
  },
  readingSenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  readingAvatarLarge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readingAvatarInitials: {
    fontSize: 14,
    fontWeight: '800',
  },
  readingSenderName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  readingSenderEmail: {
    fontSize: 11.5,
    color: '#64748B',
  },
  readingDate: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  readingActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionBtnSmallText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0A2342',
  },
  readingBodyBox: {
    marginBottom: 24,
  },
  readingBodyText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 22,
    whiteSpace: 'pre-wrap',
  },
  attachmentsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 30,
  },
  attachmentsHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  attachmentsGrid: {
    gap: 10,
  },
  attachmentTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    gap: 10,
  },
  pdfIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attNameText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  attSizeText: {
    fontSize: 11,
    color: '#64748B',
  },
  downloadIconBtn: {
    padding: 6,
  },
  emptyReadingPane: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 40,
  },
  emptyReadingText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },

  // Modal Compose
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 99999,
  },
  composeModalCard: {
    width: '100%',
    maxWidth: 620,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 20,
  },
  composeModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  composeModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  composeFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  composeFieldLabel: {
    width: 60,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  composeFromText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  composeInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    outlineStyle: 'none',
  },
  composeBodyWrap: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  composeBodyInput: {
    width: '100%',
    minHeight: 180,
    fontSize: 13.5,
    color: '#0F172A',
    outlineStyle: 'none',
    textAlignVertical: 'top',
  },
  composeFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  attachBtnText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
  cancelComposeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  cancelComposeText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  sendEmailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0062E0',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sendEmailText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
