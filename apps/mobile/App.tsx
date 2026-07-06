import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, Switch, TouchableOpacity } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { OtpScreen } from './src/screens/OtpScreen';
import { MsmeCockpitScreen } from './src/screens/MsmeCockpitScreen';
import { ModeToggle, colors, typography } from '@trustbank/ui-kit';
import { isSimulatedOffline, setSimulatedOffline } from './src/utils/apiClient';
import { getOrCreateDeviceId } from './src/utils/device';

type ScreenName = 'LOGIN' | 'OTP' | 'HOME' | 'MSME_COCKPIT';

export default function App() {
  const [isProMode, setIsProMode] = useState(false);
  const [isOffline, setIsOffline] = useState(isSimulatedOffline);
  const [lastUpdated] = useState('5m ago');
  
  // Auth state
  const [screen, setScreen] = useState<ScreenName>('LOGIN');
  const [deviceId, setDeviceId] = useState('');
  const [username, setUsername] = useState('');
  const [trustReason, setTrustReason] = useState('');
  const [sessionToken, setSessionToken] = useState('');

  useEffect(() => {
    async function initDevice() {
      const id = await getOrCreateDeviceId();
      setDeviceId(id);
    }
    initDevice();
  }, []);

  const toggleOffline = (value: boolean) => {
    setIsOffline(value);
    setSimulatedOffline(value);
  };

  const handleRequireOtp = (user: string, devId: string, reason: string) => {
    setUsername(user);
    setDeviceId(devId);
    setTrustReason(reason);
    setScreen('OTP');
  };

  const handleLoginSuccess = (data: { token: string; trustReason: string }) => {
    setSessionToken(data.token);
    setTrustReason(data.trustReason);
    setScreen('HOME');
  };

  const resetTrustScore = async () => {
    try {
      await fetch('http://localhost:3000/auth/reset-trust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId })
      });
      alert('Trust score reset. Next login will require OTP.');
      setScreen('LOGIN');
      setSessionToken('');
    } catch (e) {
      alert('Failed to reset trust score. Ensure NestJS backend is running.');
    }
  };

  const handleSignOut = () => {
    setScreen('LOGIN');
    setSessionToken('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceFog} />
      
      {/* Dev Toggle for Network */}
      <View style={styles.devBar}>
        <Text style={styles.devText}>Offline Mode:</Text>
        <Switch value={isOffline} onValueChange={toggleOffline} />
        
        {deviceId ? (
          <TouchableOpacity style={styles.devBtn} onPress={resetTrustScore}>
            <Text style={styles.devBtnText}>Reset Trust</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Showing saved data — last updated {lastUpdated}</Text>
        </View>
      )}

      {screen === 'LOGIN' && (
        <LoginScreen 
          onLoginSuccess={handleLoginSuccess}
          onRequireOtp={handleRequireOtp}
        />
      )}

      {screen === 'OTP' && (
        <OtpScreen 
          username={username}
          deviceId={deviceId}
          trustReason={trustReason}
          onOtpSuccess={(token) => handleLoginSuccess({ token, trustReason: 'MFA verified successfully' })}
          onCancel={() => setScreen('LOGIN')}
        />
      )}

      {screen === 'HOME' && (
        <>
          <View style={styles.header}>
            {trustReason && (
              <View style={styles.securityIndicator}>
                <Text style={styles.securityText}>🛡️ {trustReason}</Text>
              </View>
            )}
            <View style={styles.headerActions}>
              <ModeToggle isProMode={isProMode} onToggle={setIsProMode} />
              <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
          <HomeScreen 
            isProMode={isProMode} 
            deviceId={deviceId}
            onNavigateMsme={() => setScreen('MSME_COCKPIT')}
          />
        </>
      )}

      {screen === 'MSME_COCKPIT' && (
        <>
          <View style={styles.header}>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
          <MsmeCockpitScreen onBack={() => setScreen('HOME')} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceFog,
  },
  devBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 8,
    backgroundColor: '#ffeaa7',
  },
  devText: {
    ...typography.caption,
    marginRight: 8,
  },
  devBtn: {
    marginLeft: 12,
    backgroundColor: colors.brandOrange500,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  devBtnText: {
    color: colors.surfaceWhite,
    fontSize: 10,
    fontWeight: 'bold',
  },
  offlineBanner: {
    backgroundColor: colors.statusWarn,
    padding: 8,
    alignItems: 'center',
  },
  offlineText: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.brandTeal900,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  securityIndicator: {
    backgroundColor: 'rgba(21, 129, 88, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    maxWidth: '60%',
  },
  securityText: {
    fontSize: 11,
    color: colors.brandTeal600,
    fontWeight: 'bold',
  },
  signOutBtn: {
    marginLeft: 12,
    backgroundColor: 'transparent',
    borderColor: colors.brandTeal900,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  signOutText: {
    color: colors.brandTeal900,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
