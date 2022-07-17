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
  function actionResult(event: React.UIEvent): void {
    const actionedElement = event.target as HTMLElement;
    const resultElement = actionedElement.closest('.result');
    /* istanbul ignore next */
    if (!resultElement) {
      return;
    }
    const resultId = resultElement.getAttribute('data-result-id');
    const result = results.find((result) => result.id === resultId);
    /* istanbul ignore next */
    if (!result) {
      return;
    }
    onChooseResult(result);
  }

  function clickResult(event: React.MouseEvent) {
    actionResult(event);
  }

  function keydownResult(event: React.KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      actionResult(event);
    }
  }

  return (
    <ol className="result-list" onClick={clickResult} onKeyDown={keydownResult}>
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
