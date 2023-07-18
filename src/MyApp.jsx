import React, { useCallback, useState } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from "reactflow";
import "reactflow/dist/style.css";
import { ShellBar, Avatar, ShellBarItem, Icon, Input } from "@ui5/webcomponents-react";
import {  useNavigate } from "react-router-dom";
import ExcelToJsonConverter from "./Tools/exceltojsonconverter";
import axios from 'axios';
import { nodes as initialNodes, edges as initialEdges } from "./Nodes/nodes-edges";
import { ERPnodes as initialERPNodes, ERPedges as initialERPEdges } from "./ERP_Nodes/nodes-edges-ERP";
import Auth from "./Authentication/Token";
import { useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CoiCoCIDGeneration from "./Nodes/CoiCoCIDGeneration";
import TreatmentOrder from "./Nodes/TreatmentOrder";
import BiospecimenShipment7 from "./Nodes/BiospecimenShipment7";
import FinishedProduct from "./Nodes/FinishedProduct";
import SubsequentFPShipment from "./Nodes/SubsequentFPShipment";
import BiospecimenCollection from "./Nodes/BiospecimenCollection";
import BioSpecimenShipmentInfo19b from "./Nodes/BioSpecimenShipmentInfo19b.js";
import ConfirmFPShipmentPackage from "./Nodes/ConfirmFPShipmentPackage";
import ConfirmFPShipmentContent from "./Nodes/ConfirmFPShipmentContent";


import event35_ from "./ERP_Nodes/event35_";
import event34_ from "./ERP_Nodes/event34_";
import event106_ from "./ERP_Nodes/event106_";

const nodeTypes1 = {
  
  custom1: CoiCoCIDGeneration,
  custom2: TreatmentOrder,
  custom3: BiospecimenShipment7,
  custom4: FinishedProduct,
  custom5:SubsequentFPShipment,
  custom6: BiospecimenCollection,
  custom7: BioSpecimenShipmentInfo19b,
  custom8:ConfirmFPShipmentPackage,
  custom9:ConfirmFPShipmentContent
};
const nodeTypes2={
  customERP1: event106_,
  customERP2: event35_,
  customERP3: event34_,
};

export function MyApp() {
  // patient management nodes

  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    []
  );

  //ERP nodes
  const [ERPnodes,__, onERPNodesChange] = useNodesState(initialERPNodes);
  const [ERPedges, setERPEdges, onERPEdgesChange] = useEdgesState(initialERPEdges);
  const onERPConnect = useCallback(
    (params) => setERPEdges((elsERP) => addEdge(params, elsERP)),
    []
  );


  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("./");
  };
  


  return (
    <div style={{ height: "100%" }}>


      <ShellBar
        logo={<img src="pictures/LOGO-SAP-1.png" />}
        onLogoClick={handleLogoClick}
        profile={<Avatar> <img src="pictures/profilePictureExample.png " /> </Avatar>}
        primaryTitle="SAP"
        searchField={<Input icon={<Icon interactive name="search" />} showClearIcon />}
        
      >
        <ShellBarItem icon="add" text="add" />
      </ShellBar>

      <ExcelToJsonConverter />

      <Auth />
      <ToastContainer />
    
      <div style={{ height: "20px", width: "20px", padding: "2px", marginTop: "2px" }}/>


      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "450px", background: "#f1f1f1" }}>
        <div style={{ height: "100%", width: "100%", padding: "10px", marginTop: "20px" }}>
        <strong>
            Patient Management
            </strong>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
             onEdgesChange={onEdgesChange}
             onConnect={onConnect}
            nodeTypes={nodeTypes1}
            fitView
          //onElementClick={handleNodeClick} // Add onElementClick prop
          //attributionPosition="bottom-left"
          ></ReactFlow>
           </div>
        </div>
        
         
          <div style={{ height: "10px", width: "10px", padding: "1px", marginTop: "1px" }}/>

         
          <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", height: "400px", background: "#f1f1f1" }} >
          <div style={{ height: "100%", width: "100%", padding: "10px", marginTop: "50px" }}>
            <strong>
            ERP
            </strong>
          <ReactFlow
            nodes={ERPnodes}
            edges={ERPedges}
            onERPNodesChange={onERPNodesChange}
            onERPEdgesChange={onERPEdgesChange}
            onERPConnect={onERPConnect}
            nodeTypes={nodeTypes2}
            fitView
          ></ReactFlow>
          </div>
      </div>
      
    </div>
  );
};
