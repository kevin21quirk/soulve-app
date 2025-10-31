import { useTutorial } from './TutorialProvider';
import { TutorialStep } from './TutorialStep';
import { TutorialSpotlight } from './TutorialSpotlight';
import { AnimatePresence, motion } from 'framer-motion';

export function TutorialOverlay() {
  const { isActive, currentStep, steps } = useTutorial();

  if (!isActive || !steps[currentStep]) return null;

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Dark overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[100]"
            style={{ pointerEvents: 'none' }}
          />

          {/* Spotlight effect */}
          {step.targetElement && <TutorialSpotlight targetSelector={step.targetElement} />}

          {/* Tutorial step card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-8 right-8 z-[101] w-[400px] max-w-[calc(100vw-4rem)]"
          >
            <TutorialStep step={step} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
