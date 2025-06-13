import * as MailComposer from 'expo-mail-composer';
import { Platform } from 'react-native';

export interface EmailOptions {
  recipients?: string[];
  subject?: string;
  body?: string;
  isHtml?: boolean;
  attachments?: string[];
}

export class EmailService {
  static async isAvailable(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return true; // Web can always open mailto links
    }
    return await MailComposer.isAvailableAsync();
  }

  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // For web, use mailto link
        const mailtoUrl = this.createMailtoUrl(options);
        window.open(mailtoUrl, '_blank');
        return true;
      }

      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        throw new Error('Email service is not available on this device');
      }

      const result = await MailComposer.composeAsync({
        recipients: options.recipients,
        subject: options.subject,
        body: options.body,
        isHtml: options.isHtml || false,
        attachments: options.attachments,
      });

      return result.status === MailComposer.MailComposerStatus.SENT;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  private static createMailtoUrl(options: EmailOptions): string {
    const params = new URLSearchParams();
    
    if (options.subject) {
      params.append('subject', options.subject);
    }
    
    if (options.body) {
      params.append('body', options.body);
    }

    const recipients = options.recipients?.join(',') || '';
    const paramString = params.toString();
    
    return `mailto:${recipients}${paramString ? '?' + paramString : ''}`;
  }

  // Send welcome email to new users
  static async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    return this.sendEmail({
      recipients: [userEmail],
      subject: 'Welcome to BomPapo!',
      body: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #E53E3E; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0;">Welcome to BomPapo!</h1>
              </div>
              
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                <h2 style="color: #E53E3E;">Hello ${userName}!</h2>
                
                <p>Thank you for joining BomPapo, the premier platform for connecting with new friends and finding meaningful relationships.</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #E53E3E; margin-top: 0;">What you can do with BomPapo:</h3>
                  <ul style="padding-left: 20px;">
                    <li>🔍 <strong>Discover</strong> - Find new friends based on your interests, location, and preferences</li>
                    <li>💬 <strong>Chat</strong> - Send messages and connect with people you like</li>
                    <li>📞 <strong>Call</strong> - Make voice calls to build deeper connections</li>
                    <li>❤️ <strong>Favorites</strong> - Keep track of your favorite connections</li>
                  </ul>
                </div>
                
                <div style="background: #E53E3E; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Your account is now active and ready to use!</strong></p>
                </div>
                
                <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                
                <p style="margin-top: 30px;">
                  Best regards,<br>
                  <strong>The BomPapo Team</strong>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      isHtml: true,
    });
  }

  // Send verification email
  static async sendVerificationEmail(userEmail: string, verificationCode: string): Promise<boolean> {
    return this.sendEmail({
      recipients: [userEmail],
      subject: 'BomPapo - Email Verification',
      body: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #E53E3E; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0;">Email Verification</h1>
              </div>
              
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                <p>Please verify your email address to complete your BomPapo registration.</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                  <h2 style="color: #E53E3E; margin: 0;">Verification Code</h2>
                  <div style="font-size: 32px; font-weight: bold; color: #E53E3E; letter-spacing: 8px; margin: 20px 0;">
                    ${verificationCode}
                  </div>
                </div>
                
                <p>Enter this code in the BomPapo app to verify your email address.</p>
                <p><small>This code will expire in 10 minutes for security reasons.</small></p>
              </div>
            </div>
          </body>
        </html>
      `,
      isHtml: true,
    });
  }
}