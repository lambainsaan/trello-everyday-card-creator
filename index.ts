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

interface checklistTopLevelObject {
  pos: number,
  checklists: Array<ChecklistItem>
}

interface ChecklistItem{
  "name": string,
  "pos"?: string,
  "checked"?: boolean
}


type CardID = string;

type CheckListID = string;


const ChecklistItems: { [key: string]: checklistTopLevelObject } = {
  "Essentials 😬": {
    pos: 0,
    checklists: [
      {
        name: "Did you wake up early? 😴"
      },
      {
        name: "Did you have healthy food? 🍜"
      },
      {
        name: "Did you meditate? 🕉"
      },
      {
        name: "Did you go out for a run? 🏃‍"
      }
    ]
  },
  "Readings 📚": {
    pos: 1,
    checklists: []
  },
  "Random TODOs :done:": {
    pos: 2,
    checklists: []
  },
  "Coding 💻": {
    pos: 3,
    checklists: []
  },
  "Jobs 👨‍🔬": {
    pos: 4,
    checklists: []
  }
};

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



function createlistIfDNE(inBoard: string, listName: string) {
    return new Promise(
        (resolve, reject) => {
            getlists(inBoard).then(
                listData => {

                    for (var x of (listData.data as Array<listNesetedResource>)){
                        if (x.name === listName) {
                            return resolve(x.id);
                        }
                    }
                    // If the list does not contain the list, create the list.
                    createlist({
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


function getlists(boardID: string): Promise<any> {
    return makeGetRequestFromEndPoint(`/boards/${boardID}/lists`)
}

function createlist(data: object) {
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

function createlistWithNameOfMonth(boardID:string) : Promise<any>{
    return createlistIfDNE(boardID, moment.months()[moment().month()])
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
                err => reject(err)
            )
        }
    )
}

function createChecklist(checklistName:string, cardID: string, pos:number = Math.random()) {
    return new Promise(
        (resolve, reject) => {
            makePostRequestToEndPoint(`/checklists`, {
                idCard: cardID,
                name: checklistName,
                pos: pos
            }).then(
                x => resolve([checklistName, x.data.id])
            )
        }
    )
}


function createBasicChecklists(cardID: string): Promise<Array<any>> {
    let checklistPromises = Object.keys(ChecklistItems).map(
        x => createChecklist(x, cardID, ChecklistItems[x]["pos"])
    )

    return new Promise(
        (resolve, reject) => {
            Promise.all(checklistPromises).then(
                values => {
                    resolve(values)
                }
            )
        }
    )

}

function createChecklistItem(checklistItem: object, inChecklist: CheckListID) {
  return new Promise(
    (resolve, reject) => {
      makePostRequestToEndPoint(`/checklists/${inChecklist}/checkItems`, checklistItem);
    }
  )
}

function createChecklistItems(checklistItems:Array<any>, inChecklist: CardID) {
  return new Promise(
    (resolve, reject) => {
      Promise.all(checklistItems.map(
        checklistItem => createChecklistItem(checklistItem, inChecklist)
      ))
    }
  )
}

createlistWithNameOfMonth(configJSON.BOARDID).then(listID => {
  createDatedCard(listID).then(
    cardID => {
      createBasicChecklists(cardID).then(checklists => {
        checklists.map(checklist =>
          createChecklistItems(
            ChecklistItems[checklist[0]]["checklists"],
            checklist[1]
          )
        );
      });
    },
  );
});