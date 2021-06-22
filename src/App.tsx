import { BrowserRouter, Route } from 'react-router-dom';
import AppThemeContextProvider from "./context/AppTheme";
import AuthContextProvider from "./context/Auth";
import Home from "./pages/Home";
import NewRoom from "./pages/NewRoom";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <AppThemeContextProvider>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
        </AppThemeContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
