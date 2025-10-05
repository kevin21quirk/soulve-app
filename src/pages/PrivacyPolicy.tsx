import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground">
                SouLVE ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform. We comply with GDPR, CCPA, and other applicable data protection regulations.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mt-4 mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Name, email address, and username</li>
                <li>Profile information (bio, location, avatar)</li>
                <li>Organization affiliations and roles</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2">Usage Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on the Platform</li>
                <li>Interactions with campaigns and content</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2">Cookies and Tracking</h3>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to track activity on our Platform and store certain information. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>To provide and maintain our Platform</li>
                <li>To process your transactions and manage campaigns</li>
                <li>To send you notifications and updates</li>
                <li>To improve our services and user experience</li>
                <li>To detect and prevent fraud and abuse</li>
                <li>To comply with legal obligations</li>
                <li>To generate ESG reports and analytics</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Legal Basis for Processing (GDPR)</h2>
              <p className="text-muted-foreground mb-2">We process your personal data based on:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><strong>Consent:</strong> You have given clear consent for processing</li>
                <li><strong>Contract:</strong> Processing is necessary to fulfill our Terms of Service</li>
                <li><strong>Legal Obligation:</strong> We must comply with legal requirements</li>
                <li><strong>Legitimate Interest:</strong> Processing is necessary for our legitimate business interests</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground mb-2">We may share your information with:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><strong>Service Providers:</strong> Third-party vendors who assist in operating the Platform</li>
                <li><strong>Organizations:</strong> When you join an organization, your profile may be visible to organization members</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                <li><strong>Campaign Creators:</strong> When you donate to campaigns, creators may see your donation details</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Your Data Protection Rights (GDPR)</h2>
              <p className="text-muted-foreground mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Restrict Processing:</strong> Request restriction of processing your data</li>
                <li><strong>Data Portability:</strong> Request transfer of your data</li>
                <li><strong>Object:</strong> Object to our processing of your data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                To exercise these rights, please contact us at privacy@soulve.com
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it for legal or regulatory purposes.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your data, including encryption, access controls, and regular security assessments. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and maintained on servers located outside your jurisdiction. We ensure appropriate safeguards are in place for such transfers in compliance with GDPR and other applicable laws.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our Platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. For material changes, we will provide prominent notice or obtain consent where required by law.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Contact Us</h2>
              <p className="text-muted-foreground mb-2">
                If you have questions about this Privacy Policy or wish to exercise your data protection rights, please contact us at:
              </p>
              <ul className="list-none space-y-1 text-muted-foreground ml-4">
                <li>Email: privacy@soulve.com</li>
                <li>Data Protection Officer: dpo@soulve.com</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
