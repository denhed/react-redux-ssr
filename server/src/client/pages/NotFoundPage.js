import React from 'react';

const NotFoundPage = ({ staticContext = {} }) => {

    // server will check this value and send status(404).
    staticContext.notFound = true;

    return <h1>Ooops, route not found.</h1>
};

export default {
    component: NotFoundPage
};