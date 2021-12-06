import React from 'react';
import { Result } from '../types.d';

// A generic result list to be used within any widget and which can contain any
// list of data (search results or otherwise)
function ResultList({ results, onChooseResult }: { results: Result[], onChooseResult: (result: Result) => void }) {

  // Use event delegation to determine which result was clicked
  function clickResult(event: React.MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    const resultElement = clickedElement.closest('.result');
    const resultId = resultElement.getAttribute('data-result-id');
    const result = results.find((result) => result.id === resultId);
    onChooseResult(result);
  }

  return (
    <ol className="result-list" onClick={clickResult}>
      {results.map((result: Result) => {
        return (
          <li className="result" key={result.id} data-result-id={result.id}>
            <h3 className="result-title">{result.title}</h3>
            <span className="result-subtitle">{result.subtitle}</span>
          </li>
        );
      })}
    </ol>
  );

}

export default ResultList;
