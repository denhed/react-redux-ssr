import 'babel-polyfill'; // make async/await work
import express from 'express';
import { matchRoutes } from 'react-router-config';
import Routes from './client/Routes';
import renderer from './helpers/renderer';
import createStore from './helpers/createStore';

const app = express();

app.use(express.static('public'));

app.get('*', (req, res) => {
   const store = createStore();

   //console.log(matchRoutes(Routes, req.path));
   // calls loadData function in our components
   matchRoutes(Routes, req.path).map(({ route }) => {
      return route.loadData ? route.loadData() : null;
   });

   res.send(renderer(req, store));
}); // allow all routes

app.listen(3000, () => {
   console.log('Listening on port 3000');
});