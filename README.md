## Integrated-Demo-Application---PoC
The vision of this application is to showcase the capabilities of CGTO processes by simulating the integration between CGTO and ERP systems, as well as patient management applications.

### Pre-requisites

-   This app requires Node installed on the system , proposed version : 18.16.1

#### 1. Steps to start the App:

   a. Clone the repository or download the ZIP file


   b. Run the command to install all the dependencies

```
    npm install
```

   c. Build the App by using the command

```
    npm run build
```

   d. Run the server by command

```
    nodemon server.js
```

  e. Go to the port where the App is hosted locally


#### 2. Sequence to follow :

    a. Select the System from the dropdown - Dev , QA , GxP
    b. Obtain the master data
    c. Create coICoCID or use existing one
    d. Generate Treatment Order
    e. Create Biospecimen Shipment
    f. Confirm Flow Version
    g. Create Purchase Order
    h. Create Process Order
    i. Create Biospecimen Collection
    j. Create FP shipment
    k. Generate Sales Order
    
   
