import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function Scan() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const scanLinePos = useRef(new Animated.Value(0)).current;

  const startScanning = () => {
    setIsScanning(true);
    setScannedItem(null);
    
    // Animate scan line
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLinePos, {
          toValue: height * 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLinePos, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Simulate scan completion after 3 seconds
    setTimeout(() => {
      setIsScanning(false);
      setScannedItem({
        name: 'Paracetamol 500mg',
        type: 'Tablet',
        image: require('../../assets/images/paracetamol.png'),
        match: '98%',
        details: 'Pain reliever and fever reducer'
      });
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {/* Camera Preview Area */}
      <View style={styles.cameraContainer}>
        <Image 
          source={require('../../assets/images/medicine-scan.jpg')} 
          style={styles.cameraPreview}
          resizeMode="cover"
        />
        
        {/* Viewfinder */}
        <View style={styles.viewfinder}>
          {/* Corner borders */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          
          {/* Animated scan line */}
          {isScanning && (
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLinePos }] }]} />
          )}
        </View>
        
        {/* Scanning instructions */}
        {!isScanning && !scannedItem && (
          <View style={styles.instructionsContainer}>
            <MaterialCommunityIcons name="barcode-scan" size={60} color="rgba(255,255,255,0.7)" />
            <Text style={styles.instructionsText}>Align medication barcode within the frame</Text>
          </View>
        )}
        
        {/* Scan result */}
        {scannedItem && (
          <View style={styles.resultContainer}>
            <Image source={scannedItem.image} style={styles.medImage} />
            <Text style={styles.medName}>{scannedItem.name}</Text>
            <Text style={styles.medType}>{scannedItem.type}</Text>
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>{scannedItem.match} MATCH</Text>
            </View>
            <Text style={styles.medDetails}>{scannedItem.details}</Text>
          </View>
        )}
      </View>
      
      {/* Control Panel */}
      <View style={styles.controlsContainer}>
        {/* Flash toggle */}
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setFlashOn(!flashOn)}
        >
          <MaterialCommunityIcons 
            name={flashOn ? "flashlight" : "flashlight-off"} 
            size={28} 
            color="#FFF" 
          />
        </TouchableOpacity>
        
        {/* Scan button */}
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={startScanning}
          disabled={isScanning}
        >
          {isScanning ? (
            <View style={styles.scanningIndicator} />
          ) : (
            <MaterialCommunityIcons name="barcode-scan" size={40} color="#FFF" />
          )}
        </TouchableOpacity>
        
        {/* Gallery button */}
        <TouchableOpacity style={styles.controlButton}>
          <MaterialCommunityIcons name="image" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      {/* Bottom info */}
      <View style={styles.bottomInfo}>
        <Text style={styles.infoText}>
          {scannedItem ? 'Scan complete' : 'Point your camera at a medication barcode'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  viewfinder: {
    width: width * 0.8,
    height: height * 0.4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.blue,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 20,
  },
  scanLine: {
    position: 'absolute',
    height: 2,
    width: '100%',
    backgroundColor: COLORS.blue,
  },
  instructionsContainer: {
    position: 'absolute',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  instructionsText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  resultContainer: {
    position: 'absolute',
    bottom: 200,
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  medImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  medName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  medType: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 10,
  },
  matchBadge: {
    backgroundColor: COLORS.blue,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  matchText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  medDetails: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  controlButton: {
    padding: 15,
  },
  scanButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scanningIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFF',
    borderTopColor: COLORS.blue,
    animationKeyframes: {
      '0%': { transform: [{ rotate: '0deg' }] },
      '100%': { transform: [{ rotate: '360deg' }] },
    },
    animationDuration: '1000ms',
    animationIterationCount: 'infinite',
  },
  bottomInfo: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
  },
  infoText: {
    color: '#FFF',
    fontSize: 16,
  },
});