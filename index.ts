import { Promise } from 'es6-promise';
import moment from "moment";
import axios from "axios";
import fs = require('fs');

interface listNesetedResource {
    "id": string,
    "name": string,
    "lists": Array<listMinimalData>
}

interface listMinimalData {
    "id": string,
    "name": string,
    "closed": boolean,
    "pos": number
}

let fileContent: string = fs.readFileSync('config.json', 'utf8');
let configJSON: any = JSON.parse(fileContent);

const trelloREST = axios.create({
    baseURL: "https://api.trello.com/1/",
    params: {
        "key": configJSON.KEY,
        "token": configJSON.TOKEN
    }
});


// Create a list with the current month's name if it does not exist.

let monthName: string = moment.months()[moment().month()]
let data: object = {};



function createListIfDNE(inBoard: string, listName: string) {
    return new Promise(
        (resolve, reject) => {
            getLists(inBoard).then(
                listData => {

                    for (var x of (listData.data as Array<listNesetedResource>)){
                        console.log(`name ${x.name}, listName ${listName}, name === listName = ${x.name === listName}`)
                        if (x.name === listName) {
                            return resolve(x.id);
                        }
                    }
                    // If the list does not contain the list, create the list.
                    createList({
                        "name": listName,
                        "idBoard": inBoard,
                        "pos": 'top'
                    }).then(
                        data => resolve(data.data.id),
                        err => reject(err.data)
                    )
                },
                err => {
                    reject(err)
                }
            )
        }
    )
}

function getBoardData(boardID: string): Promise<any> {
    return makeGetRequestFromEndPoint(`/boards/${boardID}`);
}


function getLists(boardID: string): Promise<any> {
    return makeGetRequestFromEndPoint(`/boards/${boardID}/lists`)
}

function createList(data: object) {
    return makePostRequestToEndPoint(`/lists`, data);
}

function makeGetRequestFromEndPoint(endpoint: string): Promise<any> {
    return new Promise(
        (resolve, reject) => {
            trelloREST
                .get(endpoint)
                .then(
                    data => {
                        resolve(data)
                    },
                    err => {
                        reject(err)
                    }
                )
        }
    )
}


function makePostRequestToEndPoint(endPoint:string, data: object) : Promise<any>{
    return new Promise(
        (resolve, reject) => {
            trelloREST
                .post(endPoint, data)
                .then(
                    data => {
                        resolve(data)
                    },
                    err => {
                        reject(err)
                    }
                )
        }
    )
}

function createListWithNameOfMonth(boardID:string) : Promise<any>{
    return createListIfDNE(boardID, moment.months()[moment().month()])
}

function createDatedCard(listID: string) : Promise<any>{
    let cardData = { 
        name: `Day ${moment().date()}`, 
        desc: "Bro enter a quote here, and make the day lit.🔥",
        pos: "top",
        idList: listID
    }
    return new Promise(
        (resolve, reject) => {
            return makePostRequestToEndPoint(`/cards`, cardData).then(
                data => resolve(data.data.id),
                err => reject(err.data)
            )
        }
    )
}

function createCheckList(checkListName:string, cardID: string) {
    return new Promise(
        (resolve, reject) => {
            makePostRequestToEndPoint(`/checklists`, {
                idCard: cardID,
                name: checkListName
            }).then(
                x => resolve(x.data.id)
            )
        }
    )
}


function createBasicCheckLists(cardID: string) {
    let checklistIDs = {}
    let checkListNames = ["Essentials 😬", "Readings 📚", "Readings 💻", "Jobs 👨‍🔬"]
    let checkListPromises = checkListNames.map(
        x => createCheckList(x, cardID)
    )

    return new Promise(
        (resolve, reject) => {
            Promise.all(checkListPromises).then(
                values => {
                    resolve(values)
                }
            )
        }
    )

}
