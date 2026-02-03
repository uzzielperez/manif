export type BlogPostBlock =
  | { type: 'blockquote'; text: string }
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'tip'; title: string; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: BlogPostBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-it-means-to-manifest',
    title: 'What It Means to Manifest: A Guide to Cosmic Alignment',
    date: 'Jan 2, 2026',
    category: 'Philosophy',
    excerpt:
      'Manifestation is not just wishing for what you want; it is aligning your entire being with the frequency of the reality you wish to inhabit.',
    content: [
      {
        type: 'blockquote',
        text: 'Manifestation is not just wishing for what you want; it is aligning your entire being with the frequency of the reality you wish to inhabit.',
      },
      {
        type: 'p',
        text: 'The term "manifestation" has become a buzzword in recent years, often reduced to simple "positive thinking." However, at its core, manifesting is a profound psychological and spiritual practice that involves bridging the gap between intention and reality.',
      },
      { type: 'h2', text: '1. The Principle of Resonance' },
      {
        type: 'p',
        text: 'Everything in the universe, from the stars above to the cells in your body, is in a state of constant vibration. Resonance occurs when two systems vibrate at the same frequency. When we manifest, we are intentionally adjusting our mental, emotional, and physical "vibration" to resonate with our goals.',
      },
      { type: 'h2', text: '2. The Role of the Subconscious' },
      {
        type: 'p',
        text: 'Our subconscious mind acts like a cosmic GPS. If you program it with doubt and scarcity, it will find paths that lead to those outcomes. Through tools like guided meditation and visual timelines, we can reprogram the subconscious to recognize and seize opportunities that align with our deepest desires.',
      },
      {
        type: 'tip',
        title: 'Practical Tip',
        text: 'Start by visualizing your goals not as distant dreams, but as existing nodes on your current timeline. Use our interactive timeline tool to map out the steps required to bridge your current reality to that node.',
      },
      { type: 'h2', text: '3. Action as an Amplifier' },
      {
        type: 'p',
        text: 'Manifestation is not a substitute for action; it is a catalyst for inspired action. When you are aligned, the steps you take feel less like a struggle and more like a natural progression of your current path. The universe meets you halfway, but you must take the first step.',
      },
      {
        type: 'p',
        text: 'As you explore this platform, remember that every meditation you complete and every path you visualize is a message to your subconscious: "I am ready for this reality."',
      },
    ],
  },
  {
    slug: 'pendulums-and-their-importance',
    title: 'Pendulums and Their Importance: Finding Your Center',
    date: 'Feb 3, 2026',
    category: 'Practice',
    excerpt:
      'The pendulum is one of the oldest tools for tuning into subtle energy and clarifying intention. Here’s why it still matters—and how to use it.',
    content: [
      {
        type: 'blockquote',
        text: 'A pendulum doesn’t tell the future—it reflects what you already know, waiting beneath the noise of the mind.',
      },
      {
        type: 'p',
        text: 'Long before apps and wearables, people used simple objects to connect with their inner guidance. Among the most enduring of these tools is the pendulum: a weight on a chain or cord that swings in response to subtle shifts in energy and intention. Whether you’re new to the practice or revisiting it, understanding why pendulums matter can deepen both your meditation and your manifestation work.',
      },
      { type: 'h2', text: '1. Why Pendulums Work' },
      {
        type: 'p',
        text: 'A pendulum amplifies tiny, unconscious movements of your hand and body. When you hold it with a clear question or intention, your nervous system—often without you “deciding” in a logical way—influences its swing. So the pendulum doesn’t magically know the answer; it helps you access what your body and subconscious already sense. It’s a bridge between intention and intuition.',
      },
      { type: 'h2', text: '2. Clearing Mental Static' },
      {
        type: 'p',
        text: 'When your mind is crowded with doubt or too many options, it’s hard to feel what you truly want. Asking a pendulum “yes or no” or “this or that” forces you to simplify. That act of focusing, plus the physical ritual of holding and watching the swing, can quiet the noise and make your deeper preferences easier to recognize. In that way, the pendulum supports the same clarity we cultivate in meditation.',
      },
      {
        type: 'tip',
        title: 'Practical Tip',
        text: 'Before you use a pendulum, take a few slow breaths and set an intention: “I am open to clear, honest answers that serve my highest good.” Use it in a calm moment—after a short meditation or when you’re not rushed—so your results feel more aligned.',
      },
      { type: 'h2', text: '3. Aligning With Manifestation' },
      {
        type: 'p',
        text: 'Manifestation works best when your goals are clear and your energy is aligned. Pendulums can help you check in: Are you moving toward something that truly resonates, or are you chasing an “should” that doesn’t fit? A simple “Does this path serve me?” can reveal misalignment before you invest more time. Think of it as a tuning device for your intentions.',
      },
      {
        type: 'p',
        text: 'Pendulums are a small but powerful reminder that you already have access to inner wisdom. Combine them with meditation and conscious intention-setting, and you strengthen the same muscle that makes manifestation feel natural and grounded.',
      },
    ],
  },
  {
    slug: 'cleaning-your-cup-ram-dass',
    title: 'Cleaning Your Cup: A Ram Dass–Inspired Tool for Manifestation',
    date: 'Feb 3, 2026',
    category: 'Practice',
    excerpt:
      'The teacup teaching—empty your cup so you can receive. Why clearing old beliefs and preconceptions is one of the most powerful moves you can make before you manifest.',
    content: [
      {
        type: 'blockquote',
        text: 'If your cup is full, nothing new can pour in. Empty it first—then what you invite has room to land.',
      },
      {
        type: 'p',
        text: 'Ram Dass and many wisdom traditions share a simple image: a visitor arrives for tea. The host keeps pouring until the cup overflows. The visitor says, "Stop! My cup is full." The host replies: "Exactly. So long as your cup is full, you cannot receive what I am offering." The lesson isn’t about tea—it’s about the mind. When your "cup" is full of old opinions, past hurts, fixed identities, and "how things are," there’s no space for new possibilities. Cleaning your cup is a powerful tool for manifestation because it makes room for the reality you want to call in.',
      },
      { type: 'h2', text: '1. What Fills the Cup?' },
      {
        type: 'p',
        text: 'Your cup might be full of stories you’ve told yourself for years: "I’m not the kind of person who…," "That only happens to others," "I’ve always struggled with…." It might be full of other people’s expectations, cultural scripts about success and worth, or the weight of past attempts that "didn’t work." None of these are bad—but when they occupy every inch of space, there’s no room for a new story. Manifestation often fails not because intention is weak, but because the cup is still full of the old.',
      },
      { type: 'h2', text: '2. Cleaning as a Practice, Not a One-Time Fix' },
      {
        type: 'p',
        text: 'Cleaning your cup isn’t about deleting your past or pretending it didn’t happen. It’s about loosening your grip on the stories that no longer serve you. Meditation, journaling, and honest reflection help you notice what’s in the cup: the beliefs, fears, and identities you’ve been carrying. As Ram Dass emphasized, the work is to be present with what is—and from that place, to choose what you hold and what you put down. When you stop clutching the old, you create space for the new.',
      },
      {
        type: 'tip',
        title: 'Practical Tip',
        text: 'Before you set a big intention or do a manifestation practice, take five minutes to "empty the cup." Sit quietly and name one belief or story that might be blocking you (e.g., "I don’t deserve this" or "It never works for me"). Don’t fight it—just acknowledge it. Then imagine setting that thought down like a heavy cup. Breathe. Now invite in one clear, simple intention. See how much more room it has when the cup isn’t full.',
      },
      { type: 'h2', text: '3. From Empty Cup to Clear Intention' },
      {
        type: 'p',
        text: 'When your cup is less full, your intentions can land with clarity. You’re not layering "I want this" on top of "but I know I’ll never get it." You’re creating a receptive inner space. That doesn’t mean you have to be perfectly "empty"—it means you’re willing to make space. Manifestation works best when it’s aligned with a mind that’s open enough to receive. Cleaning your cup is the preparation; your intention is what you pour in next.',
      },
      {
        type: 'p',
        text: 'Ram Dass often pointed back to the heart: the cup we’re really cleaning is the one we carry inside. When we clear the clutter of old narratives and make room for presence, we become a vessel for something new. Use this teaching as a prelude to your manifestation practice—empty first, then invite. What wants to pour in might surprise you.',
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
