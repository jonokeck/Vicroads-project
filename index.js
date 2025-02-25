import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://data-exchange-api.vicroads.vic.gov.au/opendata/variable/freewaytraveltime/v1/traffic";
const API_KEY = "fa5a85b5df4140f1adf6accc16deead7"; // Replace with your actual API key

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Set the view engine
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(API_URL, {
            headers: { 'Ocp-Apim-Subscription-Key': API_KEY }
        });
        const data = response.data;
        const freeways = new Set();

        data.features.forEach(feature => {
            freeways.add(feature.properties.freewayName);
        });

        res.render('index.ejs', { freeways: Array.from(freeways) });
    } catch (error) {
        console.error("Failed to fetch freeway data:", error);
        res.render('index.ejs', { freeways: [] });
    }
});

app.post("/get-estimate", async (req, res) => {
    try {
        const freeway = req.body.freeway; // Get the selected freeway from the form
        const response = await axios.get(API_URL, {
            headers: { 'Ocp-Apim-Subscription-Key': API_KEY }
        });
        const data = response.data;

        // Find the travel time for the selected freeway
        const selectedFreeway = data.features.find(feature =>
            feature.properties.freewayName === freeway
        );

        const travelTime = selectedFreeway ? selectedFreeway.properties.actualTravelTime : 'Not available';

        res.render("index.ejs", {
            freeways: Array.from(new Set(data.features.map(f => f.properties.freewayName))),
            travelTime: travelTime,
            selectedFreeway: poo
        });
    } catch (error) {
        console.log(error.response ? error.response.data : error.message);
        res.status(500).send('An error occurred');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

