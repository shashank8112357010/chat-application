import { Platform } from 'react-native';
import { EmailService } from './EmailService';

export interface NotificationOptions {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  badge?: number;
}

export class NotificationService {
  // Send email notification
  static async sendEmailNotification(
    userEmail: string,
    type: 'message' | 'call' | 'match' | 'system',
    data: any
  ): Promise<boolean> {
    const templates = {
      message: {
        subject: 'New Message on BomPapo',
        body: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #E53E3E; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0;">💬 New Message</h1>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                  <p>You have received a new message from <strong>${data.senderName}</strong>!</p>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #E53E3E;">
                    <p style="margin: 0; font-style: italic;">"${data.messagePreview}"</p>
                  </div>
                  
                  <p>Open BomPapo to read the full message and reply.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      },
      call: {
        subject: 'Missed Call on BomPapo',
        body: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #E53E3E; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0;">📞 Missed Call</h1>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                  <p>You missed a call from <strong>${data.callerName}</strong>!</p>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <p><strong>Call Time:</strong> ${data.callTime}</p>
                    <p><strong>Duration:</strong> ${data.duration || 'Not answered'}</p>
                  </div>
                  
                  <p>Open BomPapo to call them back or send a message.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      },
      match: {
        subject: 'New Match on BomPapo! 🎉',
        body: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #E53E3E; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0;">🎉 It's a Match!</h1>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                  <p>Great news! You have a new match with <strong>${data.matchName}</strong>!</p>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <p><strong>Match Score:</strong> ${data.matchScore}% compatibility</p>
                    <p><strong>Common Interests:</strong> ${data.commonInterests?.join(', ')}</p>
                  </div>
                  
                  <p>Start a conversation and get to know each other better!</p>
                </div>
              </div>
            </body>
          </html>
        `,
      },
      system: {
        subject: data.subject || 'BomPapo Notification',
        body: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #E53E3E; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0;">BomPapo</h1>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                  ${data.htmlContent || `<p>${data.message}</p>`}
                </div>
              </div>
            </body>
          </html>
        `,
      },
    };

    const template = templates[type];
    if (!template) {
      return false;
    }

    return EmailService.sendEmail({
      recipients: [userEmail],
      subject: template.subject,
      body: template.body,
      isHtml: true,
    });
  }

  // Send push notification (for mobile platforms)
  static async sendPushNotification(options: NotificationOptions): Promise<boolean> {
    if (Platform.OS === 'web') {
      // For web, show browser notification
      return this.showWebNotification(options);
    }

    // For mobile platforms, you would integrate with Expo Notifications
    // This is a placeholder for the actual implementation
    console.log('Push notification would be sent:', options);
    return true;
  }

  // Show web notification
  private static async showWebNotification(options: NotificationOptions): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      new Notification(options.title, {
        body: options.body,
        icon: '/assets/images/icon.png',
        badge: '/assets/images/icon.png',
      });
      return true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(options.title, {
          body: options.body,
          icon: '/assets/images/icon.png',
          badge: '/assets/images/icon.png',
        });
        return true;
      }
    }

    return false;
  }

  // Request notification permissions
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    }

    // For mobile platforms, integrate with Expo Notifications
    return true;
  }
}