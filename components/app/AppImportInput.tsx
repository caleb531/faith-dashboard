import { readDashboardFileToJSON } from '@components/importExportUtils';
import React, { useContext } from 'react';
import SessionContext from './SessionContext';
import { AppState } from './app.types';

type Props = {
  id: string;
  onImportSuccess: (newApp: AppState) => void;
};

const AppImportInput = ({ id, onImportSuccess }: Props) => {
  const { isSignedIn } = useContext(SessionContext);

  async function handleFileInputChange(
    event: React.FormEvent<HTMLInputElement>
  ) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput?.files?.length) {
      return;
    }
    try {
      const newApp = await readDashboardFileToJSON(fileInput.files[0]);
      if (
        isSignedIn ||
        confirm(
          'This will overwrite your current dashboard. Are you sure you want to continue?'
        )
      ) {
        onImportSuccess(newApp);
      }
    } catch (error) {
      alert(
        error instanceof Error && error.message
          ? error.message
          : 'An error occurred while uploading the file. Please try again.'
      );
    } finally {
      // Always reset file input for any subsequent imports
      fileInput.value = '';
    }
  }

  return (
    <input
      id={id}
      name="app_import_input"
      type="file"
      accept=".json"
      className="app-import-input accessibility-only"
      onChange={handleFileInputChange}
    />
  );
};

export default AppImportInput;
