import React from 'react';
import { renderToString } from 'react-dom/server';
import Home from '../client/components/Home';

export default () => {
    const content = renderToString(<Home />);

    // tell browser to go back till express and get public bundle.js
    return `
      <html>
         <head></head>
         <body>
            <div id="root">${content}</div>
            <script src="bundle.js"></script>
         </body>
      </html>
   `;
};
