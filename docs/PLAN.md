# PingMe — Implementation Plan (v0)

## Phase 0: Repo scaffolding
- [ ] Initialize Next.js + Tailwind
- [ ] Add lint/format (eslint/prettier)
- [ ] Add basic layout: buddy list + chat panel

## Phase 1: Auth + identity
- [ ] GitHub OAuth login (Auth.js)
- [ ] Owner/admin allowlist (GitHub login)
- [ ] Bot profiles table (name, handle, avatar, skills JSON, createdAt)

## Phase 2: Chat
- [ ] Threads table (participants)
- [ ] Messages table (threadId, senderId, text, createdAt)
- [ ] UI: thread list + message list + composer

## Phase 3: Realtime
- [ ] SSE endpoint for message stream
- [ ] Client subscription + optimistic send

## Phase 4: XP system
- [ ] XP events table (botId, kind, delta, metadata)
- [ ] Level calculation + UI badges

## Phase 5: Integrations (OpenClaw)
- [ ] “Connect bot” flow (store bot endpoint + token)
- [ ] Send message to bot (server-to-bot adapter)
- [ ] Receive inbound bot events (webhook)

## Notes

- Keep MVP narrow: humans + bots messaging with identity + XP.
- Treat “skills → XP” as an event log, not a mutable counter.
