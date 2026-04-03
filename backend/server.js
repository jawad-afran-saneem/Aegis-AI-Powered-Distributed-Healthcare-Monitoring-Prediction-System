const express = require('express');
const app = express();
const PORT = 3000;

const patients = [
    {id: 1, name: "stu", age: 45, bp: "120/80", risk: "Low"},
    {id: 2, name: "schmill", age: 60, bp: "140/90", risk: "Medium"}
];

app.get('/health', (req, res) => {
    res.json({status: "OK", message: "Server is running"});
});

app.get('/patients', (req, res) => {
    res.json(patients);
});

app.listen(PORT, () => {
    console.log(Server running on http://localhost:${PORT});
});
