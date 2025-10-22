
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Welcome to the SouLVE Community!",
        description: "Redirecting you to complete your registration...",
      });
      setEmail("");
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    }
  };

  return (
    <div className="bg-gradient-to-r from-teal-600 to-blue-600 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Join the Pre-Release Community</h2>
        <p className="text-xl text-teal-100 mb-2">
          Be the first to experience the platform that bridges the human gap AI cannot reach.
        </p>
        <p className="text-lg text-teal-200 mb-8">
          Together, we can build a better future - one connection at a time.
        </p>
        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/90 border-0"
            required
          />
          <Button type="submit" className="bg-white text-teal-600 hover:bg-teal-50">
            Join SouLVE
          </Button>
        </form>
        <p className="text-sm text-teal-200 mt-4">
          Contact us: <a href="mailto:info@join-soulve.com" className="underline hover:text-white">info@join-soulve.com</a>
        </p>
      </div>
    </div>
  );
};

export default NewsletterSection;
