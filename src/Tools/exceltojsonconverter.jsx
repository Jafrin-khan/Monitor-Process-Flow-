import { FileUploader, FlexBox, FlexBoxJustifyContent,Label,FlexBoxDirection } from "@ui5/webcomponents-react";
import{Button,ComboBox,ComboBoxItem,Avatar,Icon} from "@ui5/webcomponents-react";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import {upload}from "@ui5/webcomponents-icons/dist/upload"
import { sapUiContentPadding} from "@ui5/webcomponents-react-base/dist/styling/spacing";
import ComboBoxfunc from"./ComboBox";
import axios from"axios";
export let jsonObject;
const ExcelToJsonConverter = () => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleComboBox = (event) => {
    const { value } = event.target;
    setSelectedValue(value);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      let workbook;

      if (file.name.endsWith('.xlsx')) {
        workbook = XLSX.read(data, { type: 'array' });
      } else if (file.name.endsWith('.csv')) {
        const text = new TextDecoder().decode(data);
        workbook = XLSX.read(text, { type: 'string' });
      } else {
        console.error('Unsupported file format');
        return;
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headerRow = json[0];
      const rowData = json.slice(1);

      const result = rowData
        .filter((row) => row.length === headerRow.length)
        .map((row) => {
          const rowObject = {};
          headerRow.forEach((header, index) => {
            rowObject[header] = row[index];
          });
          return rowObject;
        });

      //setJsonData(json);
      const therapyID = result.map((row) => row.therapyID); 
      const systemID = result.map((row) => row.systemID); 
      const treatmentCenterID = result.map((row) => row.treatmentCenterID); 
      const requestedBy="12236789112";
      const requestedAt= new Date().toISOString();
      const requestMessageID="requestMessageID";
    

       jsonObject = {
        therapyID,
        treatmentCenterID,
      };

      console.log('JSON Object:', jsonObject);

      try {
        console.log("entered try block");
        const response = await axios.post(
          '/masterData',
          { jsonObject },
          { headers: { 'Content-Type': 'application/json' } }
        );

        console.log('JSON Object:', jsonObject);
      } catch (error) {
        console.log("entered error block");
        console.log(error.message);
        throw error;
      }
    };

    if (file.name.endsWith('.xlsx')) {
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      console.error('Unsupported file format');
    }
  };


  return (
    <div>
      <FlexBox
      justifyContent={FlexBoxJustifyContent.SpaceBetween}
      >
        <FlexBox
        justifyContent={FlexBoxJustifyContent.SpaceAround}
        >
        <ComboBoxfunc/>
        </FlexBox>
       
          <FlexBox direction={FlexBoxDirection.Column} style={{marginTop:"8px"}}>
        <Label
       fontSize="16px"
        >
      Master Data : 
    </Label>
      <FileUploader
     
       style={{
       
        borderRadius:'10px',
        // padding: '5px',
        fontSize: '16px',
       
      }}
      placeholder="Upload File"
      backgroundColor="ButtonFace"
      type="file" 
      onChange={handleFileChange} 
      // accept=".xlsx"
      accept=".xlsx,.csv" 
      >
      <Avatar
    colorScheme="Placeholder" 
  icon="upload"
  shape="Circle"
  size="XS"
/>

     {/* <Button 
        style={{
        backgroundColor:'ButtonFace',
        color: 'black',
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '14px',
        cursor: 'pointer',
      }}> 
          Collect
        </Button> */}
      </FileUploader>
        </FlexBox>
      </FlexBox>
      </div>
  );
};

export default ExcelToJsonConverter;
