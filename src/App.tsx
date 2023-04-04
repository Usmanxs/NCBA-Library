import { Component, createSignal } from 'solid-js';
import { useRoutes } from 'solid-app-router';
import { routes } from './route';

const App: Component = () => {
  const Route = useRoutes(routes);
  return (
    <>
    <Route />
    </>   
  );
};

export default App;
