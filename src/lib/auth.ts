import type { NextAuthOptions } from "next-auth"
import Discord from "next-auth/providers/discord"

function parseAllowedIds(raw: string | undefined): Set<string> {
  if (!raw) return new Set()
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  )
}

const ALLOWED_IDS = parseAllowedIds(process.env.DISCORD_ALLOWED_IDS)

export const authOptions: NextAuthOptions = {
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify email" } },
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    /**
     * ✅ Bloque la connexion si l'ID Discord n'est pas autorisé
     * (signIn est le meilleur endroit pour refuser proprement)
     */
    async signIn({ account, profile }) {
      if (account?.provider !== "discord") return false

      const p = profile as any
      const discordId =
        (p?.id as string | undefined) ||
        (account?.providerAccountId as string | undefined)

      if (!discordId) return false

      // si DISCORD_ALLOWED_IDS est vide -> on bloque tout (sécurité)
      if (ALLOWED_IDS.size === 0) return false

      return ALLOWED_IDS.has(discordId)
    },

    async jwt({ token, account, profile }) {
      // stocke discordId
      if (account?.provider === "discord") {
        ;(token as any).discordId = account.providerAccountId
      }

      // image discord
      const p = profile as any
      if (p?.image) token.picture = p.image
      if (p?.avatar && p?.id) {
        token.picture = `https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png?size=256`
      }

      // flag autorisation (utile côté UI)
      const discordId = (token as any).discordId as string | undefined
      ;(token as any).isAllowed = !!discordId && ALLOWED_IDS.has(discordId)

      return token
    },

    async session({ session, token }) {
      ;(session.user as any).discordId = (token as any).discordId
      ;(session.user as any).isAllowed = (token as any).isAllowed

      // force l'image dans la session
      if (session.user) {
        session.user.image = (token.picture as string) ?? session.user.image
      }

      return session
    },
  },
}
