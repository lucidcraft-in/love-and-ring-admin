/**
 * Email Service
 * Handles all email notifications for consultant lifecycle
 * Uses nodemailer with mock transport for development
 */
const nodemailer = require('nodemailer');

// Create transporter based on environment
let transporter;

if (process.env.NODE_ENV === 'production') {
  // Production: Use actual SMTP
  transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT || 587,
    secure: process.env.MAILER_SECURE === 'true',
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
    }
  });
} else {
  // Development: Use mock transport that logs to console
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('\n========== MOCK EMAIL ==========');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Body:', mailOptions.html || mailOptions.text);
      console.log('================================\n');
      return { messageId: `mock-${Date.now()}` };
    }
  };
}

/**
 * Send email wrapper with error handling
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: process.env.MAILER_FROM || '"MatchMate Admin" <noreply@matchmate.com>',
      to,
      subject,
      html,
      text
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Email Templates
 */
const emailTemplates = {
  /**
   * Consultant created notification
   */
  consultantCreated: (consultant, createdByAdmin = true) => ({
    subject: 'Welcome to MatchMate - Account Created',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2663 0%, #9333ea 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #dc2663; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .info-box { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to MatchMate</h1>
          </div>
          <div class="content">
            <p>Dear ${consultant.fullName},</p>
            <p>${createdByAdmin 
              ? 'Your consultant account has been created by the administrator.' 
              : 'Thank you for registering as a consultant on MatchMate.'}</p>
            
            <div class="info-box">
              <p><strong>Username:</strong> ${consultant.username}</p>
              <p><strong>Email:</strong> ${consultant.email}</p>
              <p><strong>Status:</strong> Pending Approval</p>
            </div>
            
            <p>Your account is currently <strong>pending approval</strong>. Our admin team will review your application and you will be notified once your account is approved.</p>
            
            <p>Once approved, you will receive an email with instructions to set your password and access your dashboard.</p>
            
            <p>Best regards,<br>The MatchMate Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} MatchMate. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  /**
   * Consultant approved notification
   */
  consultantApproved: (consultant, setPasswordUrl) => ({
    subject: 'Congratulations! Your MatchMate Account is Approved',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #dc2663; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Account Approved!</h1>
          </div>
          <div class="content">
            <p>Dear ${consultant.fullName},</p>
            <p>Great news! Your MatchMate consultant account has been approved.</p>
            
            <p>To get started, please set your password by clicking the button below:</p>
            
            <p style="text-align: center;">
              <a href="${setPasswordUrl}" class="button">Set Your Password</a>
            </p>
            
            <div class="warning">
              <strong>Important:</strong> This link will expire in 24 hours. If you don't set your password within this time, please contact support for a new link.
            </div>
            
            <p>Once you've set your password, you can log in to your dashboard and start managing member profiles.</p>
            
            <p>Your permissions:</p>
            <ul>
              <li>Create Profiles: ${consultant.permissions?.create_profile ? '✅ Enabled' : '❌ Disabled'}</li>
              <li>Edit Profiles: ${consultant.permissions?.edit_profile ? '✅ Enabled' : '❌ Disabled'}</li>
              <li>View Profiles: ${consultant.permissions?.view_profile ? '✅ Enabled' : '❌ Disabled'}</li>
              <li>Delete Profiles: ${consultant.permissions?.delete_profile ? '✅ Enabled' : '❌ Disabled'}</li>
            </ul>
            
            <p>Best regards,<br>The MatchMate Team</p>
          </div>
          <div class="footer">
            <p>If you didn't request this, please ignore this email.</p>
            <p>© ${new Date().getFullYear()} MatchMate. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  /**
   * Consultant rejected notification
   */
  consultantRejected: (consultant, reason) => ({
    subject: 'MatchMate Account Application Update',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
          .reason-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Update</h1>
          </div>
          <div class="content">
            <p>Dear ${consultant.fullName},</p>
            <p>We regret to inform you that your consultant account application has been declined.</p>
            
            ${reason ? `
            <div class="reason-box">
              <strong>Reason:</strong>
              <p>${reason}</p>
            </div>
            ` : ''}
            
            <p>If you believe this decision was made in error or if you have additional information to provide, please contact our support team.</p>
            
            <p>You may also submit a new application after addressing the concerns mentioned above.</p>
            
            <p>Best regards,<br>The MatchMate Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} MatchMate. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  /**
   * Password set confirmation
   */
  passwordSetConfirmation: (consultant) => ({
    subject: 'Password Set Successfully - MatchMate',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2663 0%, #9333ea 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #dc2663; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Set Successfully</h1>
          </div>
          <div class="content">
            <p>Dear ${consultant.fullName},</p>
            <p>Your password has been set successfully. You can now log in to your MatchMate consultant dashboard.</p>
            
            <p style="text-align: center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/consultant/login" class="button">Login Now</a>
            </p>
            
            <p>If you didn't set this password, please contact our support team immediately.</p>
            
            <p>Best regards,<br>The MatchMate Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} MatchMate. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

/**
 * Send consultant created email
 */
const sendConsultantCreatedEmail = async (consultant, createdByAdmin = true) => {
  const template = emailTemplates.consultantCreated(consultant, createdByAdmin);
  return sendEmail({
    to: consultant.email,
    subject: template.subject,
    html: template.html
  });
};

/**
 * Send consultant approved email
 */
const sendConsultantApprovedEmail = async (consultant, resetToken) => {
  const setPasswordUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/consultant/set-password?token=${resetToken}`;
  const template = emailTemplates.consultantApproved(consultant, setPasswordUrl);
  return sendEmail({
    to: consultant.email,
    subject: template.subject,
    html: template.html
  });
};

/**
 * Send consultant rejected email
 */
const sendConsultantRejectedEmail = async (consultant, reason) => {
  const template = emailTemplates.consultantRejected(consultant, reason);
  return sendEmail({
    to: consultant.email,
    subject: template.subject,
    html: template.html
  });
};

/**
 * Send password set confirmation email
 */
const sendPasswordSetConfirmationEmail = async (consultant) => {
  const template = emailTemplates.passwordSetConfirmation(consultant);
  return sendEmail({
    to: consultant.email,
    subject: template.subject,
    html: template.html
  });
};

module.exports = {
  sendEmail,
  sendConsultantCreatedEmail,
  sendConsultantApprovedEmail,
  sendConsultantRejectedEmail,
  sendPasswordSetConfirmationEmail
};
