import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AppThemeContextProvider from "./context/AppTheme";
import AuthContextProvider from "./context/Auth";
import ToastContextProvider from "./context/Toast";
import ModalContextProvider from "./context/Modal";
import Home from "./pages/Home";
import NewRoom from "./pages/NewRoom";
import Room from './pages/Room';
import AdminRoom from './pages/AdminRoom';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <AppThemeContextProvider>
          <ToastContextProvider>
            <ModalContextProvider>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/rooms/new" component={NewRoom} />
                <Route path="/rooms/admin/:id" component={AdminRoom} />
                <Route path="/rooms/:id" component={Room} />
              </Switch>
            </ModalContextProvider>
          </ToastContextProvider>
        </AppThemeContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
