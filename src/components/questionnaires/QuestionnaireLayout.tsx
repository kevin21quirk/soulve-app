
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import SouLVELogo from "@/components/SouLVELogo";

interface QuestionnaireLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

const QuestionnaireLayout = ({ title, description, children }: QuestionnaireLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/register" className="inline-flex items-center text-white hover:text-teal-100 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Registration
          </Link>
          <div className="flex items-center justify-center mb-6">
            <SouLVELogo size="small" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-xl text-teal-100">{description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-2xl border-0 border-t-4 border-t-gradient-to-r border-t-teal-600">
          <CardContent className="p-8">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionnaireLayout;
