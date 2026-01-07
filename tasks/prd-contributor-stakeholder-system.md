# Product Requirements Document: Contributor & Stakeholder System

## Introduction/Overview

The Contributor & Stakeholder System transforms passive users into active co-creators and investors in the Cosmic Manifestation Suite. Contributors can submit ideas across multiple categories, earn rewards through a multi-tiered system, and potentially become equity stakeholders through significant investment. This creates a self-sustaining ecosystem where the community shapes the platform's evolution.

## Goals

1. **Community Engagement**: Enable users to actively contribute to platform development
2. **Quality Content Pipeline**: Generate high-quality meditation scripts, voice samples, and feature ideas
3. **Democratic Innovation**: Allow community voting while maintaining founder control
4. **Sustainable Rewards**: Create multiple reward pathways (credits → revenue share → equity)
5. **Long-term Alignment**: Convert contributors into stakeholders who benefit from platform success
6. **Web3 Integration**: Prepare for NFT-based contribution tracking and tokenized rewards

## User Stories

### Contributor Journey
- **As a user**, I want to submit meditation script ideas so I can see my creativity come to life and earn rewards
- **As a voice artist**, I want to submit voice samples so I can become an official meditation narrator and earn revenue share
- **As a developer**, I want to suggest features so I can help shape the platform and potentially earn equity
- **As a contributor**, I want to see my contribution points accumulate so I can track my progress toward rewards

### Community Member Journey
- **As a community member**, I want to browse and upvote contributions so the best ideas rise to the top
- **As a contributor**, I want to see how others have contributed so I can be inspired and collaborate
- **As a stakeholder**, I want to track my revenue share earnings so I can see my investment returns

### Admin Journey
- **As the founder**, I want to review top-voted contributions so I can make final decisions on what to implement
- **As the founder**, I want to set contribution point values so I can fairly reward different types of contributions
- **As the founder**, I want to convert high-value contributors to stakeholders so I can align long-term incentives

## Functional Requirements

### 1. Contribution Submission System

#### 1.1 Multi-Category Submissions
- System must support 5 contribution types:
  - **Meditation Scripts**: Text prompts with theme, duration, and target audience
  - **Voice Samples**: Audio upload with quality requirements (1-3 min, clear, calm)
  - **Feature Ideas**: Description, mockups (optional), technical requirements
  - **Marketing Ideas**: Campaign concepts, content ideas, partnership proposals
  - **Design Assets**: Themes, animations, UI improvements

#### 1.2 Submission Form Fields
- **Required**: Title, Category, Description (min 100 chars)
- **Optional**: Attachments (audio, images, docs), Links, Tags
- **Auto-captured**: Submitter ID, Timestamp, Submission ID

#### 1.3 Draft & Preview
- Users can save drafts before submitting
- Preview mode shows how submission will appear to community
- Edit submissions before they're reviewed (not after approval)

### 2. Tiered Access System

#### 2.1 Public Tier (All Users)
- Can view approved contributions
- Can upvote/downvote (1 vote per contribution)
- Can comment on approved contributions
- Cannot see pending submissions

#### 2.2 Contributor Tier (Verified Contributors)
- **Unlock**: After 1st approved contribution OR $10 contribution fee
- All Public Tier permissions, plus:
- Can view pending submissions from other contributors
- Can leave feedback on pending submissions
- See detailed metrics on their own contributions
- Access to "Contributors Only" community chat

#### 2.3 Stakeholder Tier (Revenue Share)
- **Unlock**: Reach 10,000 contribution points OR revenue-generating contribution approved
- All Contributor Tier permissions, plus:
- Monthly revenue share payouts
- Access to financial dashboard
- Vote on major platform decisions
- Early access to new features

#### 2.4 Investor Tier (Equity Holders)
- **Unlock**: $5,000+ cash investment OR 100,000 contribution points
- All Stakeholder Tier permissions, plus:
- Equity stake (0.1% - 5% based on investment)
- Board meeting attendance (for >1% holders)
- Quarterly financial reports
- Exit event participation

### 3. Point & Reward System

