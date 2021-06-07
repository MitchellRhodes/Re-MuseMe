const { Client } = require('pg');
const client = new Client();

const initialize = async () => {

    await client.connect();

    const res = await client.query('SELECT $1::text as message', ['Database connected']);
    console.log(res.rows[0].message);
    await client.end();

};

//use async functions so everything happens outside of node. Async and await lets node stop and wait for postgres to do its thing, and when postgres finishes, node then gets it and finishes.
//every time there is an await node is off serving other requests. 


exports.initialize = initialize;