const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

const accountAssociation = {
  header: process.env.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_HEADER,
  payload: process.env.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_PAYLOAD,
  signature: process.env.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_SIGNATURE,
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
    splashBackgroundColor: "#0052FF",
    name: "MinaPool",
    heroImageUrl: `${ROOT_URL}/blue-hero.png`, 
  },
  baseBuilder: {
    allowedAddresses: ["0xf5F917D51418A167f24e141dD080cd2cf4a6C701"],
  },
} as const;