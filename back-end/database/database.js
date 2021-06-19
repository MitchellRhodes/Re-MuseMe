const pgp = require('pg-promise')();


const db = pgp({
    ssl: {
		rejectUnauthorized: false
	}
});

const initialize = async () => {


    const res = await db.oneOrNone('SELECT $1::text as message', ['Database connected']);
    console.log(res);

};

//use async functions so everything happens outside of node. Async and await lets node stop and wait for postgres to do its thing, and when postgres finishes, node then gets it and finishes.
//every time there is an await node is off serving other requests. 

exports.db = db;
exports.initialize = initialize;