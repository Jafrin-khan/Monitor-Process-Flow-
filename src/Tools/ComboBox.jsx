import React, { useState } from "react";
import { sapUiContentPadding, sapUiNoContentPadding } from "@ui5/webcomponents-react-base/dist/styling/spacing";
import { ComboBox, ComboBoxItem,Label,FlexBoxDirection,FlexBox } from "@ui5/webcomponents-react";
import { getDomainName } from "./systemConfigureMap";
import axios from"axios";

export let newURL = ""; // Declare newURL variable outside the component

export default function ComboBoxfunc() {
  
  const [selectedValue, setSelectedValue] = useState("");

  const handleComboBox = async(event) => {
    const option= event.target.value;
    setSelectedValue(option);
    console.log(option);
    const endpoint = getDomainName(option);
    if (endpoint) {
      newURL = endpoint;
      console.log(newURL); // Output the generated endpoint (replace with your desired logic)
      try {
        console.log("entered try block");
        const response = await axios.post(
          '/newURL', 
          { newURL }, 
          { headers: { 'Content-Type': 'application/json' } }
          );
         
       console.log(newURL);
      }
      
      catch (error) {
         console.log("entered error block");
        console.error(error);
        throw error;
      }
    };
  };

  // const handleButtonClick = async() => {
    
    
  //   }
  


  return (
    <div>
      {/* <babel style={{ ...sapUiContentPadding }}>System</babel> */}
      <FlexBox direction={FlexBoxDirection.Column} style={{  marginLeft:"10px",marginTop:"8px"}}>
      <Label>  System : </Label>
      <ComboBox
      filter="System :"
        style={{ backgroundColor: "ButtonFace" }}
         onChange={handleComboBox}
        //  onClick={handleButtonClick}
         
      >
        <ComboBoxItem text="Dev" />
        <ComboBoxItem text="QA" />
        <ComboBoxItem text="GxP" />
      </ComboBox>
      {/* <button  onClick={handleButtonClick}>
       submit
      </button> */}
      </FlexBox>
     
    </div>
  );
}
