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
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
