import { Request, Response } from 'express';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { User } from '../models/model.user';

export class WebhookController {
  /**
   * Handle Clerk webhook events
   */
  static async handleClerkWebhook(req: Request, res: Response) {
    try {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

      if (!WEBHOOK_SECRET) {
        console.error('CLERK_WEBHOOK_SECRET is not set');
        return res.status(500).json({ error: 'Webhook secret not configured' });
      }

      // Get the headers
      const svixId = req.headers['svix-id'] as string;
      const svixTimestamp = req.headers['svix-timestamp'] as string;
      const svixSignature = req.headers['svix-signature'] as string;

      // If there are no headers, error out
      if (!svixId || !svixTimestamp || !svixSignature) {
        return res.status(400).json({ error: 'Missing svix headers' });
      }

      // Get the body
      const body = JSON.stringify(req.body);

      // Create a new Svix instance with your secret.
      const wh = new Webhook(WEBHOOK_SECRET);

      let evt: WebhookEvent;

      // Verify the payload with the headers
      try {
        evt = wh.verify(body, {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        }) as WebhookEvent;
      } catch (err) {
        console.error('Error verifying webhook:', err);
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }

      // Handle the webhook
      const eventType = evt.type;
      console.log(`Received webhook event: ${eventType}`);

      switch (eventType) {
        case 'user.created':
          await this.handleUserCreated(evt.data);
          break;
        case 'user.updated':
          await this.handleUserUpdated(evt.data);
          break;
        case 'user.deleted':
          await this.handleUserDeleted(evt.data);
          break;
        default:
          console.log(`Unhandled webhook event type: ${eventType}`);
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Handle user.created event
   */
  private static async handleUserCreated(userData: any) {
    try {
      const { id, email_addresses: emailAddresses, first_name: firstName, last_name: lastName } = userData;

      // Get the primary email
      const primaryEmail = emailAddresses.find((email: any) => email.id === userData.primary_email_address_id);

      if (!primaryEmail) {
        console.error('No primary email found for user:', id);
        return;
      }

      // Check if user already exists by Clerk ID or email
      const existingUser = await User.findOne({
        $or: [{ clerkId: id }, { email: primaryEmail.email_address }],
      });

      if (existingUser) {
        console.log('User already exists:', primaryEmail.email_address);
        // Update clerkId if missing
        if (!existingUser.clerkId) {
          existingUser.clerkId = id;
          await existingUser.save();
        }
        return;
      }

      // Create new user in database
      const newUser = new User({
        clerkId: id,
        email: primaryEmail.email_address,
        username: firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : undefined,
        role: 'USER',
        password: 'clerk_user', // Placeholder password since Clerk handles auth
      });

      await newUser.save();
      console.log('User created in database:', primaryEmail.email_address);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  /**
   * Handle user.updated event
   */
  private static async handleUserUpdated(userData: any) {
    try {
      const { id, email_addresses: emailAddresses, first_name: firstName, last_name: lastName } = userData;

      // Get the primary email
      const primaryEmail = emailAddresses.find((email: any) => email.id === userData.primary_email_address_id);

      if (!primaryEmail) {
        console.error('No primary email found for user:', id);
        return;
      }

      // Find user by Clerk ID or email
      const user = await User.findOne({
        $or: [{ clerkId: id }, { email: primaryEmail.email_address }],
      });

      if (!user) {
        console.log('User not found for update:', primaryEmail.email_address);
        return;
      }

      // Update user fields
      user.clerkId = id; // Ensure clerkId is set
      user.username = firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : user.username;
      await user.save();

      console.log('User updated in database:', primaryEmail.email_address);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  /**
   * Handle user.deleted event
   */
  private static async handleUserDeleted(userData: any) {
    try {
      const { id } = userData;

      // Find user by Clerk ID (we might need to store this separately)
      // For now, we'll skip deletion to preserve booking history
      console.log('User deleted from Clerk:', id);
      console.log('Note: User data preserved in database for booking history');
    } catch (error) {
      console.error('Error handling user deletion:', error);
    }
  }
}
