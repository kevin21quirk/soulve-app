import { HelperApplicationForm } from '@/components/safe-space/verification/HelperApplicationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, Users, Clock } from 'lucide-react';

const SafeSpaceHelperApplication = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Become a Safe Space Helper</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our community of verified helpers providing compassionate support to those in need
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm">Verified & Trusted</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Comprehensive verification process
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm">Make Impact</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Support people during difficult times
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm">Join Community</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Connect with fellow helpers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold text-sm">Flexible Schedule</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Help on your own terms
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
            <CardDescription>
              What you'll need to complete your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>At least 18 years old with relevant experience in counseling, mental health, social work, or related fields</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>2-3 professional references who can vouch for your character and abilities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Government-issued ID and proof of address for identity verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>DBS certificate (or equivalent background check) - we can guide you through the process</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Commitment to complete our training program (approximately 4-5 hours)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Availability to help at least a few hours per week</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Application Form */}
        <HelperApplicationForm />
      </div>
    </div>
  );
};

export default SafeSpaceHelperApplication;
