import React, { ComponentProps } from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouterProps
} from 'react-router-dom';


import { Dashboard, Page1, Page2, Page3 } from './pages';



const Routes = (props: any ) => (
  <Router>

    { props.children}

    <Switch>
      <Route exact path='/'>
        <Dashboard {...props} />
      </Route>
      <Route exact path='/page1'>
        <Page1 {...props} />
      </Route>
      <Route exact path='/page2'>
        <Page2 {...props} />
      </Route>
      <Route exact path='/page3'>
        <Page3 {...props} />
      </Route>
    </Switch>
  </Router>
)

export default Routes;