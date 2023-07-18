////////7 /////////////
import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeStyle } from './NodeStyling';
import axios from 'axios';
import { StandardListItem } from '@ui5/webcomponents-react';
import { coICoCID,coi ,PTN} from './CoiCoCIDGeneration';
import "./css_Files/BioCollectionPopover.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Node = NodeStyle;
let temp=false;
let flag = 0;

export default memo(({ data, selected }) => {
const [color, setColor] = useState(data.color || '#D3D3D3'); // Background color
const [showPopover, setShowPopover] = useState(false);
const handleClickBioSpecimenCollection = async () => {
 
    try {
      console.log("7");
      const newColor = "#FFA500";
        setColor(newColor);
        toast.success('BioCollection Created', {
          position: toast.POSITION.BOTTOM_CENTER
        });
      const response = await axios.get('/makeRequestBioSpecimenCollection');
      console.log(response.data.Treat);
      flag = response.data.Treat;

      temp=true;
     
        console.log("BioSpecimen Collection Done !");  

        if(flag === 1){
          setColor("#3cba54");
        }
    } 
    catch (error) {
      toast.error('Error', {
        position: toast.POSITION.BOTTOM_CENTER
    });
      const newColor = " #FF0000";
      setColor(newColor);
      console.error('An error occurred');
    }
  };
//popover
// const handleDoubleClick=()=>{
//   setColor("#008000");
//  } 
const handleMouseEnter = () => {
  setShowPopover(true);

  // if(flag === 1){
  //   setColor("#3cba54");
  // }

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
 
<Node color={color} selected={selected} onClick={handleClickBioSpecimenCollection}>
{/* <ToastContainer /> */}
<Handle type="target" position={Position.Left} />


<div className="custom-node"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // onMouseDown={handleDoubleClick}
     > 
<strong>{data.label}</strong>
</div>
<Handle type="source" position={Position.Right} />
</Node>
</div>

{showPopover && <div className="BioCollectionpopover">{<>
  <StandardListItem >
  {nodeStatus && <p>nodeStatus:- pending</p> }
   {!nodeStatus && <p>nodeStatus:- Created</p> }
</StandardListItem>
<StandardListItem >
  coicocid:- {coiID}
</StandardListItem>
<StandardListItem >
  referenceShipmentID :- {"BS" + ptn + "-01"}
</StandardListItem>
{/* <StandardListItem >
referenceCollectionID
</StandardListItem> */}

<StandardListItem >
    collectionId:-{"BSC" + ptn + "-01"}
</StandardListItem>
<StandardListItem >
collectionDate:- {new Date().toISOString()}
</StandardListItem>
</>



}</div>}
  </div>

);
});