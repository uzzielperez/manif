import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogPosts';

const Blog: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto pb-20 px-4"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[var(--cosmic-text-muted)] hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Manifestation Blog
        </h1>
        <p className="text-lg text-white/70">
          Guides, practices, and cosmic wisdom for your journey.
        </p>
      </header>

      <ul className="space-y-6">
        {BLOG_POSTS.map((post, index) => (
          <motion.li
            key={post.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="block bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-2xl p-6 md:p-8 backdrop-blur-xl hover:border-[var(--cosmic-accent)]/40 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 text-xs font-bold text-[var(--cosmic-accent)] uppercase tracking-[0.2em] mb-2">
                    <span className="bg-[var(--cosmic-accent)]/10 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-[var(--cosmic-text-muted)]">
                      <Calendar size={12} /> {post.date}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[var(--cosmic-accent)] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-white/70 line-clamp-2">{post.excerpt}</p>
                </div>
                <ChevronRight
                  className="flex-shrink-0 w-6 h-6 text-white/50 group-hover:text-[var(--cosmic-accent)] transition-colors"
                  aria-hidden
                />
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Blog;
