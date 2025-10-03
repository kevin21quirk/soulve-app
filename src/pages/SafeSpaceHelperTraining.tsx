import { useHelperVerification } from '@/hooks/useHelperVerification';
import { TrainingModuleList } from '@/components/safe-space/training/TrainingModuleList';
import { TrainingModuleViewer } from '@/components/safe-space/training/TrainingModuleViewer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TrainingModule } from '@/types/helperVerification';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SafeSpaceHelperTraining() {
  const navigate = useNavigate();
  const { trainingModules, trainingProgress, loading, completeModule, refetch } = useHelperVerification();
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {!selectedModule && (
          <Button
            variant="ghost"
            onClick={() => navigate('/safe-space/helper')}
            className="mb-6 hover:text-[#0ce4af]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        )}
        {selectedModule ? (
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedModule(null)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Modules
            </Button>
            <TrainingModuleViewer
              module={selectedModule}
              progress={trainingProgress.find(p => p.module_id === selectedModule.id)}
              onComplete={async (moduleId, score, answers) => {
                await completeModule(moduleId, score, answers);
              }}
              onBack={() => {
                setSelectedModule(null);
                refetch();
              }}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Helper Training Program</h1>
              <p className="text-muted-foreground">
                Complete all required modules to become a certified Safe Space Helper
              </p>
            </div>
            <TrainingModuleList
              modules={trainingModules}
              progress={trainingProgress}
              onSelectModule={setSelectedModule}
            />
          </div>
        )}
      </div>
    </div>
  );
}
