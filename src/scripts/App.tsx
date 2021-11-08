import React from 'react';
import AppHeader from './AppHeader';
import WidgetBoard from './WidgetBoard';

class App extends React.Component {

  render() {
    return (
      <div className="app">
        <AppHeader />
        <WidgetBoard />
      </div>
    );
  }

}

export default App;
