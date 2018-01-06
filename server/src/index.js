import 'babel-polyfill'; // make async/await work
import express from 'express';
import { matchRoutes } from 'react-router-config';
import proxy from 'express-http-proxy';
import Routes from './client/Routes';
import renderer from './helpers/renderer';
import createStore from './helpers/createStore';

const app = express();

// sends all requests to /api via proxy.
// OBS: the second arg is for this course only, you don't need it.
app.use('/api', proxy('http://react-ssr-api.herokuapp.com', {
    proxyReqOptDecorator(opts) {
        opts.headers['x-forwarded-host'] = 'localhost:3000';
        return opts;
    }
}));

app.use(express.static('public'));

app.get('*', (req, res) => {
   // passing in req to let createStore to get access to cookie on the request.
   const store = createStore(req);

   //console.log(matchRoutes(Routes, req.path));
   // calls loadData function in our components, passing in server store
   const promises = matchRoutes(Routes, req.path).map(({ route }) => {
      return route.loadData ? route.loadData(store) : null;
   });

   Promise.all(promises)
       .then(() => {
         res.send(renderer(req, store));
       });

}); // allow all routes

app.listen(3000, () => {
   console.log('Listening on port 3000');
});