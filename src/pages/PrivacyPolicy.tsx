import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | SouLVE - Your Data Protection Rights</title>
        <meta name="description" content="Learn how SouLVE collects, uses, and protects your personal information. Read our comprehensive privacy policy." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Hero Section with Gradient */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-xl text-teal-100">
                Your data protection rights and how we handle your information
              </p>
            </div>
          </div>
        </section>
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                SouLVE ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Name and email address</li>
                <li>Profile information (avatar, bio, location)</li>
                <li>Account credentials</li>
                <li>Communication preferences</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Usage Data</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Device information and IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Interactions with other users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>To provide and maintain our service</li>
                <li>To facilitate community connections</li>
                <li>To send important notifications and updates</li>
                <li>To improve user experience</li>
                <li>To ensure platform security and prevent fraud</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not sell your personal information. We may share your information only in these circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                <li><strong>Service Providers:</strong> With trusted third-party services that help us operate (e.g., hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your data, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage with Supabase</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">Under GDPR and UK data protection laws, you have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, contact us at <a href="mailto:privacy@join-soulve.com" className="text-[hsl(var(--soulve-teal))] hover:underline">privacy@join-soulve.com</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information only as long as necessary for the purposes outlined in this policy or as required by law. When you delete your account, we will delete or anonymize your data within 30 days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use essential cookies for authentication and platform functionality. For details, see our <a href="/cookie-policy" className="text-[hsl(var(--soulve-teal))] hover:underline">Cookie Policy</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                SouLVE is not intended for users under 16. We do not knowingly collect data from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy periodically. We will notify you of significant changes via email or platform notification. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                For privacy-related questions or concerns:
              </p>
              <p className="text-gray-700 mb-2">
                Email: <a href="mailto:privacy@join-soulve.com" className="text-[hsl(var(--soulve-teal))] hover:underline">privacy@join-soulve.com</a>
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

export default PrivacyPolicy;