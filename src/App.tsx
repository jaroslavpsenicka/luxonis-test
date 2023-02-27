import { lazy, Suspense } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { Route, Switch } from 'react-router';

import { DataProvider } from './contexts/DataContext'

import { Header } from './components/Header'
import { Footer } from "./components/Footer";

export default function App() {

  const MainPage = lazy(() => import(/* webpackChunkName: "pages" */ './pages/Main'));
  const NoPage = lazy(() => import(/* webpackChunkName: "pages" */ './pages/NoPage'));

  return (
    <DataProvider>
      <Suspense fallback={<div className="loading-wallpaper" /> }>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route path="/" exact component={MainPage} />
            <Route path="/404" exact component={NoPage} />
            <Redirect to="/404" />
          </Switch>
        </BrowserRouter>
      </Suspense>
    </DataProvider>
  )

}
