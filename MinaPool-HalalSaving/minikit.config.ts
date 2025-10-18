const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

const accountAssociation = {
  header: "eyJmaWQiOjEzNTU4NjYsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgxNDlBODQxY0M3Mjc2NGUzNDhENDEyOTI2QTI3Rjg0YTRBYWZGOTU0In0",
  payload: "eyJkb21haW4iOiJoYWxhbC1zYXZpbmdzLnZlcmNlbC5hcHAifQ",
  signature: "S6zAX7OdIIoplAq7rLZDMCbo46sqkcztTe92RbSdHTQe3VRD3xOXJTuwcvc3TIsJoSPJ3CGEtJhScw/IPtuqQBw="
}
/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  frame: {
    name: "MinaPool",
    tags: [
      "finance",
      "defi",
      "stacking",
      "sharia",
      "stablecoin"
    ],
    homeUrl: ROOT_URL,
    iconUrl: `${ROOT_URL}/icon.png`,
    ogTitle: "Your Halal Savings on Base",
    tagline: "Halal Savings Onchain",
    version: "1",
    subtitle: "Small steps big journey",
    webhookUrl: `${ROOT_URL}/api/webhook`,
    buttonTitle: "Start Savings",
    description: "With MinaPools, you may develop stablecoins in a transparent, audited, and internationally accessible manner that complies with Sharia law.",
    ogDescription: "Savings your stablecoin without riba",
    splashImageUrl: `${ROOT_URL}/splash.png`,
    primaryCategory: "finance",
    splashBackgroundColor: "#0052FF"
  },
  accountAssociation,
  miniapp: {
    version: "1",
    name: "MinaPool",
    subtitle: "Small steps big journey",
    description: "With MinaPools, you may develop stablecoins in a transparent, audited, and internationally accessible manner that complies with Sharia law.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0052FF",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "finance",
    tags: [
      "finance",
      "defi",
      "stacking",
      "sharia",
      "stablecoin"
    ],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`,
    tagline: "Halal Savings Onchain",
    ogTitle: "Your Halal Savings on Base",
    ogDescription: "Savings your stablecoin without riba",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
    buttonTitle: "Start Savings",
  },
  baseBuilder: {
    allowedAddresses: ["0xf5F917D51418A167f24e141dD080cd2cf4a6C701"],
  },
} as const;