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
    // null is return if there are pages with no loadData function.
    // we will render the page when all promises are resolved, it doesn't matter
    // if one request fails (one single promise reject) we still render the page.
    // If we only use promise.all the page will render at the first request fail
    // and we don't want that.
    const promises = matchRoutes(Routes, req.path)
        .map(({ route }) => {
            return route.loadData ? route.loadData(store) : null;
        })
        .map(promise => {
            if(promise) {
                return new Promise((resolve, reject) => {
                    promise.then(resolve).catch(resolve);
                });
            }
        });

    Promise.all(promises)
        .then(() => {
            const context = {};
            const content = renderer(req, store, context);
            // if NotFoundPage component is rendered it will set notFound to true.
            // will only send 404 if navigate directly to a non existing page, if
            // navigate within app (Link) it is not sending request to server.
            if(context.notFound) {
                res.status(404);
            }

            res.send(content);
        });

}); // allow all routes

app.listen(3000, () => {
   console.log('Listening on port 3000');
});