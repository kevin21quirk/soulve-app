import { Helmet } from "react-helmet-async";
import HomeHeader from "@/components/HomeHeader";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | SouLVE - Community Guidelines</title>
        <meta name="description" content="Read SouLVE's Terms of Service to understand your rights and responsibilities when using our community platform." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
        <HomeHeader />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using SouLVE, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                SouLVE is a community platform that connects people to help solve real-world problems through trust-based relationships. We provide tools for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Creating and responding to help requests</li>
                <li>Building community connections</li>
                <li>Organizing campaigns and fundraising</li>
                <li>Volunteer coordination</li>
                <li>Impact tracking and verification</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Eligibility</h2>
              <p className="text-gray-700 mb-4">
                You must be at least 16 years old to use SouLVE. By using our platform, you represent that you meet this requirement and have the legal capacity to enter into this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Accounts</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Creation</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>You must provide accurate, current information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must not share your account credentials</li>
                <li>You must notify us immediately of unauthorized access</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Termination</h3>
              <p className="text-gray-700 mb-4">
                We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful behavior.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Conduct</h2>
              <p className="text-gray-700 mb-4">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Post false, misleading, or fraudulent content</li>
                <li>Harass, bully, or threaten other users</li>
                <li>Impersonate others or misrepresent affiliations</li>
                <li>Share inappropriate, offensive, or illegal content</li>
                <li>Spam or send unsolicited messages</li>
                <li>Attempt to hack, disrupt, or compromise platform security</li>
                <li>Use the platform for commercial purposes without authorization</li>
                <li>Scrape or collect user data without consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Content and Intellectual Property</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Content</h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of content you post. By posting, you grant SouLVE a worldwide, non-exclusive license to use, display, and distribute your content for platform operations.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Content</h3>
              <p className="text-gray-700 mb-4">
                SouLVE and its logos, design, and features are protected by copyright and trademark laws. You may not copy, modify, or reverse-engineer our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Fundraising and Campaigns</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Campaign creators are responsible for accurate information</li>
                <li>Funds must be used for stated purposes</li>
                <li>SouLVE is not responsible for misuse of funds</li>
                <li>Payment processing fees may apply</li>
                <li>Refunds are subject to campaign creator approval</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Trust and Verification</h2>
              <p className="text-gray-700 mb-4">
                While we implement trust scores and verification systems, SouLVE cannot guarantee the reliability of any user. Exercise caution and good judgment in all interactions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers</h2>
              <p className="text-gray-700 mb-4">
                THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Uninterrupted or error-free service</li>
                <li>Accuracy or completeness of content</li>
                <li>Security from unauthorized access</li>
                <li>Specific outcomes from using the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOULVE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify and hold SouLVE harmless from any claims, damages, or expenses arising from your use of the platform or violation of these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                These terms are governed by the laws of England and Wales. Any disputes will be resolved through binding arbitration or the courts of England and Wales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We may modify these terms at any time. We will notify you of significant changes. Continued use after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms of Service:
              </p>
              <p className="text-gray-700 mb-2">
                Email: <a href="mailto:info@join-soulve.com" className="text-[hsl(var(--soulve-teal))] hover:underline">info@join-soulve.com</a>
              </p>
              <p className="text-gray-700">
                Address: SouLVE, Essex, United Kingdom
              </p>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;