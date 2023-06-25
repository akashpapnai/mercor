const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv')

dotenv.config();

const URL = process.env.CORS_URL + '/get_result';

const app = express();


const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/FetchTranscript', async (req, res) => {
  try {
    const transcript = req.body['transcript'];
    // Process GPT on transcript
    const bodyData = {
      'question': transcript
    };

    console.log(bodyData);

    let responseData; // Remove const and make it a let variable

    await axios.post(URL, bodyData).then(response => {
      responseData = response.data;
    })
    .catch(error => {
      console.error(error);
    });

    res.status(202).json({ message: responseData });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

app.listen(8008, () => {
  console.log('Backend server is running');
});