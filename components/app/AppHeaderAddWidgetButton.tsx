import React, { useState } from 'react';
import AddWidgetButton from '../generic/AddWidgetButton';
import GettingStartedMessage from '../getting-started/GettingStartedMessage';
import useGettingStartedStep from '../getting-started/useGettingStartedStep';
import WidgetPicker from '../widget-picker/WidgetPicker';

function AppHeaderAddWidgetButton() {
  const { isCurrentStep, gettingStartedStepProps } = useGettingStartedStep('add-widget');
  const [widgetPickerIsOpen, setWidgetPickerIsOpen] = useState(false);
  return (
    <div className="app-header-add-widget-wrapper">
      <AddWidgetButton
        onPressButton={() => setWidgetPickerIsOpen(true)}
        buttonProps={gettingStartedStepProps} />
      <GettingStartedMessage isCurrentStep={isCurrentStep} />
      {widgetPickerIsOpen ? (
        <WidgetPicker onCloseWidgetPicker={() => setWidgetPickerIsOpen(false)} />
      ) : null}
    </div>
  );
}

export default AppHeaderAddWidgetButton;