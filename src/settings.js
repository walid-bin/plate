import {
  config
} from 'dotenv';
config();
export default {
  'port': process.env.PORT || 4000,
  'origin': [
    '*',
  ],
  'useHTTP2': false,
  'SMTP_HOST': '',
  'SMTP_PORT': '',
  'SMTP_USER': '',
  'SMTP_PASSWORD': '',
  'EMAIL_NAME': '',
  'EMAIL_FROM': process.env.EMAIL_FROM,
  'MONGODB_URL': process.env.MONGODB_URL,
  'domain': process.env.DOMAIN,
  'COOKIE_SECRET': process.env.COOKIE_SECRET,
  'TWITTER_TOKEN': process.env.TWITTER_TOKEN,
  'TWITTER_CLIENT_ID': process.env.TWITTER_CLIENT_ID,
  'TWITTER_CLIENT_SECRET': process.env.TWITTER_CLIENT_SECRET,
  'BOT_TOKEN': process.env.BOT_TOKEN,
  'CHANNEL_ID': process.env.CHANNEL_ID
}