export const GOOGLE_WEB_CLIENT_ID =
  '37588438028-du0vj0shhbf7vj0tu393gt6lo12opf3k.apps.googleusercontent.com';

// Filled after iOS OAuth client exists in Google Cloud (bundle com.greatta1998.zenmessage).
export const GOOGLE_IOS_CLIENT_ID = process.env.GOOGLE_IOS_CLIENT_ID || '';

export function googleIosUrlScheme(iosClientId = GOOGLE_IOS_CLIENT_ID) {
  const match = iosClientId.match(/^(\d+)-([^.]+)\.apps\.googleusercontent\.com$/);
  if (!match) return null;
  return `com.googleusercontent.apps.${match[1]}-${match[2]}`;
}
