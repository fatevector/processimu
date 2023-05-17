import { Redirect, Route, Switch } from "react-router-dom";

import NavBar from "./app/components/ui/navBar";
import Main from "./app/components/layout/main";
import Auth from "./app/components/layout/auth";
import LogOut from "./app/components/layout/logOut";
import ModelCreation from "./app/components/layout/modelCreation";
import ModelsList from "./app/components/layout/modelsList";

function App() {
    return (
        <div className="App">
            <NavBar />
            <Switch>
                <Route exact path="/" component={Main} />
                <Route exact path="/login/:type?" component={Auth} />
                <Route exact path="/logout" component={LogOut} />
                <Route
                    exact
                    path="/edit/new"
                    component={() => <ModelCreation newFlag={true} />}
                />
                <Route
                    exact
                    path="/edit/:modelId"
                    component={() => <ModelCreation newFlag={true} />}
                />
                <Route exact path="/models/:modelId?" component={ModelsList} />
                <Redirect to="/" />
            </Switch>
        </div>
    );
}

export default App;
