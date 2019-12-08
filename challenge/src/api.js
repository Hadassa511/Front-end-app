import polka from 'polka';
import send from '@polka/send-type';
import datastore from 'nedb-promise';
import { createReadStream } from 'fs';

import rawMigrographData from '../data/data';

const db = datastore({ filename: 'local-db', autoload: true });

const startup = async () => {
	// Generate 20 times the original data to simulate a larger dataset
	const numDocs = await db.count({});
	const datasetSize = rawMigrographData.length;
	const multiple = 20;
	console.log(`Found ${numDocs} existing documents`);
	if (numDocs !== datasetSize * multiple) {
		const numRemoved = await db.remove({}, { multi: true });
		console.log(`Removed ${numRemoved} documents`);
		const now = new Date();
		const docs = [];
		for (let i = 0; i < (datasetSize * multiple); i++) {
			const m = Object.assign({}, rawMigrographData[i % datasetSize]);
			m.uid = i + 1;
			m.createdAt = now;
			// console.log(m);
			docs.push(m);
		}
		await db.insert(docs);
	}
}

// Run every time the server starts
(async () => {
	startup();
})();

const api = polka();

// Log incoming requests
const logger = (req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()}: ${req.method} -> ${req.url}`);
  next();
};

api.use(logger);

// Return data based on query parameters entered
api.get('/query', async (req, res) => {
    // query params:
    // sortBy (text - sort by a particular column)
    // desc (boolean - true if descending order)
    // skip (number)
    // limit (number)
    const skip = req.query.skip || null;
    const limit = req.query.limit || null;
    const data = await db.cfind({},{_id:0,accepted:0,createdAt:0,ctf_fit_cc:0,phase_shift_deg:0})
        .sort({ [req.query.sortBy || 'uid']: req.query.desc === 'true' ? -1 : 1 })
        .skip(skip)
        .exec();
    // Bug with nedb-promise skip + limit, therefore manually slice
  send(res, 200, { success: true, data: limit !== null ? data.slice(0, limit) : data });
});

// Return various averages across the micrographs in the database
api.get('/averages', async (_, res) => {
	const data = await db.find({});
	const averages = {
		motion_curvature: (data.map(d => d.motion_curvature).reduce((a, b) => (a + b)) / data.length),
		ctf_fit_to_A: (data.map(d => d.ctf_fit_to_A).reduce((a, b) => (a + b)) / data.length),
		pick_ncc_median: (data.map(d => d.pick_ncc_median).reduce((a, b) => (a + b)) / data.length),
		num_particles: (data.map(d => d.num_particles).reduce((a, b) => (a + b)) / data.length),
		pick_pow_median: (data.map(d => d.pick_pow_median).reduce((a, b) => (a + b)) / data.length),
		df_ast: (data.map(d => d.df_ast).reduce((a, b) => (a + b)) / data.length),
		motion_total_pix: (data.map(d => d.motion_total_pix).reduce((a, b) => (a + b)) / data.length),
	};
  send(res, 200, { success: true, data: averages });
});

// Return the total count of documents in the database
api.get('/count', async (_, res) => {
	const data = await db.count({});
  send(res, 200, { success: true, data });
});

// Return an image corresponding to the filename query param
api.get('/image', async (req, res) => {
	// query params:
	// filename (string - corresponds to the fname of a micrograph)
	const filename = req.query.filename;
	if (filename) {
		let file = createReadStream(`./data/${filename}.png`);
  	send(res, 206, file, { 'Content-Type': 'image/png' });
	} else {
		send(res, 400, { success: false, data: "Invalid parameters" });
	}
});

// Utility: Return all documents
api.get('/all', async (req, res) => {
	const data = await db.cfind({}).sort({ uid: 1 }).exec();
  send(res, 200, { success: true, data });
});

// Utility: Clear the database
api.get('/clear', async (_, res) => {
	const data = await db.remove({}, { multi: true });
  send(res, 200, { success: true, data });
});

// Return a random integer to populate a timeseries plot
api.get('/random', async (_, res) => {
	const data = Math.floor(Math.random() * (2000 - 100 + 1)) + 100;
  send(res, 200, { success: true, data });
});

export default api;
