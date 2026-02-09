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
  {
    slug: 'breaking-patterns-grief-heartbreak-and-manifesting',
    title: 'Breaking Patterns: Moving Through Grief, Heartbreak, and Low Energy—And How It Affects Manifesting',
    date: 'Feb 9, 2026',
    category: 'Healing',
    excerpt:
      'Grief, heartbreak, and painful days don’t mean you’re “bad at manifesting.” They mean you’re human. Here’s how to honor the low and still keep the door open to what you’re calling in.',
    content: [
      {
        type: 'blockquote',
        text: 'Your ability to manifest isn’t broken when you’re broken. It’s just waiting for you to stop fighting the wave—so you can learn to move with it.',
      },
      {
        type: 'p',
        text: 'If you’ve ever been in the middle of heartbreak, loss, or a stretch of days when getting out of bed feels like the only “win,” you may have also heard a cruel inner voice: “You’re supposed to be manifesting. You’re supposed to be vibrating high. Why can’t you just think positive?” That voice misunderstands both grief and manifestation. Moving through pain doesn’t disqualify you from calling in what you want—but it does change how the work looks, and that’s something we can work with.',
      },
      { type: 'h2', text: '1. Why Pain Feels Like It “Blocks” Manifestation' },
      {
        type: 'p',
        text: 'Manifestation is often described as alignment: your thoughts, feelings, and actions lining up with the reality you want. When you’re grieving, exhausted, or heartbroken, your nervous system is in survival mode. Your “vibration” isn’t low because you’re doing it wrong—it’s low because your body and psyche are processing something real. Trying to force yourself into peak positivity on top of that can feel like lying to yourself, and that creates its own kind of misalignment. The block isn’t the pain; it’s the belief that you must be “on” all the time to manifest.',
      },
      { type: 'h2', text: '2. Breaking the Pattern of “I Have to Feel Good to Manifest”' },
      {
        type: 'p',
        text: 'One of the most persistent patterns in manifestation culture is the idea that you must feel good, grateful, and high-energy for anything to work. That’s only partly true. Clarity of intention matters. So does taking small, aligned actions when you can. But insisting that you feel great before you’re “allowed” to manifest adds a layer of pressure that can make the low periods even heavier. Breaking the pattern means: you can set an intention, or simply hold a gentle hope, even on days when you’re not at your best. You don’t have to perform wellness to be worthy of what you want.',
      },
      {
        type: 'tip',
        title: 'Practical Tip',
        text: 'On low-energy or painful days, scale your practice down instead of skipping it. One breath with a single intention (“I am allowed to want good things even when I don’t feel good”) or one short grounding meditation can keep the thread of manifestation alive without demanding more than you have. Use our free Cosmic Grounding or Void Silence meditations when you need something slow and spacious rather than uplifting.',
      },
      { type: 'h2', text: '3. Grief and Heartbreak as Part of the Path, Not the Enemy' },
      {
        type: 'p',
        text: 'Grief and heartbreak often clear out old attachments—to a person, a version of yourself, or a story of how life “should” go. That clearing is uncomfortable, but it can also create space. The same cup that was full of the old relationship or the old identity can, in time, hold something new. You don’t have to rush that process. Honoring the low—crying, resting, saying “not today” to big goals—isn’t the opposite of manifesting. It’s often the messy middle that makes the next chapter possible.',
      },
      { type: 'h2', text: '4. Low Energy Doesn’t Mean No Alignment' },
      {
        type: 'p',
        text: 'On painful days, “alignment” might look different. It might mean choosing rest over productivity, or kindness toward yourself over another round of self-criticism. It might mean a tiny action—sending one message, opening one door—that keeps you connected to a future you still want, even when you can’t feel it yet. Manifestation isn’t only about big visualizations and high vibes. It’s also about the small, honest choices that keep you moving in the direction of your desires, at the pace that your system can handle.',
      },
      {
        type: 'p',
        text: 'Breaking patterns isn’t about never feeling grief or low energy again. It’s about no longer treating those states as proof that you’re failing at manifesting. When you allow the wave of pain to move through you—without demanding that it leave on a schedule—you stop fighting yourself. And when you stop fighting yourself, you create more room for the reality you’re calling in to actually land. Be gentle. Move at the pace of your healing. Your intentions can wait for you.',
      },
    ],
  },
  {
    slug: 'seven-points-mind-training-lojong-manifestation',
    title: 'The Seven Points of Mind Training: Lojong, Tibetan Buddhism, and Manifestation',
    date: 'Feb 9, 2026',
    category: 'Philosophy',
    excerpt:
      'Tibetan Buddhism’s lojong (mind training) offers a seven-point framework for shifting how we relate to thought, adversity, and intention—with surprising parallels to conscious manifestation.',
    content: [
      {
        type: 'blockquote',
        text: 'Lojong doesn’t change the world first. It changes the mind that meets the world—and from that shift, different realities become possible.',
      },
      {
        type: 'p',
        text: 'Lojong (Tibetan: blo sbyong, “mind training”) is a centuries-old practice from Tibetan Buddhism. Its most famous formulation—the Seven Points of Mind Training—comes from the lineage of Atisha and Chekawa Yeshe Dorje. The aim is enlightenment for the benefit of all beings; the method is a systematic retraining of how we use our minds in everyday life. For anyone interested in manifestation, lojong is worth knowing: it’s a rigorous map for turning intention, adversity, and habit into the very material of transformation.',
      },
      { type: 'h2', text: '1. The Preliminaries: Foundation for Any Practice' },
      {
        type: 'p',
        text: 'The first point establishes the basis. It includes reflections on the preciousness of human life, the reality of death and impermanence, the law of cause and effect (karma), and the shortcomings of unexamined, reactive existence. In lojong, you don’t jump straight to “think positive”—you ground in why the mind matters at all. For manifestation, the parallel is clear: without a sober sense that this life is the one you have, and that your thoughts and actions have consequences, intention can stay vague or passive. The preliminaries turn the mind toward the work.',
      },
      { type: 'h2', text: '2. Training in the Two Bodhicittas: Heart and Wisdom' },
      {
        type: 'p',
        text: 'The second point is the core practice: cultivating relative bodhicitta (loving-kindness and compassion) and ultimate bodhicitta (wisdom that sees the empty, interdependent nature of experience). Relative bodhicitta softens the heart and extends care; ultimate bodhicitta loosens the grip on fixed stories about “me” and “my reality.” In manifestation terms: the heart aligns you with what you want to call in (for yourself and others), while the wisdom side reminds you that rigid attachment to one outcome can block the very shift you’re seeking. Together they support both intention and flexibility.',
      },
      { type: 'h2', text: '3. Transforming Bad Circumstances into the Path' },
      {
        type: 'p',
        text: 'The third point is famous: when the world is full of difficulty, use that difficulty as the path. Instead of treating obstacles as proof that manifestation “isn’t working,” lojong asks you to use adversity as the raw material for training—patience, compassion, letting go. That doesn’t mean pretending suffering is good; it means refusing to let hardship be the only story. For manifestors, this is the “obstacle as fuel” principle: setbacks can refine your intention and clarify what you’re actually aligned with, instead of stopping the process.',
      },
      {
        type: 'tip',
        title: 'Practical Tip',
        text: 'When something goes wrong, try the lojong slogan: “When the world is filled with evil, transform bad circumstances into the path of bodhi.” Ask: What can this situation train in me? What intention stays clear even here? Pair this with a short grounding or loving-kindness meditation to keep the mind from collapsing into blame or despair.',
      },
      { type: 'h2', text: '4. Showing the Practice in One Lifetime' },
      {
        type: 'p',
        text: 'The fourth point condenses the practice into instructions that can be lived in a single lifetime. It’s pragmatic: you don’t need infinite time; you need consistent application now. In manifestation, the equivalent is “this life is the field”—you’re not waiting for another era or a better version of yourself. The timeline you visualize, the goals you set, and the small steps you take today are the only place the practice happens. One lifetime is enough to change how you think, speak, and act.',
      },
      { type: 'h2', text: '5. The Measure of Having Trained' },
      {
        type: 'p',
        text: 'The fifth point describes the signs that mind training has taken hold: the “five degenerations” (e.g., strong negative emotions, rigid views) begin to reverse. You notice yourself less reactive, more able to turn difficulty into practice. For manifestation, the measure isn’t only “did I get the thing?”—it’s “is my mind more aligned, resilient, and clear?” When your baseline shifts from anxiety and doubt toward steadiness and openness, the conditions for manifesting improve even before specific outcomes appear.',
      },
      { type: 'h2', text: '6. The Commitments of Mind Training' },
      {
        type: 'p',
        text: 'The sixth point lays out commitments: don’t be inconsistent, don’t be partial (practicing only when it’s easy), don’t lose the thread in busyness. These are promises to yourself about how you’ll hold the practice. In manifestation language: you commit to showing up for your intentions not only on good days but as a default. The commitment is to the process—meditation, visualization, aligned action—rather than to a single result, which keeps the practice alive through ups and downs.',
      },
      { type: 'h2', text: '7. The Precepts of Mind Training' },
      {
        type: 'p',
        text: 'The seventh point adds precepts: don’t transfer your negativity onto others, don’t strike at the heart of someone’s vulnerability, don’t exploit others for your own gain. Ethics and mind training are one. For manifestors, this is a check: the reality you’re calling in should not require harming or manipulating others. Aligning with abundance, love, or success in a way that respects interdependence strengthens both your integrity and the sustainability of what you manifest.',
      },
      {
        type: 'p',
        text: 'The seven points of lojong aren’t a quick “manifestation hack”—they’re a full reeducation of the mind. But that reeducation is exactly what makes intention effective: a mind that’s grounded, compassionate, flexible in difficulty, committed in one lifetime, and bound by care for others is a mind that can genuinely align with and move toward the reality it chooses. Tibetan Buddhism and manifestation meet where the mind is trained to be the kind of vessel that can hold—and co-create—what it intends.',
      },
    ],
  },
  {
    slug: 'stability-over-chaos-life-coming-from-you',
    title: 'Choosing Stability Over Chaos: Life Is Coming From You, Not At You',
    date: 'Feb 9, 2026',
    category: 'Practice',
    excerpt:
      'When you choose a stable inner stance over reacting to chaos, you stop waiting for life to calm down. You become the source—and “no excuses” becomes clarity, not cruelty.',
    content: [
      {
        type: 'blockquote',
        text: 'Chaos doesn’t disappear when you choose stability. You become the one who can meet it—because you stopped believing it’s only happening to you.',
      },
      {
        type: 'p',
        text: 'Life throws curveballs. Jobs end, relationships shift, health scares happen, plans collapse. It’s easy to feel like chaos is coming at you—something the world is doing to you—and that you’ll finally be able to think clearly, manifest, or “show up” once things settle down. But things don’t settle down. The real leverage isn’t waiting for calm; it’s choosing stability as your default response. And that choice rests on a single shift: life is coming from you, not at you. Not in a woo way that denies hardship, but in a practical way—you are the one interpreting, responding, and deciding what you do with what happens. No excuses.',
      },
      { type: 'h2', text: '1. Stability Isn’t the Absence of Chaos' },
      {
        type: 'p',
        text: 'Choosing stability over chaos doesn’t mean your outer world gets quiet. It means you build an inner baseline—through meditation, routine, boundaries, or simple repetition—so that when the storm hits, you’re not only the storm. You have something to return to: your breath, your intention, your next small action. That baseline is a choice. Nobody can give it to you; you practice it until it’s there. The chaos of life doesn’t have to disappear for you to stop being at its mercy.',
      },
      { type: 'h2', text: '2. Life Coming From You, Not At You' },
      {
        type: 'p',
        text: '"Life is coming from you" doesn’t mean you caused the layoff or the illness or the breakup. It means: your experience of life is filtered through you. Your thoughts, your story, your focus, and your response are the only things you can actually steer. When you live as if life is “at” you, you’re always in reaction—defending, blaming, waiting for the world to change so you can finally act. When you live as if life is “from” you, you’re the locus. You ask: What am I making this mean? What do I do next? What can I create from here? That’s not denial; it’s agency.',
      },
      {
        type: 'tip',
        title: 'Practical Tip',
        text: 'When something goes wrong, pause before you blame or spiral. Ask: “What part of my experience is coming from my interpretation and my next move?” You don’t have to fix it in one second—just notice that you have a say. Then choose one small action that moves you toward stability (one breath, one clear intention, one concrete step). Repeat. That’s choosing stability over chaos in real time.',
      },
      { type: 'h2', text: '3. No Excuses: Ownership Without Self-Blame' },
      {
        type: 'p',
        text: '"No excuses" can sound harsh. It doesn’t mean “pretend you’re not tired or hurt” or “never acknowledge real limits.” It means: stop using circumstances as a permanent reason to opt out. Excuses are the story we tell so we don’t have to try—or so we can stay in the comfort of “it’s not my fault.” Ownership is different: I didn’t choose this event, but I choose what I do with it. I choose whether I practice stability or get swept away. I choose whether I keep aligning with what I want or wait for the world to give me permission. No excuses isn’t about beating yourself up; it’s about refusing to hand your agency over to chaos.',
      },
      { type: 'h2', text: '4. How Stability Helps You Handle Chaos' },
      {
        type: 'p',
        text: 'When you’ve trained stability—even a little—you don’t need life to be easy to function. You can meditate in a crisis. You can set an intention when the news is bad. You can take one step toward your goal when you’re tired. Chaos becomes something you move through, not something that defines you. That’s how choosing stability over chaos actually helps you handle chaos: you stop waiting for it to leave before you live. You become the steady point. And from that place, manifestation isn’t a fair-weather game—it’s what you do with whatever weather you’ve got.',
      },
      {
        type: 'p',
        text: 'Choose stability. Treat life as coming from you—your meaning, your response, your next move. Drop the excuses without dropping self-compassion. The chaos will still come. You’ll just be the one who’s ready for it.',
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
