import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/lightBlue';




import './index.css';
import App from './App';
import store from './store'

const theme = createTheme({
  palette: {
      primary: { light: lightBlue[300], main: lightBlue[500], dark: lightBlue[700] },
      secondary: { light: lightBlue[300], main: lightBlue[500], dark: lightBlue[700] },
  }
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
      </MuiThemeProvider>
  </Provider>,
    document.getElementById('root')
);
