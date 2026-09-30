import { Heart, MessageCircle, Share2, Bookmark, BadgeCheck, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const stories = [
  {
    author: "Community Care Network",
    handle: "community-care",
    initials: "CC",
    gradient: "from-rose-500 to-pink-500",
    badge: "Verified Organisation",
    time: "3h",
    problem: "78-year-old widow, 3 days without human contact, considering residential care",
    solution: "Matched with local volunteers for weekly visits and digital companionship",
    impact: "Depression reduced by 60%, remained independent at home, volunteer found purpose after retirement",
    likes: "2.4k",
    comments: "186",
  },
  {
    author: "Mind Matters Peer Group",
    handle: "mind-matters",
    initials: "MM",
    gradient: "from-purple-500 to-indigo-500",
    badge: "Verified Group",
    time: "5h",
    problem: "Young professional battling anxiety, NHS wait time 18 months, feeling hopeless",
    solution: "Connected with peer support group and trained mental health volunteer",
    impact: "Back at work within 3 months, now mentoring others, 12 people helped through same journey",
    likes: "3.1k",
    comments: "243",
  },
  {
    author: "Hackney Food Hub",
    handle: "hackney-food-hub",
    initials: "HF",
    gradient: "from-[#0ce4af] to-[#18a5fe]",
    badge: "Verified Charity",
    time: "1d",
    problem: "Food bank struggling with declining donations, couldn't reach new supporters",
    solution: "Corporate partners matched through CSR dashboard, social media campaign amplified",
    impact: "Donations increased 200%, 8 businesses now regular partners, feeding 500 more families monthly",
    likes: "4.8k",
    comments: "392",
  },
];

const ImpactStoriesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Soft ambient accents */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 -left-32 h-72 w-72 rounded-full bg-[#0ce4af]/10 blur-[100px]" />
        <div className="absolute bottom-16 -right-32 h-72 w-72 rounded-full bg-[#18a5fe]/10 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0ce4af]/30 bg-[#0ce4af]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-700">
            <TrendingUp className="h-3.5 w-3.5" />
            Impact Stories
          </span>
          <h2 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Real problems.{" "}
            <span className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              Real impact.
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            See how SouLVE turns everyday posts and connections into measurable change.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14">
          {stories.map((story, index) => (
            <motion.article
              key={story.handle}
              className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              {/* Post header */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-4">
                <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${story.gradient} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                  {story.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-slate-900 truncate">{story.author}</span>
                    <BadgeCheck className="h-4 w-4 text-[#18a5fe] shrink-0" />
                  </div>
                  <span className="text-xs text-slate-500">{story.badge} · {story.time}</span>
                </div>
              </div>

              {/* Post body — Problem → Solution → Impact timeline */}
              <div className="px-5 pb-5 flex-1">
                <div className="relative space-y-5 pl-8">
                  {/* Gradient connector line */}
                  <div className="absolute left-[11px] top-3 bottom-6 w-0.5 rounded-full bg-gradient-to-b from-rose-400 via-[#18a5fe] to-[#0ce4af]" />

                  {/* Problem */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.12 + 0.15 }}
                  >
                    <div className="absolute -left-8 top-0 h-6 w-6 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-md shadow-rose-500/40 ring-4 ring-white flex items-center justify-center">
                      <AlertCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-rose-500">
                      Problem
                    </span>
                    <p className="mt-1.5 text-[15px] font-semibold leading-relaxed text-slate-900">
                      {story.problem}
                    </p>
                  </motion.div>

                  {/* Solution */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.12 + 0.3 }}
                  >
                    <div className="absolute -left-8 top-0 h-6 w-6 rounded-full bg-gradient-to-br from-[#18a5fe] to-[#4c3dfb] shadow-md shadow-[#18a5fe]/40 ring-4 ring-white flex items-center justify-center">
                      <Lightbulb className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#0f7fd4]">
                      Solution
                    </span>
                    <div className="mt-1.5 rounded-xl bg-[#18a5fe]/[0.07] border border-[#18a5fe]/15 px-3.5 py-2.5">
                      <p className="text-sm leading-relaxed text-slate-600">
                        {story.solution}
                      </p>
                    </div>
                  </motion.div>

                  {/* Impact */}
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.12 + 0.45 }}
                  >
                    <div className="absolute -left-8 top-0 h-6 w-6 rounded-full bg-gradient-to-br from-[#0ce4af] to-emerald-500 shadow-md shadow-[#0ce4af]/40 ring-4 ring-white flex items-center justify-center">
                      <TrendingUp className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-teal-600">
                      Impact
                    </span>
                    <div className="mt-1.5 rounded-xl bg-gradient-to-br from-[#0ce4af]/15 to-[#18a5fe]/10 border border-[#0ce4af]/25 px-3.5 py-2.5">
                      <p className="text-sm font-semibold leading-relaxed text-slate-900">
                        {story.impact}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Action bar */}
              <div className="mt-auto flex items-center gap-6 border-t border-slate-100 px-5 py-3.5 text-slate-400">
                <span className="flex items-center gap-1.5 text-sm font-medium group-hover:text-slate-600 transition-colors">
                  <Heart className="h-[18px] w-[18px] text-rose-500 fill-rose-500" />
                  {story.likes}
                </span>
                <span className="flex items-center gap-1.5 text-sm font-medium group-hover:text-slate-600 transition-colors">
                  <MessageCircle className="h-[18px] w-[18px]" />
                  {story.comments}
                </span>
                <Share2 className="h-[18px] w-[18px]" />
                <Bookmark className="ml-auto h-[18px] w-[18px]" />
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium uppercase tracking-widest text-slate-400 mb-5">
            Here's how we make it happen
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white px-10 py-6 text-base font-semibold rounded-full shadow-lg shadow-[#18a5fe]/30 hover:scale-105 transition-transform border-none"
          >
            Join the Movement
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStoriesSection;
