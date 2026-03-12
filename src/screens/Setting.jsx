import React, { useState } from 'react';
import { View, Button, Alert, Text, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import SendIntentAndroid from 'react-native-send-intent';

const Setting = () => {
  const [useBusiness, setUseBusiness] = useState(true); // default Business selected
  const message = "Hello, Thank you for showing interest.";
  const number = "9761407482";
  // Copy message to clipboard
  const copyMessage = () => Clipboard.setString(message);

  const handleOpenWhatsapp = () => {
    copyMessage();
    const phone = "91" + number.replace(/[^0-9]/g, "");
    const uri = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
    const packageName = useBusiness ? "com.whatsapp.w4b" : "com.whatsapp";

    // Check if selected app installed
    SendIntentAndroid.isAppInstalled(packageName)
      .then((isInstalled) => {
        if (!isInstalled) {
          Alert.alert(
            "App not installed",
            `${useBusiness ? "WhatsApp Business" : "WhatsApp"} is not installed on this device.`
          );
          return;
        }

        SendIntentAndroid.openAppWithUri(uri, { packageName })
          .then(() => console.log("WhatsApp opened"))
          .catch(() => Alert.alert("Error", "Cannot open WhatsApp"));
      })
      .catch(() => Alert.alert("Error", "Cannot check app installation"));
  };

  return (
    <View style={{ margin: 20 }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Choose WhatsApp App:</Text>

      {/* Toggle Buttons */}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: useBusiness ? '#25D366' : '#DDD',
            marginRight: 5,
            alignItems: 'center',
            borderRadius: 5,
          }}
          onPress={() => setUseBusiness(true)}
        >
          <Text style={{ color: useBusiness ? '#FFF' : '#000' }}>Business WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: !useBusiness ? '#25D366' : '#DDD',
            marginLeft: 5,
            alignItems: 'center',
            borderRadius: 5,
          }}
          onPress={() => setUseBusiness(false)}
        >
          <Text style={{ color: !useBusiness ? '#FFF' : '#000' }}>Personal WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* Open Button */}
      <Button title="Open Selected WhatsApp" onPress={handleOpenWhatsapp} />
    </View>
  );
};

export default Setting;