import React from 'react';
import { Result } from './resultList.d';

// A generic result list to be used within any widget and which can contain any
// list of data (search results or otherwise)
type Props = {
  results: Result[];
  onChooseResult: (result: Result) => void;
};

function ResultList({ results, onChooseResult }: Props) {
  // Use event delegation to determine which result was clicked
  function actionResult<T extends React.UIEvent>(event: T): void {
    const clickedElement = event.target as HTMLElement;
    const resultElement = clickedElement.closest('.result');
    if (!resultElement) {
      return;
    }
    const resultId = resultElement.getAttribute('data-result-id');
    const result = results.find((result) => result.id === resultId);
    if (!result) {
      return;
    }
    onChooseResult(result);
  }

  return (
    <ol
      className="result-list"
      onClick={(event) => actionResult<React.MouseEvent>(event)}
      onKeyPress={(event) => actionResult<React.KeyboardEvent>(event)}
    >
      {results.map((result: Result) => {
        return (
          <li
            className="result"
            key={result.id}
            data-result-id={result.id}
            tabIndex={0}
          >
            <h3 className="result-title">{result.title}</h3>
            <span className="result-subtitle">{result.subtitle}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default ResultList;
