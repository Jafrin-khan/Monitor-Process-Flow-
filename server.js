const path = require('path');
const axios = require('axios');
const { usernameC, username, usernameE , passwordC, password , passwordE} = require('./config');
const express = require('express');

const port = 3000||process.env.APP_PORT  ;
const apiService = require('./apiService');
const cors = require("cors");

const app = express();
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));
app.use(cors());
app.use(express.json());

let URL;
let coi = "";
let token;
let AsyncToken;
let erpToken;

app.post('/newURL',async(req,res)=>{
  try {
   URL = req.body.newURL;
   
   //token for openAPI
   try {
    const credentials = `${usernameC}:${passwordC}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    const response = await axios.post(
      `${URL}/oauth/token?grant_type=client_credentials`,
      null,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      }
    );
    
    const authToken = response.data.access_token;
    token = authToken;
  } 
  catch (error) {
    console.error("Error Occured");
  }

  //token for events
   try {
    const credentials = `${username}:${password}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    const response = await axios.post(
      `${URL}/oauth/token?grant_type=client_credentials`,
      null,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      }
    );

    AsyncToken = response.data.access_token;
  } 
    catch (error) {
      console.log(error.message);
    }

   //token for ERP , EM
   try {
    const credentials = `${usernameE}:${passwordE}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    const response = await axios.post(
      `https://cgt-r1-pocsub1-eu12.authentication.eu12.hana.ondemand.com/oauth/token?grant_type=client_credentials&response_type=token`,
      null,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      }
    );
    
    const authToken = response.data.access_token;
    erpToken = authToken;
    console.log(erpToken);
  } 
  catch (error) {
    console.log(error.message);
  }

   res.status(200).json({ error: "An error occurred" });
  }
  catch (error) {
    console.log(error.message);
  }

});

//Custom Coi
app.post('/EnterCoi', async (req, res) => {
  try {
    coi = req.body.coi;
    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500); 
  }
});

// master data
// app.post('/masterData',async(req,res)=>{
//   try {
//    //console.log(req.body);
//    masterData = req.body.JsonObject;
//    res.status(200).json({ error: "An error occurred" });
//   }
//   catch (error) {
//     console.log(error.message);
//   }
// });

// coiCOCID generation
app.get('/makeRequestcoiCoCID', async (req, res) => {

try {
  coICoCID = await apiService.makeRequestcoiCoCID(URL , token);
  res.json({ coICoCID }); 

} catch (error) {
  console.error("Error Occurred");
  res.status(500).json({ error: "An error occurred" });
}
});

app.get('/alreadyPresentCoi', async (req, res) => {
  try {
    coICoCID = await apiService.alreadyPresentCoi(URL , token , coi);
    res.json({ coICoCID }); 
  } catch (error) {
    console.error("Error Occurred");
    res.status(500).json({ error: "An error occurred" });
  }
  });

// Treatment order generation
//3a*
app.get('/makeRequestTreatmentID', async (req, res) => {

  try {
    const Treat=await apiService.makeRequestTreatmentID(URL , coi , token , AsyncToken);
    res.json({ Treat }); 
  } 
  catch (error) {
    console.error("Error Occurred");
    res.status(500).json({ error: "An error occurred iuy" });
  }
  });
  //Biospecimen Shipment
  //3b*
  app.get('/createBioSpecimenShipment', async (req, res) => {

    try {
      const Treat=await apiService.createBioSpecimenShipment();
      res.json({ Treat }); 
    } 
    catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "An error occurred iuy" });
    }
    });
  
  
  //makeRequestBioSpecimenCollection
  //7
    app.get('/makeRequestBioSpecimenCollection', async (req, res) => {

      try {
        const Treat=await apiService.makeRequestBioSpecimenCollection();
        res.json({ Treat }); 
      } 
      catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "An error occurred iuy" });
      }
      });

    //makeRequestBioSpecimenUpdate
    //19b
    app.get('/makeRequestBioSpecimenUpdate', async (req, res) => {

      try {
        const Treat=await apiService.makeRequestBioSpecimenUpdate();
        res.json({ Treat });
      } 
      catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "An error occurred iuy" });
      }
      });

  //Finished Product
  //3c
  app.get('/makeRequestFinishedProduct', async (req, res) => {

    try {
      const Treat=await apiService.makeRequestFinishedProduct();
      res.json({ Treat }); 
    } 
    catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "An error occurred iuy" });
    }
    });

  //FP shipment reciept content
  //18
  app.get('/makeRequestUpdateFPRecieptContent', async (req, res) => {

    try {
      const Treat=await apiService.makeRequestUpdateFPRecieptContent();
      res.json({ Treat }); 
    } 
    catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "An error occurred"});
    }
    
    });

     //FP shipment reciept package
     //17
     app.get('/makeRequestUpdateFPRecieptPackage', async (req, res) => {

      try {
        const Treat=await apiService.makeRequestUpdateFPRecieptPackage();
        res.json({ Treat }); 
      } 
      catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred"});
      }
      
      });

    //FP Subsequent shipment
    //19c
    app.get('/makeRequestUpdateSubsequentFP', async (req, res) => {

      try {
        const Treat=await apiService.makeRequestUpdateSubsequentFP();
        res.json({ Treat }); 
      } 
      catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred"});
      }
      
      });

      /*******************************************ERP**************************************** */
    //Purchase Order Reciept
    //35
    app.get('/makeRequestPurchaseOrderReciept', async (req, res) => {

      try {
        const Treat=await apiService.makeRequestPurchaseOrderReciept(erpToken);
        res.json({ Treat }); 
      } 
      catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred"});
      }
      
      });

      //34
      app.get('/makeRequestProcessOrderCreate', async (req, res) => {

        try {
          const Treat=await apiService.makeRequestProcessOrderCreate();
          res.json({ Treat }); 
        } 
        catch (error) {
          console.error(error.message);
          res.status(500).json({ error: "An error occurred"});
        }
        
        });

    //106
     app.get('/makeRequestSalesOrder', async (req, res) => {

      try {
        const Treat=await apiService.makeRequestSalesOrder();
        res.json({ Treat }); 
      } 
      catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred"});
      }
      
      });
      
app.listen(port, () => {
  console.log(`Server running  on port number ${port}`);
});
