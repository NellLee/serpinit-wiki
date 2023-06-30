"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const app = (0, express_1.default)();
const PORT = 3000;
app.use('/', (req, res) => {
    // Read and parse the XML file
    const xml = (0, fs_1.readFileSync)('timeline.xml', 'utf-8');
    parseAndValidateXML(xml)
        .then((validatedObject) => {
        console.log(validatedObject);
    })
        .catch((error) => {
        console.error(error);
    });
});
app.use(express_1.default.static(__dirname + '/public'));
app.listen(PORT, () => {
    console.log('Server running on: http://localhost:' + PORT);
});
