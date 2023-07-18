import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import axios from 'axios';
import { NodeStyle } from '../Nodes/NodeStyling';

const Node=NodeStyle;

export default memo(({ data, selected }) => {
const [color, setColor] = useState(data.color || '#D3D3D3'); // Background color
const handleClickBioShipment = async () => {
  
  
    try {
      console.log("entered try");
<<<<<<<< HEAD:src/ERP_Nodes/event35_.js
     
      const response =  axios.get('/makeRequestPurchaseOrderReciept');
========
>>>>>>>> 02fcaa87b88985c7d3b8928fa02d470d61c81503:src/ERP_Nodes/PurchaseOrderResponse35.js
      const newColor = "#FFA500";
      setColor(newColor);
      const response = await axios.get('/makeRequestPurchaseOrderReciept');
      
        const TreatmentID = response.data.TreatmentID;
    } 
    catch (error) {
      const newColor = " #FF0000";
      setColor(newColor);
      console.error('An error occurred');
    }
    
  };

  
return (

  <div>
<Node color={color} selected={selected} onClick={handleClickBioShipment}>
<Handle type="target" position={Position.Left} />
<div>
<strong>{data.label}</strong>

</div>
<Handle type="source" position={Position.Right} />
</Node>

  </div>


);
});