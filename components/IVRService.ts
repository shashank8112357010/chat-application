import { Platform, Linking } from 'react-native';

export interface CallOptions {
  phoneNumber: string;
  displayName?: string;
  callType?: 'voice' | 'video';
}

export interface IVRMenuOption {
  key: string;
  label: string;
  action: () => void;
}

export class IVRService {
  private static baseIVRNumber = '+1234567890'; // Replace with your IVR system number
  private static apiEndpoint = 'https://your-ivr-api.com'; // Replace with your IVR API

  // Make a direct call
  static async makeCall(options: CallOptions): Promise<boolean> {
    try {
      const phoneUrl = Platform.select({
        ios: `tel:${options.phoneNumber}`,
        android: `tel:${options.phoneNumber}`,
        web: `tel:${options.phoneNumber}`,
      });

      if (phoneUrl) {
        const canOpen = await Linking.canOpenURL(phoneUrl);
        if (canOpen) {
          await Linking.openURL(phoneUrl);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to make call:', error);
      return false;
    }
  }

  // Initiate IVR call with menu options
  static async initiateIVRCall(
    targetNumber: string,
    callerName: string,
    menuOptions: IVRMenuOption[]
  ): Promise<boolean> {
    try {
      // For web platform, we'll simulate IVR with a web interface
      if (Platform.OS === 'web') {
        return this.simulateWebIVR(targetNumber, callerName, menuOptions);
      }

      // For mobile platforms, integrate with actual IVR system
      const ivrData = {
        targetNumber,
        callerName,
        menuOptions: menuOptions.map(option => ({
          key: option.key,
          label: option.label,
        })),
        timestamp: new Date().toISOString(),
      };

      // Send request to IVR system
      const response = await fetch(`${this.apiEndpoint}/initiate-call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ivrData),
      });

      if (response.ok) {
        const result = await response.json();
        // Make the actual call to IVR system
        return this.makeCall({ phoneNumber: this.baseIVRNumber });
      }

      return false;
    } catch (error) {
      console.error('Failed to initiate IVR call:', error);
      return false;
    }
  }

  // Simulate IVR for web platform
  private static async simulateWebIVR(
    targetNumber: string,
    callerName: string,
    menuOptions: IVRMenuOption[]
  ): Promise<boolean> {
    return new Promise((resolve) => {
      // Create a modal-like interface for web IVR simulation
      const ivrModal = document.createElement('div');
      ivrModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: Arial, sans-serif;
      `;

      const ivrContent = document.createElement('div');
      ivrContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        text-align: center;
      `;

      ivrContent.innerHTML = `
        <div style="background: #E53E3E; color: white; padding: 20px; margin: -30px -30px 20px -30px; border-radius: 12px 12px 0 0;">
          <h2 style="margin: 0;">IVR Call System</h2>
        </div>
        <p><strong>Calling:</strong> ${targetNumber}</p>
        <p><strong>From:</strong> ${callerName}</p>
        <div style="margin: 20px 0;">
          <p><strong>Select an option:</strong></p>
          ${menuOptions.map((option, index) => `
            <button 
              onclick="window.ivrSelectOption('${option.key}')"
              style="
                display: block;
                width: 100%;
                padding: 12px;
                margin: 8px 0;
                background: #f0f0f0;
                border: 1px solid #ddd;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
              "
              onmouseover="this.style.background='#E53E3E'; this.style.color='white';"
              onmouseout="this.style.background='#f0f0f0'; this.style.color='black';"
            >
              ${index + 1}. ${option.label}
            </button>
          `).join('')}
        </div>
        <button 
          onclick="window.ivrClose()"
          style="
            background: #666;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 10px;
          "
        >
          Cancel Call
        </button>
      `;

      // Add event handlers
      (window as any).ivrSelectOption = (key: string) => {
        const selectedOption = menuOptions.find(option => option.key === key);
        if (selectedOption) {
          selectedOption.action();
        }
        document.body.removeChild(ivrModal);
        delete (window as any).ivrSelectOption;
        delete (window as any).ivrClose;
        resolve(true);
      };

      (window as any).ivrClose = () => {
        document.body.removeChild(ivrModal);
        delete (window as any).ivrSelectOption;
        delete (window as any).ivrClose;
        resolve(false);
      };

      ivrModal.appendChild(ivrContent);
      document.body.appendChild(ivrModal);
    });
  }

  // Create standard IVR menu for BomPapo
  static createBomPapoIVRMenu(
    onChat: () => void,
    onVoiceCall: () => void,
    onVideoCall: () => void,
    onLeaveMessage: () => void
  ): IVRMenuOption[] {
    return [
      {
        key: '1',
        label: 'Start Text Chat',
        action: onChat,
      },
      {
        key: '2',
        label: 'Voice Call',
        action: onVoiceCall,
      },
      {
        key: '3',
        label: 'Video Call',
        action: onVideoCall,
      },
      {
        key: '4',
        label: 'Leave Voice Message',
        action: onLeaveMessage,
      },
    ];
  }

  // Check if calling is available on the device
  static async isCallAvailable(): Promise<boolean> {
    try {
      const phoneUrl = Platform.select({
        ios: 'tel:',
        android: 'tel:',
        web: 'tel:',
      });

      if (phoneUrl) {
        return await Linking.canOpenURL(phoneUrl);
      }
      return false;
    } catch (error) {
      console.error('Error checking call availability:', error);
      return false;
    }
  }

  // Format phone number for display
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format based on length
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    return phoneNumber; // Return original if can't format
  }
}