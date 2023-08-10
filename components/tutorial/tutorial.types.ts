export type TutorialStepPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'auto';
export type TutorialStepAlignment = 'left' | 'center' | 'right' | 'center';

// An object representing a particular step in the Tutorial flow; each
// step will inform the user of what they can do in the application
export interface TutorialStep {
  id: string;
  message: string;
  position: TutorialStepPosition;
  alignment: TutorialStepAlignment;
  width?: number | string;
  primaryButtonLabel?: string;
  positionPrecedence?: TutorialStepPosition[];
}

// Provide details about where the user is in the Tutorial flow, and
// allow any one step to advance the Tutorial flow
export interface TutorialContextValue {
  inProgress: boolean;
  currentStepIndex: number;
  currentStep: TutorialStep;
  moveToNextStep: () => void;
  skipTutorial: () => void;
}
