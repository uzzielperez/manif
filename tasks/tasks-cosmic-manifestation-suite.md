# Tasks - Cosmic Manifestation Suite

## Relevant Files

- `src/components/ThemeSelector.tsx` - Component for users to pick their cosmic design theme.
- `src/components/TimelineGraph.tsx` - Interactive node graph visualizer using a library like React Flow.
- `src/components/ChatInterface.tsx` - Chatbot UI for modifying timelines.
- `src/components/MeditationGallery.tsx` - Audio library and daily featured meditation component.
- `src/components/EnterpriseDashboard.tsx` - Admin view for startup founders/HR.
- `src/pages/Blog.tsx` - Blog section and entry layout.
- `src/styles/themes/cosmic.ts` - Theme definitions for the cosmic looks.
- `src/api/timeline.ts` - API logic for AI-generated timeline data.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npm test` or `npx jest [optional/path/to/test/file]` to run tests.

## Phase & Timeline Estimates
- **Phase 1: Foundation & UI (Days 1-3):** Themes, Layout, and Blog.
- **Phase 2: Core Interaction (Days 4-7):** Timeline Chat and Graph Visualization.
- **Phase 3: Content & Enterprise (Days 8-10):** Meditation Gallery and Startup Dashboard.

## Progress Log
| Date | Task | Status | Notes |
|------|------|--------|-------|
| 2026-01-02 | Project Kickoff | Completed | Initializing PRD and Task List |
| 2026-01-02 | Cosmic UI | Completed | Implemented 3 themes and selector |
| 2026-01-02 | Timeline & Gallery | Completed | Built interactive graph and meditation library |
| 2026-01-02 | Enterprise & Blog | Completed | Launched startup dashboard and educational blog |
| 2026-01-02 | UI Refinement | Completed | Redesigned for premium/classy aesthetic |
| 2026-01-03 | Paywall & Monetization | Completed | 3-use limit and access code unlock for Chat |
| 2026-01-03 | Starfleet Enterprise | Completed | Mission Directives and Star Trek branding |
| 2026-01-03 | Production Fixes | Completed | Deployed Timeline as Netlify Function |
| 2026-01-03 | Hybrid Logic | Completed | AI now generates 3 distinct parallel paths |
| 2026-01-03 | Influencer System | Completed | Unique code mapping and attribution tracking |
| 2026-01-03 | Chat Debugging | In Progress | Refined component structure and JSON parsing |
| 2026-01-07 | Meditation Automation | Completed | Built batch script with Groq+ElevenLabs integration for hands-free generation |
| 2026-01-07 | Free Meditations Live | Completed | Generated all 7 meditations with Jameson voice, integrated audio playback on site |
| 2026-01-07 | Contributor System PRD | Completed | Designed multi-tier contributor/stakeholder system with Web3 integration |
| 2026-01-11 | Meditation visualizer polish & GA instrumentation | Completed | Removed human silhouette, aligned all visualizers, and added GA event tracking across meditations and timelines |
| 2026-02-03 | 7.2 Referral tracking | Completed | Program page sends referral_code + eventType to track-referral; shared/influencers.ts for server-side code lookup; track-referral resolves code → influencerId and inserts into influencer_events |
| 2026-02-03 | Referral code vs dashboard password | Completed | influencer-auth: partners log in with code + private dashboard password; passwords from env (INFLUENCER_DASHBOARD_PASSWORDS) or DB; code is public (links/checkout), password is private |
| 2026-02-03 | Admin UI: add influencers + set password | Completed | Admin → Influencers tab: add influencer (name, code, commission %, payout, dashboard password) and set password for existing; data stored in DB only (influencers + influencer_dashboard_passwords, bcrypt); nothing sensitive in repo |
| 2026-02-03 | DB-backed influencers | Completed | shared/schema: influencers + influencer_dashboard_passwords tables; db-setup creates tables and seeds 4 influencers; influencer-auth and track-referral read from DB first (env fallback); netlify/functions/admin-influencers (GET list, POST create, PATCH set password) |
| 2026-02-03 | Temporal Architect (8.0) | Completed | Timeline function: Content-Type application/json, strip markdown from LLM output, parse and return valid { nodes, edges }; Timelines.tsx: robust parse (string/object), validate nodes/edges arrays, safe pathId/index, graphKey for React Flow sync; loading overlay and clear error when no nodes |

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch `feature/cosmic-manifestation-suite`
- [x] 1.0 Implement Cosmic UI & Theme Selection
  - [x] 1.1 Define CSS variables/theme objects for "Deep Space", "Nebula Glow", and "Stellar Dawn"
  - [x] 1.2 Implement a ThemeProvider and global styles for glassmorphism and neon accents
  - [x] 1.3 Create `ThemeSelector.tsx` with previews of each theme
  - [x] 1.4 Integrate animated cosmic backgrounds into the main layout
- [x] 2.0 Build Interactive Timeline Chat & Graph Visualizer
  - [x] 2.1 Integrate React Flow for the branching node graph visualization
  - [x] 2.2 Develop `ChatInterface.tsx` with support for streaming responses
  - [x] 2.3 Implement the prompt engineering to convert chat commands into graph nodes/edges
  - [x] 2.4 Add functionality to save and export timeline visualizations
- [x] 3.0 Create Meditation Gallery & Daily Feature
  - [x] 3.1 Implement `MeditationGallery.tsx` with category filtering
  - [x] 3.2 Create the "Daily Cosmic Meditation" spotlight component for the home page
  - [x] 3.3 Build a themed audio player with a cosmic visualizer (e.g., canvas-based)
- [x] 4.0 Develop Enterprise Startup Dashboard & Priority Logic
  - [x] 4.1 Create `EnterpriseDashboard.tsx` with aggregate wellness/alignment charts
  - [x] 4.2 Implement role-based access control (RBAC) for the Admin view
  - [x] 4.3 Add backend logic for priority AI processing and unlimited saves for Enterprise IDs
- [x] 5.0 Implement Blog Section & "Manifestation" Entry
  - [x] 5.1 Set up the blog routing and dynamic post rendering
  - [x] 5.2 Add the first post: "What It Means to Manifest: A Guide to Cosmic Alignment"
  - [x] 5.3 Ensure responsive and themed typography for long-form reading
- [x] 6.0 Expand Temporal Architect for Hybrid Goal Logic
  - [x] 6.1 Update AI prompt to specifically generate 3 distinct "Hybrid Paths" (e.g., Conservative, Balanced, Aggressive)
  - [x] 6.2 Refactor Graph UI to color-code and separate these 3 paths visually
  - [x] 6.3 Implement a "Toggle Path" UI to focus on specific hybrid trajectories
- [x] 7.0 Multi-Influencer Referral & Payout System
  - [x] 7.1 Create an `influencers.ts` config to map unique codes (e.g., MAGIC25M, STARS10) to specific profiles
  - [x] 7.2 Implement tracking logic to attribute unlocks/payments to specific influencer IDs
  - [ ] 7.3 Build a simple "Influencer Payout" report logic based on conversion percentage
- [x] 8.0 Debug & Stabilize Temporal Architect Chat
  - [x] 8.1 Investigation: Confirm why nodes are not manifesting in production despite successful API response
  - [x] 8.2 Fix: Refine React Flow state synchronization between Chat and Graph
  - [x] 8.3 Optimization: Add loading skeletons and retry logic for slow AI responses
- [ ] 9.0 Enhance Landing Page with Deep Scroll Content
  - [ ] 9.1 Implement "Editorial Preview" section for recent blog posts
  - [ ] 9.2 Create "Meditation of the Month" spotlight with quick-play access
  - [ ] 9.3 Add "Partnership & Ecosystem" section detailing influencer benefits and fleet command
  - [ ] 9.4 Refine landing page scroll animations and snapping for a premium feel
- [x] 10.0 Populate Free Meditations Library
  - [x] 10.1 Create/source meditation audio files or scripts for AI generation
  - [x] 10.2 Define meditation metadata (title, description, duration, category, tags)
  - [x] 10.3 Add meditation data to database or static data files
  - [x] 10.4 Verify audio playback and download functionality for all meditations
  - [x] 10.5 Ensure proper categorization and filtering in the Meditation Gallery
- [ ] 11.0 Build Contributor & Stakeholder System (Phase 1 - MVP)
  - [ ] 11.1 Create contribution submission form (meditation scripts + feature ideas)
  - [ ] 11.2 Build contributions database schema and API endpoints
  - [ ] 11.3 Implement basic upvoting system (no tiers yet)
  - [ ] 11.4 Create founder review queue/dashboard
  - [ ] 11.5 Build point tracking system (award but don't redeem yet)
  - [ ] 11.6 Add contribution gallery page with filtering
- [ ] 12.0 Marketing & Influencer Strategy for Launch
  - [ ] 12.1 Define target personas for early adopters
  - [ ] 12.2 Create influencer outreach templates and value prop
  - [ ] 12.3 Plan "First 100 Users" reward/incentive program
- [ ] 13.0 Implement Meditation Visualizations (Canvas-based)
  - [ ] 13.1 Create "Pulsing Aura" visualization for general meditations
  - [ ] 13.2 Implement "Loving Kindness Meditator" outline animation
  - [ ] 13.3 Build "Chakra Ladder" (7 pulsing dots) visualization
  - [ ] 13.4 Integrate canvas visualizers with audio playback state
- [ ] 14.0 Enhance Meditation Audio Controls
  - [ ] 14.1 Add Pause/Resume functionality to meditation player
  - [ ] 14.2 Implement progress bar/timer for active sessions

## Nice-to-have

- **3. Optional later: Stripe Connect** – If you want automatic splits (part of each sale going to the influencer’s Stripe account), add [Stripe Connect](https://stripe.com/connect) (e.g. Express or Custom accounts), onboarding, and possibly tax (e.g. 1099). Not implemented in this codebase.
