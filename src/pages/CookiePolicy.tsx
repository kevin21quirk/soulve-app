import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | SouLVE - How We Use Cookies</title>
        <meta name="description" content="Learn about the cookies SouLVE uses and how they help improve your experience on our platform." />
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
              <p className="text-xl text-teal-100">
                How we use cookies to improve your experience
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">
                SouLVE uses cookies for the following purposes:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Essential Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies are necessary for the platform to function. They enable:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>User authentication and login sessions</li>
                <li>Security features and fraud prevention</li>
                <li>Platform functionality and navigation</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Preference Cookies</h3>
              <p className="text-gray-700 mb-4">
                These remember your choices and preferences:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Language and regional settings</li>
                <li>Theme preferences (light/dark mode)</li>
                <li>Display settings and layout choices</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Analytics Cookies</h3>
              <p className="text-gray-700 mb-4">
                These help us understand how users interact with our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Pages visited and features used</li>
                <li>Time spent on the platform</li>
                <li>User journey and navigation patterns</li>
                <li>Error tracking and performance monitoring</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                We may use services from trusted third parties that set cookies, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Supabase:</strong> For authentication and database services</li>
                <li><strong>Analytics Providers:</strong> To understand platform usage</li>
              </ul>
              <p className="text-gray-700 mb-4">
                These third parties have their own privacy policies and cookie practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookie Duration</h2>
              <p className="text-gray-700 mb-4">
                We use both session and persistent cookies:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain for a set period (typically 30-365 days) to remember your preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Managing Cookies</h2>
              <p className="text-gray-700 mb-4">
                You have control over cookies:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Browser Settings</h3>
              <p className="text-gray-700 mb-4">
                Most browsers allow you to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>View and delete cookies</li>
                <li>Block all or third-party cookies</li>
                <li>Clear cookies when closing the browser</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Impact of Blocking Cookies</h3>
              <p className="text-gray-700 mb-4">
                If you block essential cookies, some platform features may not work properly:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>You may not be able to log in</li>
                <li>Your preferences won't be saved</li>
                <li>Some features may become unavailable</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookie List</h2>
              <p className="text-gray-700 mb-4">
                Here are the main cookies used by SouLVE:
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 border-b text-left">Cookie Name</th>
                      <th className="px-4 py-2 border-b text-left">Purpose</th>
                      <th className="px-4 py-2 border-b text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border-b">sb-access-token</td>
                      <td className="px-4 py-2 border-b">Authentication</td>
                      <td className="px-4 py-2 border-b">Session</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">sb-refresh-token</td>
                      <td className="px-4 py-2 border-b">Session refresh</td>
                      <td className="px-4 py-2 border-b">30 days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b">theme_preference</td>
                      <td className="px-4 py-2 border-b">Theme settings</td>
                      <td className="px-4 py-2 border-b">365 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Updates to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Cookie Policy to reflect changes in our practices or for legal reasons. We will notify you of significant changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                For questions about our use of cookies:
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

export default CookiePolicy;