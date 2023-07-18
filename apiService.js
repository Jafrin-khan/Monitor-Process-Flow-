const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const verify = require('./verify');
let {headers , PTN} = require('./util'); 

let  coICoCID = "None";
let flag=0;
let token = "";
let AsyncToken = "";

//variables required for erp
let TreatmentOrderId;
let BSShipmentId;
let ShipmentNumberRange = PTN.slice(3);
let ProcessingNodeId;
let FPShipmentId;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const alreadyPresentCoi = async (URL, openApiToken, coi) => {

  token = openApiToken;
  coICoCID = coi;

   //Getting PTN
   headers.Authorization =  `Bearer ${token}`;
   try {
    const response = await axios.get(
      "https://sap-cgto-api-cgt-r1-pocprv-dev.cfapps.eu12.hana.ondemand.com/openapi/coicocid/CoICoCID" + "('" + coICoCID + "')",
      { headers }
    );

  const CoiView = response.data;
  PTN=CoiView.patientTherapyNumber;
  console.log(PTN);
} 

catch (error) {
  console.log(error.message);
  throw error;
}

  let is3aDone;
  let is3bDone;
  let is3cDone;

  try {
    let result = await verify.verification(token, "3a", coICoCID);
    is3aDone = result[0];
    console.log("3a", is3aDone);

    result  = await verify.verification(token, "3b", coICoCID);
    is3bDone = result[0];
    console.log("3b", is3bDone);

    result = await verify.verification(token, "3c", coICoCID);
    is3cDone = result[0];
    console.log("3c", is3cDone);

    const jsonObject = {
      coICoCID: coi,
      is3aDone: is3aDone,
      is3bDone: is3bDone,
      is3cDone: is3cDone,
      PTN: PTN
    };

    console.log(jsonObject);
    return jsonObject;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

const makeRequestcoiCoCID =  async (URL , openApiToken) => {
  token = openApiToken;
//payload
  const data = {
      "patientTherapyNumber":PTN,
      "originSystemID": "originSystemID",
      "therapyID": "THP099",
      "requestedBy": "12345678976543213456786543245676543564",
      "requestedAt":new Date().toISOString() ,
      "requestedMessageID": "requestedMessageID",
      "referenceDocID": "1239112",
      "treatmentCenterID": "TMC01"
  };
  headers.Authorization = `Bearer ${token}`;
//for coicocid generation
  try {
    const response = await axios.post(
      'https://sap-cgto-api-cgt-r1-pocprv-dev.cfapps.eu12.hana.ondemand.com/openapi/coicocid/createCoICoCID',
      data,
      {headers}
    );
    coICoCID = response.data.coICoCID;
    console.log(coICoCID);

    const jsonObject = {
      coICoCID: coICoCID,
      PTN: PTN
    };

    console.log(jsonObject);
    return jsonObject;
  } 
  
  catch (error) {
    console.log(error.message);
    throw error;
  }  
};

//3a Treatment ID
const makeRequestTreatmentID = async (URL , coi , openApiToken , eventsToken) => {
    
    token = openApiToken;
    AsyncToken = eventsToken;
    headers.Authorization = `Bearer ${AsyncToken}`;
    //payload
    const data = {
      "header": {
          "eventVersion": "1.0.0",
          "eventType": "sap/cgt/order/treatment_order/create", 
          "eventSourceSystemId": "7f52de61-63cb-42e0-8937-dbed7e705727",
          "eventSubdomainId": "cgt-r1-pocsub1-eu12",
          "requestedDateTime":new Date().toISOString(),
          "eventId": uuidv4(),
          "correlationId": "4d8d1b67-c1fb-4314-adaa-d596a126d633"
      },
      "data": {
          "coiId": coICoCID,
          "requestId": PTN,
          "hcoOrgId": "TMC01",
          "clinicalTrialSubjectId": "500813",
          "therapyId": "THP099",
          "patientOnboardDateTime": "2023-02-13T02:50:21.063Z",
          "originalOrderSubmissionDateTime": "2023-02-10T02:50:21.063Z",
          "updatedOrderSubmissionDateTime": "2023-02-15T02:50:21.063Z",
          "TreatmentOrderText": [
              {
                  "textId": "1",
                  "messageText": "Cancer specimen",
                  "language": "en"
              }
          ],
          "partner": {
              "role": "1",
              "name": "Roche Corp",
              "id": "ROCHE12"
          },
          "patientId": "cdf978d1-daec-40d7-af46-f7960a3a44c3"
      
  }};

    //for treatment order generation
    try {
     
    const response = await axios.post(
      'https://enterprise-messaging-pubsub.cfapps.eu12.hana.ondemand.com/messagingrest/v1/topics/z%2Fsap.cgt%2F01%2Finbound%2Fevents%2Freceiver/messages',
      data,
      {headers}
    );
    
    console.log("Treatment order generated");
    // await new Promise((resolve) => setTimeout(resolve, 6000));
 
    //verification
    await sleep(5000);
    let cnt = 5;

    while(cnt--){
    const result = await verify.verification(token, "3a", coICoCID);
    if(result != undefined){
    flag = result[0]
    TreatmentOrderId = result[1];
    break;
    }
    }
    console.log("3a :",flag);
    return flag;
    } 

    catch (error) {
    console.log(error.message);
    throw error;
     }
};

//3b Biospecimen Shipment
const createBioSpecimenShipment = async () => {
  
  //payload
  const data = {
    "header": {
        "eventVersion": "1.0.0",
        "eventType": "sap/cgt/shipment/biospecimen/create",
        "eventSubdomainId": "cgt-r1-pocsub1-eu12",
        "eventSourceSystemId": "7f52de61-63cb-42e0-8937-dbed7e705727",
        "requestedDateTime": new Date().toISOString(),
        "eventId": uuidv4(),
        "correlationId": "44f4f13b-a58e-4093-adfd-386243eeb52f"
    },
    "data": {
        "coiId": coICoCID,
        "requestId": PTN,
        "reason": "",
        "pickupRequestId": "BS"+PTN+"-01",
        "pickupLocation": {
            "type": "OLT12",
            "shipmentAddressUsageType": "STDADD",
            "id": "ORGSH01"
        },
        "expectedPickupDateTime": "2023-10-24T02:30:24.170Z",
        "createdDateTime": "2023-01-23T02:30:24.186Z",
        "lastUpdateDateTime": "2023-01-23T02:30:24.186Z",
        "materialInfo": [
            {
                "MaterialType": "MT12",
                "MaterialGroup": "MG12"
            }
        ]
    }
};
headers.Authorization = `Bearer ${AsyncToken}`;
  //generate bioshipment req
  try {
    const response = await axios.post(
      'https://enterprise-messaging-pubsub.cfapps.eu12.hana.ondemand.com/messagingrest/v1/topics/z%2Fsap.cgt%2F01%2Finbound%2Fevents%2Freceiver/messages',
      data,
      {headers}
    );
    // await new Promise((resolve) => setTimeout(resolve, 6000));

    await sleep(5000);
    flag = 0;
    let cnt = 5;

    while(cnt--){
    const result = await verify.verification(token, "3b", coICoCID);
    if(result !== undefined){
    flag = result[0]
    BSShipmentId = result[1];
    break;
    }
    }
    console.log("3b :",flag);
  } 
  
  catch (error) {
    console.log(error.message);
    throw error;
  }
};

//Create FP 
//3c
const makeRequestFinishedProduct = async () => {
  //payload
  
  const data ={
    "header": {
        "eventVersion": "1.0.0",
        "eventType": "sap/cgt/shipment/finished_product/create",
        "eventSourceSystemId": "7f52de61-63cb-42e0-8937-dbed7e705727",
        "eventSubdomainId": "cgt-r1-pocsub1-eu12",
        "requestedDateTime": new Date().toISOString(),
        "eventId": uuidv4(),
        "correlationId": "deada7ab-b8d5-42d5-ada3-3cc1dc339a5f"
    },
    "data": {
        "coiId": coICoCID,
        "requestId": PTN,
        "reason": "",
        "deliveryRequestId": "FP" + PTN + "-01",
        "deliveryLocation": {
            "type": "OLT1",
            "locationAddressUsageType": "STDADD",
            "id": "ORGHB01"
        },
        "expectedDeliveryDateTime": "2023-10-30T02:30:32.343Z",
        "createdDateTime": "2023-01-23T02:30:32.372Z",
        "lastUpdateDateTime": "2023-01-23T02:30:32.372Z",
        "materialInfo": [
            {
                "MaterialType": "MT13",
                "MaterialGroup": "MG13"
            }
        ]
    }
};

  //request block
  try {
    const response = await axios.post(
      'https://enterprise-messaging-pubsub.cfapps.eu12.hana.ondemand.com/messagingrest/v1/topics/z%2Fsap.cgt%2F01%2Finbound%2Fevents%2Freceiver/messages',
      data,
      {headers}
    );

    flag = 0;
    
    await sleep(5000);
    let cnt = 5;

    while(cnt--){
    const result = await verify.verification(token, "3c", coICoCID);
    if(result !== undefined){
    flag = result[0]
    FPShipmentId = result[1];
    break;
    }
    }
   
    console.log("3c" , flag);
    return flag;

   // console.log("3c Done");
  } 
  catch (error) {
    console.log(error.message);
    throw error;
  }
};

//7 create collection
const makeRequestBioSpecimenCollection = async () => {

  //payload
  const data ={
    "header": {
        "eventVersion": "1.0.0",
        "eventType": "sap/cgt/shipment/collection/create",
        "eventSubdomainId": "cgt-r1-pocsub1-eu12",
        "eventSourceSystemId": "7f52de61-63cb-42e0-8937-dbed7e705727",
        "requestedDateTime": new Date().toISOString(),
        "eventId": uuidv4(),
        "correlationId": "aea9aa9c-8169-4fcc-a076-ce3b8456acf0"
    },
    "data": {
        "coiId": coICoCID,
        "requestId": PTN,
        "pickupRequestId": "BS" + PTN + "-01",
        "collections": [
            {
                "collectionId": "BSC" + PTN + "-01",
                "collectionIdQualifier": "CQI123",
                "collectionIdValue": "cval45",
                "collectionQuantity": {
                    "value": 10,
                    "uom": "EA"
                },
                "biospecimenPrepDateTime": "2022-10-22",
                "bsPreparationLastUpdateDateTime": "2022-10-22T10:22:48.202Z",
                "preparationCreatedDateTime": "2022-10-22T10:22:48.202Z",
                "patientCollectionDateTime": "2022-10-19",
                "createdDateTime": "2022-10-22T10:22:48.202Z",
                "referenceLastUpdateDateTime": "2022-10-22T10:22:48.202Z",
                "collectedProducts": [
                    {
                        "materialType": "MT12",
                        "materialGroup": "MG12",
                        "expectedQuantity": {
                            "uom": "EA",
                            "value": 1
                        },
                        "subUnits": [
                            {
                                "subUnitId": "BSSUSE2023010609",
                                "subUnitInputId": "input1234",
                                "subUnitType": "Cryobag",
                                "subUnitQualifier": "Cryobag ID",
                                "subUnitDisplayName": "SATtest",
                                "submittedDate": "2022-08-08T10:22:48.202Z",
                                "lastUpdateDateTime": "2022-07-08T10:22:48.202Z",
                                "subUnitQuantity": {
                                    "uom": "EA",
                                    "value": 7
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

  //request block
  try {
    const response = await axios.post(
      'https://enterprise-messaging-pubsub.cfapps.eu12.hana.ondemand.com/messagingrest/v1/topics/z%2Fsap.cgt%2F01%2Finbound%2Fevents%2Freceiver/messages',
      data,
      {headers}
    );
    
    flag = 0;
    await new Promise((resolve) => setTimeout(resolve, 6000));

    flag = await verify.verification(token, "7", coICoCID);
    console.log("7 :",flag);
    return flag;
   // console.log("7 done");
  } 
  catch (error) {
    console.log(error.message);
    throw error;
  }
};

//19b
//BioSpecimen Courier Update
const makeRequestBioSpecimenUpdate = async () => {

  //payload
  const data ={
    "header": {
        "eventVersion": "1.0.0",
        "eventType": "sap/cgt/shipment/biospecimen/update",
        "eventSourceSystemId": "7f52de61-63cb-42e0-8937-dbed7e705726",
        "eventSubdomainId": "cgt-r1-pocsub1-eu12",
        "requestedDateTime": new Date().toISOString(),
        "eventId": uuidv4(),
        "correlationId": "1ce93e34-ae1c-408a-9773-efe45ec1d1a3"
    },
    "data": {
        "coiId": coICoCID,
        "requestId": PTN,
        "pickupRequestId": "BS" + PTN + "-01",
        "pickupLocation": {
            "type": "OLT12",
            "shipmentAddressUsageType": "STDADD",
            "id": "ORGSH01"
        },
        "expectedPickupDateTime": "2023-10-25T02:30:24.170Z",
        "lastUpdateDateTime": "2023-02-09T10:22:48.202Z"
    }
};

 //request block
  try {
    const response = await axios.post(
      'https://enterprise-messaging-pubsub.cfapps.eu12.hana.ondemand.com/messagingrest/v1/topics/z%2Fsap.cgt%2F01%2Finbound%2Fevents%2Freceiver/messages',
      data,
      {headers}
    );
    
    flag = 0;
    await new Promise((resolve) => setTimeout(resolve, 6000));
    
    flag = await verify.verification(token, "19b", coICoCID);
    console.log("19b :",flag);
    return flag;

  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

//Create FP shipment reciept
//17
const makeRequestUpdateFPRecieptPackage = async () => {
  //payload
  const data = {
    "header": {

        "eventVersion": "1.0.0",

        "eventType": "sap/cgt/shipment/finished_product/receipt_packed/update",

        "eventSourceSystemId": "7f52de61-63cb-42e0-8937-dbed7e705826",

        "eventSubdomainId": "cgt-r1-pocsub1-eu12",

        "requestedDateTime": new Date().toISOString(),

        "eventId": uuidv4(),

        "correlationId": "6adec8ec-9340-4e2e-8db0-4ca51fc5b48d"

    },
    "data": {
        "coiId": coICoCID,
        "referenceOrder": PTN,
        "referenceShipmentID": "FP" + PTN + "-01",
        "role": [
            "verifier",
            "approver"
        ],
        "packedVerifiedAt": new Date().toISOString(),
        "packedVerifiedBy": "loring.wu@sap.com",
        "packedApprovedAt": new Date().toISOString(),
        "packedApprovedBy": "loring.wu@sap.com",
        "shipperVerified": true
    }
};

  //request block
  try {
    const response = await axios.post(
      'https://enterprise-messaging-pubsub.cfapps.eu12.hana.ondemand.com/messagingrest/v1/topics/z%2Fsap.cgt%2F01%2Finbound%2Fevents%2Freceiver/messages',
      data,
      {headers}
    );

    flag = 0;
    await new Promise((resolve) => setTimeout(resolve, 6000));
    
    const targetMail = data.data.packedVerifiedBy; 
    flag = await verify.verification(token, "17", targetMail);
    console.log("17 :",flag);

    const jsonObject = {
        flag : flag,
        packedVerifiedBy : data.data.packedVerifiedBy,
        packedVerifiedAt: data.data.packedVerifiedAt,
        packedApprovedBy: data.data.packedApprovedBy,
        shipperVerified: data.data.shipperVerified
    }

    return jsonObject;
  } 
  catch (error) {
    console.log(error.message);
    throw error;
  }
};
//Create FP shipment reciept
//18
const makeRequestUpdateFPRecieptContent = async () => {
  //payload
  const data = {

    "header": {

        "eventVersion": "1.0.0",

        "eventType": "sap/cgt/shipment/finished_product/receipt_content/update",

        "eventSourceSystemId": "7f52de61-63cb-42e0-8937-dbed7e705826",

        "eventSubdomainId": "cgt-r1-pocsub1-eu12",

        "requestedDateTime": new Date().toISOString(),

        "eventId": uuidv4(),

        "correlationId": "02c6fc3f-1f90-4526-a05d-0bb583766f0f"

    },

    "data": {

        "coiId": coICoCID,

        "referenceOrder": PTN,

        "referenceShipmentID": "FP" + PTN + "-01",

        "role": [

            "approver",

            "verifier"

        ],

        "shipperContentsVerified": false,

        "contentApprovedAt": new Date().toISOString(),

        "contentApprovedBy": "snigdha@sap.com",

        "contentVerifiedAt": new Date().toISOString(),

        "contentVerifiedBy": "snigdha@sap.com"

    }

};

  //request block
  try {
    const response = await axios.post(
      'https://enterprise-messaging-pubsub.cfapps.eu12.hana.ondemand.com/messagingrest/v1/topics/z%2Fsap.cgt%2F01%2Finbound%2Fevents%2Freceiver/messages',
      data,
      {headers}
    );

    const targetMail = data.data.contentApprovedBy; 
    flag = await verify.verification(token, "18", targetMail);
    console.log("18 :",flag);

    const jsonObject = {
        flag : flag,
        contentApprovedAt : data.data.contentApprovedAt,
        contentApprovedBy: data.data.contentApprovedBy,
        contentVerifiedAt: data.data.contentVerifiedAt,
        contentVerifiedBy: data.data.contentVerifiedBy
  }

  return jsonObject;

  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

//Create FP shipment reciept
//19c
const makeRequestUpdateSubsequentFP= async () => {
  //payload
  const data = {
    "header": {
        "eventVersion": "1.0.0",
        "eventType": "sap/cgt/shipment/finished_product/update",
        "eventSourceSystemId": "7f52de61-63cb-42e0-8937-dbed7e705726",
        "eventSubdomainId": "cgt-r1-pocsub1-eu12",
        "requestedDateTime": "2022-03-02T12:56:29.983Z",
        "eventId": uuidv4(),
        "correlationId": "b056dc08-ff99-41fa-a4e0-b2bdcbd361ac"
    },
    "data": {
        "coiId": coICoCID,
        "requestId": PTN,
        "reason": "",
        "deliveryRequestId": "FP" + PTN + "-01",
        "deliveryLocation": {
            "type": "OLT1",
            "locationAddressUsageType": "STDADD",
            "id": "ORGHB01"
        },
        "expectedDeliveryDateTime": "2023-10-29T02:30:32.343Z",
        "lastUpdateDateTime": "2023-01-24T02:30:32.372Z",
        "materialInfo": [
            {
                "MaterialType": "MT13",
                "MaterialGroup": "MG13"
            }
        ]
    }
};

  //request block
  try {
    const response = await axios.post(
      'https://enterprise-messaging-pubsub.cfapps.eu12.hana.ondemand.com/messagingrest/v1/topics/z%2Fsap.cgt%2F01%2Finbound%2Fevents%2Freceiver/messages',
      data,
      {headers}
    );

    flag = 0;
    await new Promise((resolve) => setTimeout(resolve, 6000));

    flag = await verify.verification(token, "3c", coICoCID);
    console.log("3c :",flag);
    return flag;
  } 
  catch (error) {
    console.log(error.message);
    throw error;
  }
};

/*******************************************************************ERP*********************************************************************/
//Purchase Order Reciept
//Event 35

let erpToken;
const makeRequestPurchaseOrderReciept= async (token) => {
  //payload
  erpToken = token;
  const data = {
    "header": {
        "eventVersion": "1.0.0",
        "eventType": "sap/cgt/erp/shipment/purchase_order/receipt",
        "eventSourceSystemId": "7f52de61-63cb-42e0-8937-dbed7e705726",
        "eventSubdomainId": "cgt-r1-pocsub1-eu12",
        "requestedDateTime": new Date().toISOString(),
        "eventId": uuidv4(),
        "correlationId": "0ff58670-9bbe-497f-bdc5-730d07196a12"
    },
    "data": {
        "shipmentId": BSShipmentId,
        "coiId": coICoCID,
        "treatmentOrderId": TreatmentOrderId,
        "modifiedBy": "Event35",
        "modifiedAt": new Date().toISOString(),
        "purchaseOrder": {
            "purchaseOrderNumber": "PO" + BSShipmentId,
            "purchaseOrderType": "TYPE1",
            "overallResponseStatus": "01"
        },
        "purchaseOrderStatus": [
            {
                "statusId": "orderStatus",
                "statusValue": "04"
            },
            {
                "statusId": "purchaseOrderStatus",
                "statusValue": "02"
            }
        ],
        "purchaseOrderItem": [
            {
                "externalItemId": "EXT10",
                "itemId": "10",
                "materialId": "MT12",
                "batchNumber": "4414"
            }
        ],
        "message": []
    }
};

  //request block
  try {
    
    const response = await axios.post(
      'https://enterprise-messaging-pubsub.cfapps.eu12.hana.ondemand.com/messagingrest/v1/topics/z%2Fsap.cgt%2F01%2Finbound%2Fevents%2Freceiver/messages',
      data,
      {headers}
    );

   console.log("35 done");
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

//107(34) - Process Order -  Create
//Event 34
const makeRequestProcessOrderCreate= async () => {
  //getting prcessing node ID
    try {
      const headers = {
        'x-approuter-authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Authorization' : `Bearer ${token}`,
      };
  
      const response = await axios.get(
        'https://sap-cgto-api-cgt-r1-pocprv-dev.cfapps.eu12.hana.ondemand.com/openapi/v2/processing-node/ProcessingNodeView',
        { headers }
      );
  
    const ProcessingNodeView = response.data.value;
   
    for(let i = 0 ; i < ProcessingNodeView.length ; i++){ 
      if(ProcessingNodeView[i].coiId === coICoCID){
        ProcessingNodeId = ProcessingNodeView[i].processingActivityID;
        break;
      }
    }
  } 

  catch (error) {
    console.log(error.message);
    throw error;
  }

  //payload
  const data = {
    "header": {
        "eventVersion": "1.0.0",
        "eventType": "sap/cgt/erp/shipment/processing_node/process_order/receipt",
        "eventSourceSystemId": "7f52de61-63cb-42e0-8937-dbed7e705726",
        "eventSubdomainId": "cgt-r1-pocsub1-eu12",
        "requestedDateTime": new Date().toISOString(),
        "eventId": uuidv4(),
        "correlationId": "3f664f67-4dc3-4044-8ce4-45ae425eeb68"
    },
    "data": {
        "coiId": coICoCID,
        "processingNodeId": ProcessingNodeId,
        "documentId": "PROCORD" + ProcessingNodeId,
        "treatmentOrderId": TreatmentOrderId,
        "overallResponseStatus": "01",
        "documentType": "PROCODR",
        "materialItem": [
            {
                "itemId": "",
                "materialId": "MAT103",
                "batchNumber": "FPBCH" + ShipmentNumberRange + "01",
                "movementType": "OUTPUT",
                "expectedProductionQuantity": "1",
                "productionUnit": "EA",
                "materialSubUnit": []
            }
        ],
        "ProcessOrderStatus": [],
        "message": [],
        "modifiedBy": "Event107",
        "modifiedAt": new Date().toISOString(),
    }
};

  //request block
  try {
    const response =  axios.post(
      'https://enterprise-messaging-pubsub.cfapps.eu12.hana.ondemand.com/messagingrest/v1/topics/z%2Fsap.cgt%2F01%2Finbound%2Fevents%2Freceiver/messages',
      data,
      {headers}
    );

   console.log("34 done");
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

//106 - Sales Order -  Create
const makeRequestSalesOrder = async () => {
  //payload
  const data = {
    "header": {
        "eventVersion": "1.0.0",
        "eventType": "sap/cgt/erp/shipment/sales_order/receipt",
        "eventSourceSystemId": "7f52de61-63cb-42e0-8937-dbed7e705726",
        "eventSubdomainId": "cgt-r1-pocsub1-eu12",
        "requestedDateTime":  new Date().toISOString(),
        "eventId": uuidv4(),
        "correlationId": "94e1f1fc-eff4-4b0d-b8e4-136eb9e8b835"
    },
    "data": {
        "shipmentId": FPShipmentId,
        "coiId": coICoCID,
        "treatmentOrderId": TreatmentOrderId,
        "salesOrderNumber": "SOWL" + FPShipmentId,
        "overallResponseStatus": "01",
        "isExternal": false,
        "modifiedAt": "123",
        "modifiedBy": "Event106",
        "shipmentMaterials": [
            {
                "referenceDocumentItemNumber": "00010",
                "itemId": "10",
                "materialId": "MAT103",
                "batchNumber": "null",
                "requestedQuantityUnit": "EA",
                "requestedQuantity": "1",
                "isDeleted": false
            }
        ],
        "salesOrderStatus": [
            {
                "statusId": "overallSDDocumentRejectionSts",
                "statusValue": "A"
            },
            {
                "statusId": "totalBlockStatus",
                "statusValue": "B"
            },
            {
                "statusId": "overallSDProcessStatus",
                "statusValue": "C"
            }
        ],
        "message": [
            {
                "referenceMessageType": "S",
                "referenceMessageDescription": "Z001 reference Message Description",
                "referenceMessageClass": "Z001",
                "referenceMessageNumber": "1004"
            },
            {
                "referenceMessageType": "W",
                "referenceMessageDescription": "Z002 reference Message Description",
                "referenceMessageClass": "Z002",
                "referenceMessageNumber": "1005"
            },
            {
                "referenceMessageType": "E",
                "referenceMessageDescription": "Z003 reference Message Description",
                "referenceMessageClass": "Z003",
                "referenceMessageNumber": "1006"
            }
        ]
    }
};
  //request block
  try {
    
    const response =  axios.post(
      'https://enterprise-messaging-pubsub.cfapps.eu12.hana.ondemand.com/messagingrest/v1/topics/z%2Fsap.cgt%2F01%2Finbound%2Fevents%2Freceiver/messages',
      data,
      {headers}
    );

   // console.log("106 done");
  } catch (error) {
    console.log(error.message);
    
  }
};

module.exports = {

  //Patient management
  alreadyPresentCoi,
  makeRequestcoiCoCID,
  makeRequestTreatmentID,
  createBioSpecimenShipment,
  makeRequestBioSpecimenCollection,
  makeRequestFinishedProduct,
  makeRequestBioSpecimenUpdate,
  makeRequestUpdateFPRecieptPackage,
  makeRequestUpdateFPRecieptContent,
  makeRequestUpdateSubsequentFP,

  //ERP
  makeRequestPurchaseOrderReciept,
  makeRequestProcessOrderCreate,
  makeRequestSalesOrder
};

// const headers = {
//   'x-approuter-authorization': `Bearer ${token}`,
//   'Content-Type': 'application/json',
//   'Access-Control-Allow-Origin': 'http://localhost:3000',
//   'Authorization' : `Bearer ${token}`,
// };