#### 3.1 Point Allocation (Base Values)
- **Meditation Script (Approved & Used)**: 500 points
- **Voice Sample (Approved & Active)**: 1,000 points
- **Feature Idea (Approved & Built)**: 2,000 points
- **Marketing Campaign (Approved & Executed)**: 1,500 points
- **Design Asset (Approved & Implemented)**: 800 points

#### 3.2 Bonus Multipliers
- **Community Top 10 (Monthly)**: 2x points
- **Founder's Pick**: 3x points
- **Viral Impact (>1,000 uses)**: 5x points

#### 3.3 Point Redemption
- **100 points** = 1 free meditation generation
- **500 points** = 5 Stellar Credits (timeline uses)
- **1,000 points** = $10 app credit
- **10,000 points** = Stakeholder tier upgrade + $100 payout
- **100,000 points** = Investor tier offer (equity negotiation)

#### 3.4 Revenue Share Structure
**Stakeholder Tier (10,000+ points):**
- Pool: 10% of monthly net revenue
- Distribution: Proportional to contribution points
- Minimum payout: $50 (accumulates until reached)
- Payout frequency: Net-30

**Investor Tier (Equity):**
- Separate from revenue share pool
- Standard equity distribution via cap table
- Exit events: Acquisition, IPO, dividend distributions

### 4. Community Voting & Approval

#### 4.1 Submission Workflow
1. User submits contribution
2. Auto-moderation check (spam, quality thresholds)
3. Enters "Pending" state (visible to Contributors+)
4. 7-day community voting period
5. If >100 upvotes → moves to "Founder Review"
6. Founder makes final decision (Approve/Reject/Request Changes)
7. If approved → Implementation queue + points awarded

#### 4.2 Voting Rules
- 1 vote per user per submission
- Upvote (+1) or Downvote (-1)
- Net vote score = Upvotes - Downvotes
- Founder can override any vote count
- Voting weight increases with contributor tier (Public: 1x, Contributor: 1.5x, Stakeholder: 2x)

#### 4.3 Founder Dashboard
- Queue of submissions >100 votes
- Sort by: Votes, Date, Category, Trending
- Batch actions: Approve, Reject, Request Info
- Set implementation priority
- Award bonus points

### 5. NFT & Web3 Integration (Phase 2)

#### 5.1 Contribution NFTs
- Each approved contribution minted as NFT
- Metadata: Contributor, Date, Points Earned, Impact Metrics
- Tradeable on secondary markets
- NFT holder receives perpetual micro-royalties (0.1% of related revenue)

#### 5.2 Governance Tokens
- Convert points to $MANIFEST tokens
- Token holders vote on platform decisions
- Staking rewards for long-term holders
- Token burn mechanism for premium features

#### 5.3 Smart Contract Payouts
- Automated revenue share via smart contracts
- Transparent, immutable payout history
- Multi-sig wallet for founder + top stakeholders

## Non-Goals (Out of Scope)

1. **Full DAO Structure**: Not decentralizing all decisions (founder retains control)
2. **External Marketplace**: Not building marketplace for contributions (internal only)
3. **Anonymous Contributions**: All contributors must have verified accounts
4. **Instant Approval**: No auto-approval without founder review
5. **Guaranteed Implementation**: Approved ideas may not be built immediately

## Design Considerations

### UI/UX Requirements
- **Contribution Portal**: Dedicated page with submission form and gallery
- **Leaderboard**: Top contributors by category (monthly, all-time)
- **Personal Dashboard**: User's contributions, points, earnings, tier status
- **Voting Interface**: Swipe-style for mobile, grid for desktop
- **Admin Panel**: Founder-only review queue and analytics

### Visual Design
- Badge system for contributor tiers (icons, colors)
- Progress bars for point milestones
- Animated point accumulation
- Notification system for approvals, payouts, tier upgrades

## Technical Considerations

