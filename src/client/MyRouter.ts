// MyRouter.tsx
import React from 'react';
import { RouterProps, withRouter } from 'react-router-dom'
import {useClientRouting} from '@shopify/app-bridge-react';


function MyRouter(props: RouterProps) {  
  const {history} = props;
  useClientRouting(history);
  return null;
}


export default withRouter(MyRouter);