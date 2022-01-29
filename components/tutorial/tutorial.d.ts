type TutorialStepPosition = 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto';
type TutorialStepAlignment = 'left' | 'center' | 'right' | 'center';

// An object representing a particular step in the Tutorial flow; each
// step will inform the user of what they can do in the application
export interface TutorialStep {
  id: string;
  message: string;
  position: TutorialStepPosition;
  alignment: TutorialStepAlignment;
  width?: number | string;
  primaryButtonLabel?: string;
}

// Provide details about where the user is in the Tutorial flow, and
// allow any one step to advance the Tutorial flow
interface TutorialContextValue {
  inProgress: boolean;
  currentStepIndex: number;
  currentStep: TutorialStep;
  moveToNextStep: () => void;
  skipTutorial: () => void;
}
