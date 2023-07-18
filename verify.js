const axios = require('axios');

let mp = new Map();

const verification = (token, event, parameterToCheck) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (mp.has(event) && mp.get(event) === 1) {
        resolve(mp.get(event));
        return;
      }

      if (event === '3a') {
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        };

        coICoCID = parameterToCheck;
        const response = await axios.get(
          "https://sap-cgto-api-cgt-r1-pocprv-dev.cfapps.eu12.hana.ondemand.com/openapi/treatmentorder/TreatmentOrderAPIView?$filter=coiId eq '" + coICoCID + "'",
          { headers }
        );

        let result;
        result = response.data.value;

        if(result.length){
          mp.set(event, 1);
          resolve([mp.get(event), result.orderId]);
        }

      } 
      else {
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        };

        if(event === '3b' || event === '19b' || event === '7' || event === '3c' || event === '19c'){
               const response = await axios.get(
              "https://sap-cgto-api-cgt-r1-pocprv-dev.cfapps.eu12.hana.ondemand.com/openapi/v2/shipment/ShipmentView?$filter=coiId eq '" + coICoCID + "'",
              { headers }
            );
            
            //console.log(response.data);
            if(response.data.value.length){

              const shipmentView = response.data.value;
              const foundBS = shipmentView.find(element => element.shipmentTypeID === "BS");
              const foundFP = shipmentView.find(element => element.shipmentTypeID === "FS-FL");
              
              if(foundBS){
                mp.set('3b', 1);
                mp.set('19b', 1);
                mp.set('7', 1);
              }

              if(foundFP){
                mp.set('3c', 1);
                mp.set('19c' , 1);
              }
             
              resolve([mp.get(event), response.data.value.shipmentID]);
            }
        }
        
        if(event === '17' || event === '18'){

        const response = await axios.get(
          'https://sap-cgto-api-cgt-r1-pocprv-dev.cfapps.eu12.hana.ondemand.com/openapi/v2/shipment/ShipmentView',
          { headers }
        );

          if(event === '17'){
          const targetMail = parameterToCheck;
          const shipmentView = response.data.value;
          const foundFPPackageReceipt = shipmentView.find(element => element.contentApprovedBy === targetMail);
          if (foundFPPackageReceipt) {
              mp.set(event , 1);
          } else {
              mp.set(event , 0);
          }
        }
        
        else{
          const targetMail = parameterToCheck;
          const shipmentView = response.data.value;
          const foundFPPackageReceipt = shipmentView.find(element => element.contentApprovedBy === targetMail);
          if (foundFPPackageReceipt) {
              mp.set(event , 1);
          } else {
              mp.set(event , 0);
          }
        }
      }
      resolve(mp.get(event));
    }
   } catch (error) {
      console.log(error.message);
      reject(error);
    }
  });
};

module.exports = {
  verification
};
