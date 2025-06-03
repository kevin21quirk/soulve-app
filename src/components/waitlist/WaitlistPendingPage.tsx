
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, Users, CheckCircle } from 'lucide-react';

const WaitlistPendingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-12 w-12 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              SouLVE
            </h1>
          </div>
          
          <div className="bg-gradient-to-r from-teal-100 to-blue-100 p-6 rounded-lg">
            <Clock className="h-12 w-12 text-teal-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're on the Waitlist!</h2>
            <p className="text-gray-600">
              Thank you for signing up for SouLVE. Your account is currently being reviewed by our team.
            </p>
          </div>
        </div>

        {/* Status Card */}
        <Card className="border-2 border-teal-200">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
            <CardTitle className="flex items-center space-x-2 text-teal-700">
              <Users className="h-5 w-5" />
              <span>Application Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-teal-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">Pending Review</span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Our team is carefully reviewing applications to ensure we maintain a high-quality community. 
                  You'll receive an email notification once your application has been processed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900">
              <CheckCircle className="h-5 w-5 text-teal-600" />
              <span>What Happens Next?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-teal-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Review Process</h4>
                  <p className="text-sm text-gray-600">
                    Our team will review your application within 24-48 hours
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-teal-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Email Notification</h4>
                  <p className="text-sm text-gray-600">
                    You'll receive an email confirmation once approved
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-teal-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Dashboard Access</h4>
                  <p className="text-sm text-gray-600">
                    Start building meaningful connections and making an impact
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <Mail className="h-8 w-8 text-teal-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">Questions?</h3>
              <p className="text-sm text-gray-600">
                If you have any questions about your application status, feel free to reach out to our team.
              </p>
              <p className="text-sm font-medium text-teal-600">
                support@soulve.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaitlistPendingPage;
