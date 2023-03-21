import express from 'express';
import expressHandlebars from 'express-handlebars';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';


let mongoClient = new mongodb.MongoClient('mongodb://localhost:27017/', {
    useUnifiedTopology: true
});
const handlebars = expressHandlebars.create({
	defaultLayout: 'main', 
	extname: 'hbs'
});
let app = express();
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(bodyParser());
mongoClient.connect(async (error, mongo)=>{
	if (!error) {
		let db = mongo.db('quote');
		let coll = db.collection('quote');		
		// let res = await coll.find().toArray();
		// console.log(res);
		app.get('/admin/', (req, res)=>{
			req.render('admin')
		})
		app.post('/admin/',async (req, res)=>{
			let text = req.body
			let date = req.body
			console.log(text)
			console.log(date)
			await coll.insertOne(text, date)
			res.redirect('/users');
		})
		app.get('/users', async (req, res)=>{
			let date = new Date().toLocaleDateString('en-ca');
			console.log(date)
			let quote = await coll.find({date: date}).toArray()
			console.log(quote)
			res.render('users', {coll: quote})
		})
	} else {
		console.error(err);
	}
});
app.get('/admin/', (req, res)=>{
	res.render('adminka', {
	hello: 'Hello pompon',
	layout : 'admin',
})
})
app.listen(3333, ()=>{
    console.log('Running')
})