### Database Schema (New Tables)
```sql
-- Contributions table
CREATE TABLE contributions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  category VARCHAR(50),
  title VARCHAR(200),
  description TEXT,
  attachments JSONB,
  status VARCHAR(20), -- pending, approved, rejected, implemented
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  approved_at TIMESTAMP
);

-- Votes table
CREATE TABLE contribution_votes (
  id SERIAL PRIMARY KEY,
  contribution_id UUID REFERENCES contributions(id),
  user_id UUID REFERENCES users(id),
  vote_value INTEGER, -- +1 or -1
  tier_multiplier DECIMAL,
  created_at TIMESTAMP,
  UNIQUE(contribution_id, user_id)
);

-- Contributor points ledger
CREATE TABLE point_transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  contribution_id UUID,
  points_delta INTEGER,
  transaction_type VARCHAR(50), -- earned, redeemed, bonus
  balance_after INTEGER,
  created_at TIMESTAMP
);

-- Stakeholder payouts
CREATE TABLE stakeholder_payouts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount DECIMAL,
  period VARCHAR(20), -- 2026-01, etc.
  contribution_points INTEGER,
  payout_date DATE,
  status VARCHAR(20) -- pending, paid, failed
);
```

### API Endpoints
- `POST /api/contributions` - Submit contribution
- `GET /api/contributions?status=pending&category=meditation` - List contributions
- `POST /api/contributions/:id/vote` - Cast vote
- `GET /api/contributors/leaderboard` - Top contributors
- `GET /api/contributor/dashboard` - User's stats
- `POST /api/contributor/redeem-points` - Redeem points
- `GET /api/admin/review-queue` - Founder review queue

### Integration Points
- Stripe for revenue share payouts
- IPFS for NFT metadata storage (Phase 2)
- Discord/Slack for community chat
- Email notifications for approvals/payouts

## Success Metrics

### Engagement Metrics
- **Submissions per month**: Target 50+ by Month 3
- **Active contributors**: Target 100+ by Month 6
- **Vote participation**: >30% of active users voting monthly
- **Approval rate**: 20-40% (quality filter working)

### Economic Metrics
- **Revenue share pool**: $1,000+/month by Month 6
- **Average payout**: $50-$200 per stakeholder
- **Point redemption rate**: 60% of earned points redeemed within 90 days
- **Equity conversions**: 1-3 investors by end of Year 1

### Quality Metrics
- **Implementation rate**: 50% of approved contributions implemented within 60 days
- **User satisfaction**: 4.5+ stars on implemented features
- **Community NPS**: 40+ (promoters - detractors)

## Open Questions

1. **Legal Structure**: LLC vs C-Corp for equity distribution?
2. **Cap Table Management**: Use Carta or manual tracking?
3. **Tax Implications**: How to handle 1099 for revenue share?
4. **NFT Platform**: Ethereum, Polygon, or Solana for NFTs?
5. **Token Launch**: When to introduce $MANIFEST token?
6. **International Payouts**: Support for non-US contributors?

## Implementation Phases

### Phase 1: MVP (Months 1-2)
- Basic submission form (meditation scripts + feature ideas only)
- Simple upvoting (no tiers yet)
- Manual founder approval
- Point tracking (no redemption yet)

### Phase 2: Community (Months 3-4)
- All 5 contribution categories
- 3-tier access system
- Point redemption for credits
- Leaderboard & badges

### Phase 3: Monetization (Months 5-6)
- Revenue share payouts
- Stakeholder dashboard
- Automated monthly distributions
- Advanced analytics

### Phase 4: Web3 (Months 7-12)
- Contribution NFTs
- $MANIFEST token launch
- Smart contract payouts
- DAO governance proposal system

## Appendix

### Example Contribution Scenarios

**Scenario 1: Meditation Script Contributor**
- Sarah submits "Ocean of Stars" meditation script
- Gets 150 upvotes from community
- Founder approves with 2x bonus (Founder's Pick)
- Earns 1,000 points (500 base × 2x)
- Redeems 500 points for $5 credit
- Saves 500 points toward Stakeholder tier

**Scenario 2: Voice Artist Path**
- Marcus uploads voice sample, gets approved
- Earns 1,000 base points
- 3 meditations use his voice, each generates 1,000 uses
- Viral bonus: 5x multiplier = 5,000 points
- Total: 6,000 points
- Redeems for $60 payout immediately

**Scenario 3: Investor Journey**
- Elena contributes feature ideas, earns 15,000 points
- Reaches Stakeholder tier, earns $120 in revenue share over 6 months
- Decides to invest $10,000 cash
- Receives 1.5% equity + Investor tier status
- Participates in quarterly board meetings
