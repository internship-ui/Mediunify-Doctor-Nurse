const fs = require('fs');

const filePath = 'src/screens/PatientProfileScreen.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Logo import and StatusBar in active imports
if (!content.includes("import Logo from '../components/Logo';")) {
  content = content.replace(
    "import ScreenHeader from '../components/ScreenHeader';",
    "import ScreenHeader from '../components/ScreenHeader';\nimport Logo from '../components/Logo';"
  );
}

if (!content.includes('StatusBar,')) {
  content = content.replace(
    "  Keyboard,\n} from 'react-native';",
    "  Keyboard,\n  StatusBar,\n} from 'react-native';"
  );
}

// 2. Add handleEmergency if not present
if (!content.includes('handleEmergency = () =>')) {
  content = content.replace(
    "export default function PatientProfileScreen({ route, navigation }) {",
    `export default function PatientProfileScreen({ route, navigation }) {
  const handleEmergency = () => {
    Alert.alert(
      'Emergency Call',
      'Initiate an emergency call for an urgent patient case?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', style: 'destructive', onPress: () => {} },
      ]
    );
  };`
  );
}

// 3. Replace ScreenHeader with Dark Navy Header
const headerTarget = `      {/* HEADER */}
      <ScreenHeader
        title={patient.name}
        subtitle="Patient Profile"
        onBack={() => navigation.goBack()}
        navigation={navigation}
      />`;

const headerReplacement = `      <StatusBar barStyle="light-content" backgroundColor="#061A3A" />

      {/* ======================================================
          DARK NAVY HEADER (MATCHING APPOINTMENTS & USER IMAGE)
      ======================================================= */}
      <View style={styles.headerNavy}>
        {/* TOP BRAND ROW: LOGO & "MediUnify" + ACTIONS */}
        <View style={styles.topBrandRow}>
          <View style={styles.brandRow}>
            <Logo size={34} />
            <Text style={styles.brandName}>
              <Text style={styles.brandMedi}>Medi</Text>
              <Text style={styles.brandUnify}>Unify</Text>
            </Text>
          </View>

          <View style={styles.headerIconsRow}>
            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={handleEmergency}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={17} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={() => navigation && navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={17} color="#FFFFFF" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* NAVIGATION ROW: (←) Patient Details */}
        <View style={styles.navHeaderRow}>
          <TouchableOpacity
            style={styles.headerNavCircleBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.screenMainTitle}>Patient Details</Text>

          <View style={{ width: 40 }} />
        </View>
      </View>`;

content = content.replace(headerTarget, headerReplacement);

// 4. Update avatar and theme colors to Navy Blue in styles
content = content.replace(/avatar:\s*\{[^}]+\}/, `avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#071E42',
    marginBottom: spacing.xs,
  }`);

content = content.replace(/avatarText:\s*\{[^}]+\}/, `avatarText: {
    ...typography.h2,
    color: '#071E42',
    fontWeight: '800',
  }`);

content = content.replace(/quickBtn:\s*\{[^}]+\}/, `quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: '#EEF4FC',
    borderWidth: 1.2,
    borderColor: '#071E42',
  }`);

content = content.replace(/quickBtnText:\s*\{[^}]+\}/, `quickBtnText: {
    ...typography.smallBold,
    color: '#071E42',
  }`);

// Add Dark Navy Header styles at styles object start
const headerStyles = `  /* Dark Navy Header */
  headerNavy: {
    backgroundColor: '#061A3A',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 50,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  brandMedi: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  brandUnify: {
    color: '#00B894',
    fontWeight: '800',
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#00B894',
    borderWidth: 1,
    borderColor: '#061A3A',
  },
  navHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: 4,
  },
  headerNavCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenMainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
`;

content = content.replace("const styles = StyleSheet.create({\n", "const styles = StyleSheet.create({\n" + headerStyles);

fs.writeFileSync(filePath, content, 'utf8');
console.log('PatientProfileScreen.js updated successfully!');
