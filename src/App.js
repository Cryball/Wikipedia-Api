import './App.css';
import React from 'react';
import WikiSearch from './WikiSearch'
import { store } from "./actions/store"
import { Provider } from "react-redux";
import DCandidates from "./components/DCandidates";
import { ToastProvider } from "react-toast-notifications"



function App() {
  return (
    <Provider store={store}>
      <ToastProvider autoDismiss={true}>
        <h1>Wanna use my API?</h1>
        <DCandidates />
      </ToastProvider>
      <div>
        <h1>Or wiki search?</h1>
        <WikiSearch />
      </div>
    </Provider>
  );
}


export default App;