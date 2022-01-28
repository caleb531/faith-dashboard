type GettingStartedStepPosition = 'top' | 'bottom' | 'left' | 'right' | 'middle' | 'auto';

// An object representing a particular step in the Getting Started flow; each
// step will inform the user of what they can do in the application
export interface GettingStartedStep {
  id: string;
  message: string;
  position: GettingStartedStepPosition;
  alignment: 'left' | 'center' | 'right';
  width?: number | string;
  primaryButtonLabel?: string;
}

// Provide details about where the user is in the Getting Started flow, and
// allow any one step to advance the Getting Started flow
interface GettingStartedContextValue {
  inProgress: boolean;
  currentStepIndex: number;
  currentStep: GettingStartedStep;
  moveToNextStep: () => void;
  skipGettingStarted: () => void;
}
