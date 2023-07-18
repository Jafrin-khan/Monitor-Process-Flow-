import React, { useState } from "react";
import axios from "axios";
import { FlexBox, FlexBoxJustifyContent } from "@ui5/webcomponents-react";
 //import jwt from "jsonwebtoken";
//import {newURL} from "../ComboBox";


export default function Auth() {

const ButtonStyle = {
  backgroundColor: "ButtonFace",
  color: "black",
  padding: "10px 20px",
  borderRadius: "10px",
  fontSize: "12px",
  cursor: "pointer"
};

const handleClickToken = async () => {
  try {
    const response = await axios.get('/makeTokenRequest');
    
    if (response.status === 200) {
      const responseData = response.data;
      console.log(responseData);
      // Handle the response data as needed
    } else {
      console.error('Request failed');
    }
  } catch (error) {
    console.error('An error occurred');
  }
};

const handleClickCoi = async () => {
  try {
    const response = await axios.get('/makeRequestcoiCoCID');
    
    if (response.status === 200) {
      const coICoCID = response.data.coICoCID;
      console.log(coICoCID);
      // Handle the CoiCoCID value as needed
    } else {
      console.error('Request failed');
    }
  } catch (error) {
    console.error('An error occurred');
  }
};

const handleClickTreatmentToken = async () => {
  try {
    const response = await axios.get('/makeTreatmentTokenRequest');
    
    if (response.status === 200) {
      const responseData = response.data;
      console.log(responseData);
      // Handle the response data as needed
    } else {
      console.error('Request failed');
    }
  } catch (error) {
    console.error('An error occurred');
  }
};
const handleClickTreatmentID = async () => {
  try {
    const response = await axios.get('/makeRequestTreatmentID');
    
    if (response.status === 200 || response.status ===204) {
      console.log("Treatment order generated");
      // Handle the Treatment order value as needed
    } else {
      console.error('Request failed');
    }
  } catch (error) {
    console.error('An error occurred');
  }
};
  return (
    <div>
      <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween}>
        {/* <button id="TokenButtonId"
          onClick={handleClickToken}
          style={{ButtonStyle}}
        >
          Token
        </button> */}
        {/* { <button id="CoiButtonId"
          onClick={handleClickCoi}
          style={{ButtonStyle}}
        >
          coiCoCID
        </button> } */}
        {/* <button id="TokenButtonId"
          onClick={handleClickTreatmentToken}
          style={{ButtonStyle}}
        >
          TreatmentToken */}
        {/* </button> */}
        {/* { <button id="TokenButtonId"
          onClick={handleClickTreatmentID}
          style={{ButtonStyle}}
        >
        TreatmentOrderID
        </button> } */}
        
      </FlexBox>
    </div>
  );
}

