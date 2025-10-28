import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, FileCheck, BarChart3, AlertTriangle, Lock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import SouLVELogo from "@/components/SouLVELogo";

const ForGovernance = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What UK ESG frameworks does SouLVE support?",
      answer: "We align with all major UK ESG frameworks including Companies Act 2006 section 172 reporting, FRC Corporate Governance Code, Task Force on Climate-related Financial Disclosures (TCFD), and the Modern Slavery Act requirements."
    },
    {
      question: "How does SouLVE help with Charity Commission compliance?",
      answer: "For charities, we provide automated reporting aligned with Charity Commission requirements, including trustee annual reports, public benefit statements, financial summaries, and safeguarding documentation."
    },
    {
      question: "Can trustees access governance dashboards?",
      answer: "Yes, board-level dashboards provide oversight of social impact activities, risk management, policy compliance, and strategic objectives—perfect for trustee meetings and governance reporting."
    },
    {
      question: "Is data stored securely and GDPR compliant?",
      answer: "Absolutely. We're fully GDPR compliant with UK data centres, encryption at rest and in transit, regular security audits, and comprehensive audit trails for all data access and changes."
    },
    {
      question: "Can we export reports for external auditors?",
      answer: "Yes, all reports can be exported in multiple formats (PDF, CSV, Excel) with complete audit trails for external auditors, regulators, and stakeholders."
    },
    {
      question: "Does SouLVE support risk management?",
      answer: "Yes, our platform includes risk registers, safeguarding protocols, incident reporting, and compliance tracking to support your governance framework."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <SEOHead
        title="For Governance & Compliance | ESG Reporting & Regulatory Compliance UK"
        description="Comprehensive ESG compliance and governance platform for UK organisations. Automated reporting, risk management, Charity Commission compliance, and board-level dashboards."
        keywords={["ESG compliance UK", "charity governance", "CSR reporting software", "Companies Act reporting", "Charity Commission compliance", "governance dashboard"]}
        url="https://join-soulve.com/for-governance"
      />
      <FAQSchema faqs={faqs} />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-gray-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-slate-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-6">
            <SouLVELogo size="small" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">For Governance & Compliance</h1>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto">
              Automated ESG reporting, regulatory compliance, and board-level oversight. Meet UK requirements with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
                Request Demo
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
                Download Compliance Guide
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Complete Governance & Compliance Solution</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simplify regulatory compliance with automated reporting, risk management, and transparent audit trails.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="rounded-full bg-slate-100 dark:bg-slate-900/20 p-3 w-fit mb-4">
              <FileCheck className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Automated ESG Reporting</h3>
            <p className="text-sm text-muted-foreground">
              Generate comprehensive ESG reports aligned with Companies Act 2006, FRC Corporate Governance Code, TCFD, and Modern Slavery Act requirements.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 w-fit mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Board-Level Dashboards</h3>
            <p className="text-sm text-muted-foreground">
              Real-time oversight of social impact, risk management, compliance status, and strategic objectives. Perfect for trustee and board meetings.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-fit mb-4">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Charity Commission Compliance</h3>
            <p className="text-sm text-muted-foreground">
              Automated reporting for trustee annual reports, public benefit statements, financial summaries, and safeguarding documentation.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 w-fit mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Risk Management</h3>
            <p className="text-sm text-muted-foreground">
              Integrated risk registers, safeguarding protocols, incident reporting, and compliance tracking to support your governance framework.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 w-fit mb-4">
              <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">GDPR & Data Security</h3>
            <p className="text-sm text-muted-foreground">
              Fully GDPR compliant with UK data centres, encryption, regular security audits, and comprehensive audit trails for all activities.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 w-fit mb-4">
              <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Audit Trail & Transparency</h3>
            <p className="text-sm text-muted-foreground">
              Complete audit trails for all data changes, access logs, and decision records. Export reports for external auditors and regulators.
            </p>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Streamlined Compliance Process</h2>
            <p className="text-muted-foreground">From data collection to regulatory reporting</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-slate-700 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Data Integration</h3>
              <p className="text-sm text-muted-foreground">Automatically collect ESG data from all social impact activities across your organisation.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-slate-700 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Framework Alignment</h3>
              <p className="text-sm text-muted-foreground">Data is automatically mapped to relevant UK ESG frameworks and compliance requirements.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-slate-700 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Report Generation</h3>
              <p className="text-sm text-muted-foreground">Generate comprehensive reports for regulators, boards, and stakeholders with one click.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-slate-700 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-semibold mb-2">Continuous Monitoring</h3>
              <p className="text-sm text-muted-foreground">Real-time compliance dashboards alert you to risks and keep governance on track.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Areas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl font-bold mb-4">UK Compliance Requirements Covered</h2>
            <p className="text-muted-foreground">
              Meet your regulatory obligations with automated reporting and governance tools
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-1 mt-0.5">
                  <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Companies Act 2006</h4>
                  <p className="text-xs text-muted-foreground">Section 172 statements and strategic reports</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-1 mt-0.5">
                  <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">FRC Corporate Governance Code</h4>
                  <p className="text-xs text-muted-foreground">Board oversight and stakeholder engagement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-1 mt-0.5">
                  <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Modern Slavery Act</h4>
                  <p className="text-xs text-muted-foreground">Supply chain transparency statements</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-1 mt-0.5">
                  <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Charity Commission Reporting</h4>
                  <p className="text-xs text-muted-foreground">Trustee annual reports and public benefit</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-1 mt-0.5">
                  <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">TCFD Recommendations</h4>
                  <p className="text-xs text-muted-foreground">Climate-related financial disclosures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-1 mt-0.5">
                  <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">GDPR & Data Protection</h4>
                  <p className="text-xs text-muted-foreground">Data privacy and security compliance</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* FAQ */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-12 text-center bg-gradient-to-r from-slate-700 to-gray-700 text-white">
          <h2 className="text-3xl font-bold mb-4">Simplify Your Governance & Compliance</h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Meet UK regulatory requirements with automated ESG reporting, risk management, and board-level oversight.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
              Request Demo
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
              Speak to Compliance Expert
            </Button>
          </div>
          <p className="text-sm text-slate-200 mt-6">
            ✓ UK compliance ready &nbsp; ✓ Automated reporting &nbsp; ✓ Board dashboards &nbsp; ✓ Full audit trails
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ForGovernance;