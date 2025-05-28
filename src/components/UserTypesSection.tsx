
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UserTypesSection = () => {
  const userTypes = [
    {
      title: "Community Members",
      description: "Request help when you need it, offer support when you can. Build meaningful connections in your neighbourhood.",
      audience: "Individuals seeking or offering help"
    },
    {
      title: "Businesses & CSR",
      description: "Amplify your corporate social responsibility initiatives and connect directly with community needs.",
      audience: "Companies looking to make measurable impact"
    },
    {
      title: "Charities & Organisations",
      description: "Expand your reach, connect with volunteers, and track your impact across communities.",
      audience: "Non-profits and community groups"
    },
    {
      title: "Community Leaders",
      description: "Lead initiatives, coordinate responses, and build stronger, more connected communities.",
      audience: "Local leaders and activists"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-grey-50 to-teal-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-centre mb-16">
          <h2 className="text-4xl font-bold text-grey-900 mb-4">Built for Everyone Who Cares</h2>
          <p className="text-xl text-grey-600 max-w-2xl mx-auto">
            Whether you're looking to help or need support, SouLVE creates meaningful connections across all communities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {userTypes.map((type, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg text-grey-900">{type.title}</CardTitle>
                <CardDescription className="text-sm text-teal-600 font-medium">
                  {type.audience}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-grey-600 leading-relaxed">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserTypesSection;
