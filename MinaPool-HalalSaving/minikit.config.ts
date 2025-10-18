const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  "frame": {
    "name": "MinaPool",
    "version": "1",
    "iconUrl": "https://halal-savings.vercel.app/icon.png",
    "homeUrl": "https://halal-savings.vercel.app",
    "imageUrl": "https://halal-savings.vercel.app/image.png",
    "buttonTitle": "Start Saving",
    "splashImageUrl": "https://halal-savings.vercel.app/splash.png",
    "splashBackgroundColor": "#0052FF",
    "webhookUrl": "https://halal-savings.vercel.app/api/webhook",
    "subtitle": "Small steps big journey",
    "description": "With MinaPools, you may develop stablecoins in a transparent, audited, and internationally accessible manner that complies with Sharia law.",
    "primaryCategory": "finance",
    "tags": [
      "finance",
      "defi",
      "stacking",
      "sharia",
      "stablecoin"
    ],
    "tagline": "Small Steps Big Journey",
    "ogTitle": "MinaPools - Your Halal Savings",
    "ogDescription": "Save your stablecoin without riba"
  },
  "accountAssociation": {
    "header": "eyJmaWQiOjEzNTU4NjYsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgxNDlBODQxY0M3Mjc2NGUzNDhENDEyOTI2QTI3Rjg0YTRBYWZGOTU0In0",
    "payload": "eyJkb21haW4iOiJoYWxhbC1zYXZpbmdzLnZlcmNlbC5hcHAifQ",
    "signature": "S6zAX7OdIIoplAq7rLZDMCbo46sqkcztTe92RbSdHTQe3VRD3xOXJTuwcvc3TIsJoSPJ3CGEtJhScw/IPtuqQBw="
  },
  "miniapp": {
    "version": "1",
    "name": "MinaPool",
    "subtitle": "Small steps big journey",
    "description": "With MinaPools, you may develop stablecoins in a transparent, audited, and internationally accessible manner that complies with Sharia law.",
    "screenshotUrls": ["https://halal-savings.vercel.app/screenshot-portrait.png"],
    "iconUrl": "https://halal-savings.vercel.app/icon.png",
    "splashImageUrl": "https://halal-savings.vercel.app/splash.png",
    "splashBackgroundColor": "#0052FF",
    "homeUrl": "https://halal-savings.vercel.app",
    "webhookUrl": "https://halal-savings.vercel.app/api/webhook",
    "primaryCategory": "finance",
    "tags": [
      "finance",
      "defi",
      "stacking",
      "sharia",
      "stablecoin"
    ],
    "heroImageUrl": "https://halal-savings.vercel.app/blue-hero.png",
    "tagline": "Halal Savings Onchain",
    "ogTitle": "Your Halal Savings on Base",
    "ogDescription": "Savings your stablecoin without riba",
    "ogImageUrl": "https://halal-savings.vercel.app/blue-hero.png",
    "buttonTitle": "Start Savings",
  },
  baseBuilder: {
    allowedAddresses: ["0xf5F917D51418A167f24e141dD080cd2cf4a6C701"],
  },
} as const;