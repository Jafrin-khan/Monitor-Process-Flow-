import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import axios from 'axios';
import { edges } from "./nodes-edges";
import { StandardListItem } from '@ui5/webcomponents-react';
import './css_Files/CustomNode.css';
import { NodeStyle } from './NodeStyling';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { coICoCID , is3aDone , coi,PTN} from './CoiCoCIDGeneration';
const Node = NodeStyle;

let temp=false;
let flag = 0;

export default memo(({ data, selected }) => {
  const [color, setColor] = useState(data.color || '#D3D3D3'); // Background color
  const [showPopover, setShowPopover] = useState(false);
   
  const handleClickTreatmentID = async () => {
   
    if (!is3aDone) {
    try {
      console.log("3a");
      temp=true;
    
      setColor("#FFA500");
      toast.success('Treatment Order Done!', {
        position: toast.POSITION.BOTTOM_CENTER
      });

      let cnt = 5;

      while(cnt--){
      const response = await axios.get('/makeRequestTreatmentID');
      if(response !== undefined){
      console.log(response.data.Treat);
      flag = response.data.Treat;
      break;
      }
      }
      if(flag === 1){
        setColor("#3cba54");
      }
      
    }
    catch (error) {
      const newColor = " #FF0000";
      setColor(newColor);
      toast.error('Error', {
        position: toast.POSITION.BOTTOM_CENTER
    });
      console.log('An error occurred');
    }
  }
  

  };
  
  //popover
  const handleMouseEnter = () => {
    setShowPopover(true);
    
    console.log(is3aDone);
    if(is3aDone === 1 || flag === 1){
      console.log("Already");
      temp=true;
      setColor("#3cba54");
    }
    
  };

const handleMouseLeave = () => {
  setShowPopover(false);
};

let coiID;
 let id=`${coICoCID}`;
 let id1= `${coi}`;
 let ptn=`${PTN}`;
let nodeStatus;
if(temp&& id!=="undefined"){
  nodeStatus=false;
  coiID=id;
}
else if(temp&& id1!=="undefined"){
  nodeStatus=false;
  coiID=id1;
}
else {
  nodeStatus=true;
}


  return (
<div>
    <div>
    
      <Node color={color} selected={selected} onClick={!is3aDone ? handleClickTreatmentID : null} >
      {/* <ToastContainer /> */}
        <Handle type="target" position={Position.Left} />

        
        <div className="custom-node"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // onMouseDown={handleDoubleClick}
     > 
          <strong>{data.label}</strong>

        </div>
       
          <Handle
            type="source"
            position={Position.Right}
            id={id1}
          />
</Node>
        </div>
     
 
      {showPopover && <div className="popover">{<>
        <StandardListItem >
        {nodeStatus && <p>nodeStatus:- pending</p> }
   {!nodeStatus && <p>nodeStatus:- Created</p> }  
</StandardListItem>
<StandardListItem >
        coicocid:- {coiID}
</StandardListItem>
<StandardListItem >
        PTN:- {ptn}
</StandardListItem>
<StandardListItem >
clinicalTrialSubjectId:- {500813}
</StandardListItem>

<StandardListItem >
          Therapy ID:-THP099
</StandardListItem>
<StandardListItem >
Treatment Center ID:-TMC01
</StandardListItem>
      </>

 

}</div>}

   
</div>

  );
});