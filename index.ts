import axios from "axios";
import fs = require('fs');

let fileContent: string  = fs.readFileSync('config.json', 'utf8');
let configJSON: any = JSON.parse(fileContent);
const TOKEN: String = configJSON.token;