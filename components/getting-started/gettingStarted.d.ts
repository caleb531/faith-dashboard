// An object representing a particular step in the Getting Started flow; each
// step will inform the user of what they can do in the application
export interface GettingStartedStep {
  id: string;
  message: string;
  position: 'top' | 'bottom';
  alignment: 'left' | 'center' | 'right';
}

// Provide details about where the user is in the Getting Started flow, and
// allow any one step to advance the Getting Started flow
interface GettingStartedContextValue {
  inProgress: boolean;
  currentStep: GettingStartedStep;
  moveToNextStep: () => void;
}
