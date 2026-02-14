import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getPostBySlug, type BlogPostBlock, type BlogPost } from '../data/blogPosts';

const API_BASE = (import.meta as { env?: { VITE_API_BASE?: string } }).env?.VITE_API_BASE ?? '';

const Footnote = ({ id, label, children }: { id: number; label: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <footer key={id} className="mt-2 mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-[var(--cosmic-text-muted)] hover:text-[var(--cosmic-accent)] transition-colors font-medium"
      >
        [{id}] {label}
      </button>
      {open && (
        <p className="mt-2 text-sm text-white/60 italic border-l-2 border-white/20 pl-4">
          {children}
        </p>
      )}
    </footer>
  );
};

let footnoteCounter = 0;
const renderBlock = (block: BlogPostBlock, index: number) => {
  const hasDraft = 'draft' in block && block.draft;
  const fnId = hasDraft ? ++footnoteCounter : 0;

  switch (block.type) {
    case 'blockquote':
      return (
        <div key={index}>
          <p
            className="text-xl text-white font-medium italic border-l-4 border-[var(--cosmic-accent)] pl-6 py-2 bg-white/5 rounded-r-xl"
          >
            "{block.text}"
          </p>
          {hasDraft && <Footnote id={fnId} label="Second draft">{block.draft}</Footnote>}
        </div>
      );
    case 'p':
      return (
        <div key={index}>
          <p className="text-white/80">
            {block.text}
          </p>
          {hasDraft && <Footnote id={fnId} label="Second draft">{block.draft}</Footnote>}
        </div>
      );
    case 'h2':
      return (
        <h2 key={index} className="text-3xl font-bold text-white pt-4">
          {block.text}
        </h2>
      );
    case 'tip':
      return (
        <div key={index}>
          <div
            className="bg-gradient-to-r from-[var(--cosmic-primary)]/20 to-transparent p-8 rounded-2xl border-l-2 border-[var(--cosmic-primary)] my-12"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="text-[var(--cosmic-primary)]" />
              {block.title}
            </h3>
            <p className="text-white/80">{block.text}</p>
          </div>
          {hasDraft && <Footnote id={fnId} label="Second draft">{block.draft}</Footnote>}
        </div>
      );
    default:
      return null;
  }
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(slug ? getPostBySlug(slug) ?? null : null);
  const [loading, setLoading] = useState(!slug || !getPostBySlug(slug));
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const staticPost = getPostBySlug(slug);
    if (staticPost) {
      setPost(staticPost);
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/get-blog-posts?slug=${encodeURIComponent(slug)}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data: { post?: BlogPost }) => {
        if (data?.post) setPost(data.post);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto pb-20 px-4 flex items-center justify-center min-h-[40vh] text-white/70">
        Loading…
      </div>
    );
  }
  if (notFound || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto pb-20 px-4"
    >
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-[var(--cosmic-text-muted)] hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Blog</span>
      </Link>

      <article className="bg-[var(--cosmic-glass)] border border-[var(--cosmic-glass-border)] rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl">
        <header className="mb-12">
          <div className="flex items-center gap-4 text-xs font-bold text-[var(--cosmic-accent)] uppercase tracking-[0.2em] mb-4">
            <span className="bg-[var(--cosmic-accent)]/10 px-2 py-1 rounded">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {post.date}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between border-y border-white/10 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--cosmic-primary)] to-[var(--cosmic-accent)]" />
              <div>
                <p className="text-sm font-bold text-white">The Cosmic Team</p>
                <p className="text-xs text-[var(--cosmic-text-muted)]">
                  Guides & Visionaries
                </p>
              </div>
            </div>
            <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white">
              <Share2 size={20} />
            </button>
          </div>
        </header>

        <div className="prose prose-invert max-w-none text-lg leading-relaxed space-y-8">
          {post.content.map((block, i) => {
            if (i === 0) footnoteCounter = 0;
            return renderBlock(block, i);
          })}
        </div>

        <footer className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-[var(--cosmic-text-muted)]">
            Ready to start your journey?
          </p>
          <div className="flex gap-4">
            <Link
              to="/generate"
              className="px-6 py-2.5 bg-[var(--cosmic-primary)] text-white rounded-xl font-bold hover:opacity-90 transition-all"
            >
              Create Meditation
            </Link>
            <Link
              to="/timelines"
              className="px-6 py-2.5 bg-white/5 text-white border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              Map Timeline
            </Link>
          </div>
        </footer>
      </article>
    </motion.div>
  );
};

export default BlogPostPage;
