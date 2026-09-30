
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, Building2, HeartHandshake, Compass, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const userTypes = [
  {
    title: "Community Members",
    description: "Request help when you need it, offer support when you can. Build meaningful connections in your neighbourhood.",
    audience: "Individuals seeking or offering help",
    icon: Users,
  },
  {
    title: "Businesses & CSR",
    description: "Amplify your corporate social responsibility initiatives and connect directly with community needs.",
    audience: "Companies looking to make measurable impact",
    icon: Building2,
  },
  {
    title: "Charities & Organisations",
    description: "Expand your reach, connect with volunteers, and track your impact across communities.",
    audience: "Non-profits and community groups",
    icon: HeartHandshake,
  },
  {
    title: "Community Leaders",
    description: "Lead initiatives, coordinate responses, and build stronger, more connected communities.",
    audience: "Local leaders and activists",
    icon: Compass,
  },
];

const UserTypesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      {/* Ambient accents */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-[#18a5fe]/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-[#0ce4af]/10 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#4c3dfb]/20 bg-[#4c3dfb]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#4c3dfb]">
            <Users className="h-3.5 w-3.5" />
            Who It's For
          </span>
          <h2 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Built for{" "}
            <span className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              everyone who cares
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Whether you're looking to help or need support, SouLVE creates meaningful connections across all communities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {userTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (index % 2) * 0.12 }}
            >
              <Card className="group h-full rounded-3xl border-slate-200/80 bg-white shadow-sm hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                <CardContent className="flex items-start gap-5 p-7">
                  <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-[#0ce4af] to-[#18a5fe] shadow-lg shadow-[#18a5fe]/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
                    <type.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900">{type.title}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#0f7fd4] mt-0.5">
                      {type.audience}
                    </p>
                    <p className="mt-3 text-[15px] text-slate-600 leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-slate-300 group-hover:text-[#18a5fe] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Final CTA band */}
        <motion.div
          className="mt-16 relative rounded-3xl bg-slate-950 overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 left-1/4 h-56 w-56 rounded-full bg-[#0ce4af]/25 blur-[90px]" />
            <div className="absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-[#18a5fe]/25 blur-[90px]" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-10 sm:px-12">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Ready to make your feed matter?
              </h3>
              <p className="mt-2 text-slate-400">
                Join the founding community and help shape social media with purpose.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white px-9 py-6 text-base font-semibold rounded-full shadow-lg shadow-[#0ce4af]/30 hover:scale-105 transition-transform border-none whitespace-nowrap"
            >
              Get Started Today
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UserTypesSection;
