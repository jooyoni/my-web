import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import App from './App';



const client=new QueryClient();
ReactDOM.render(
  <React.StrictMode>
      <RecoilRoot>
        <QueryClientProvider client={client}>
            <App />
        </QueryClientProvider>
      </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'));