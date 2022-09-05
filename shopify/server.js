const ronin = require('ronin-server');
const server = ronin.server();
const { MongoClient } = require('mongodb');

MongoClient.connect( process.env.CONNECTIONSTRING, { useUnifiedTopology: true })
	.then(client => {
		console.log("connected to database");
		const db = client.db('proxy');
		server.use( '/contact', (req, res) => {
			//console.log(req.body);
			const userCollection = db.collection('contacts');
			userCollection.insertOne(req.body)
				.then(result => {
					console.log(result);
					res.status(200).send(result);	
				})
				.catch(error => console.error(error))
		});
		server.start()
	})
	.catch(console.error);

