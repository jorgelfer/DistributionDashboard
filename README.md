# Distribution System Visualization Dashboard
This dashboard provides interactive tools for operations planning visualization of distribution systems.

---

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [React Component Tree ](#react-component-tree)
4. [Setup and Installation](#setup-and-installation)
5. [Execution Instructions](#execution-instructions)
6. [Usage Guide](#usage-guide)
7. [Detailed Explanations](#detailed-explanations)
8. [Additional Notes](#additional-notes)
9. [Technologies Used](#technologies-used)
10. [Acknowledgments](#acknowledgments)

---

## Overview

Distribution system visualization is challenging due to the need to analyze complex spatio-temporal relationships from multiple interconnected devices that arise from operations planning studies (e.g., Operating Envelopes). This project creates an interactive web visualization tool supported by backend processing modules for supporting distribution system analysis.

---

## Key Features

1. **Interactive Visualization**:
   - Case selection mechanism where users specify the test case (e.g., distribution feeder) to analyze via an input form.
   - The data collected through this form is parsed to construct a GET request for the Quasi-Static Time Series (QSTS) module, i.e., a module for chronological time series AC distribution power flow.
   - As a response, the QSTS module returns a JavaScript Object Notation (JSON) object.
   - This JSON object is then interpreted and visualized via the interactive user interface.
   - Interactions include filtering by device, select a bus an visualize its operational values, brush several buses and display their operational values for visual comparison, the ability to add/modify/remove distributed energy resources from the network. 

---

## React Component Tree

```
App/Fetching/
├── Charts/
├───────── Header/              # Header with filters by network device
├───────── NetworkGraph/        # Network visualization
├───────── LineChartVM/         # Line chart for voltage magnitude
├───────── LineChartPQS/        # Line chart for power cuantities
├───────── QSTS Button          # Toggle button for visualizing QSTS results
├───────── Scheduling Button    # Toggle button for visualizing Scheduling results
```

---

## Setup and Installation

### Prerequisites
Ensure the following are installed: 
- Node.js ([Install Here](https://nodejs.org/en/download/package-manager))
- Git
- Dependencies (detailed below)

### Visualization dependencies

1. Clone the repository:
   ```bash
   git clone https://github.com/jorgelfer/test_dashboard/
   cd test_dashboard
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

---

## Execution Instructions

1. **Run the React application**:
     ```bash
     npm run start
     ```

3. **Access the Application**:
   - Open your browser to the provided localhost URL.

---

## Usage Guide

1. **Case Selection**:
    - In the input form the operator selects from a drop down menu the network model to analyze (Network Model) and its associated main file (InFile1). 

2. **Custom QSTS Processing**
    - The data extracted from the input form is used to generate a back-end HTTP GET request to the QSTS module.
    - This screen employs React.js state management to handle the asynchronous process of data retrieval. 
    - While waiting for the response, the interface displays an intermediate wait screen to inform the operator that the system is processing the request.

3. **Visualization of QSTS results**

    - The second screen includes an interactive visualization component which displays results immediately after the response is retrieved. This  allows the operator to analyze the system's QSTS results. 
    - This screen includes a header, three different charts, and a toggle button to select between QSTS and Scheduling. 
    - The header is employed for the user to select which operational value to display, it can be branch power flows or values associated with the substation, loads, batteries, demand response, flexible generators, flexible loads, and power mismatches. 
    - The first chart from the content is a network graph. 
    - The second chart displays voltage magnitudes as line charts. 
    - The third chart displays operation values as line charts. 

4. **Visualization of Scheduling results**
    - On click on the scheduling toggle button, a back-end HTTP POST request to the Scheduling module is initiated. 
    - This screen employs React.js state management to handle the asynchronous process of data retrieval. 
    - While waiting for the response, the interface displays an intermediate wait screen to inform the operator that the system is processing the request.
    - Once the Scheduling data is received, React state management is employed to visualize both QSTS and Scheduling data (by clicking on the QSTS/Scheduling toggle button) without generating new HTTP request. 
    - To trigger new HTTP requests, the underlying network dataset must be updated by adding, editing, or deleting a network device.

5. **User interactions**
    - Functionality to select a bus and display its voltage and other operational values in the line charts.
    - Functionality to select multiple buses, in a brushing motion, and display their associated voltages and operational values in the line charts.
    - Functionality to add, edit, and remove devices by clicking on a bus in the network.

---

## Detailed Explanations

### Interactive Visualization

The web-based user interface features a case selection mechanism where users specify the test case (e.g., distribution feeder) to analyze via an input form. The data collected through this form is parsed to construct a GET request for the Quasi-Static Time Series (QSTS) module, i.e., a module for chronological time series AC distribution power flow. It is exposed as a RESTful API endpoint designed to handle GET requests from the client. Upon receiving the request, the endpoint processes it and extracts the necessary information to define and execute the specified test case. Internally, the QSTS module maintains a library of test cases that can be run to produce QSTS simulations. Once the simulation is complete, the API endpoint returns the results as a JavaScript Object Notation (JSON) object. This JSON object is then interpreted and visualized via the interactive user interface.

From the interactive visualization component of the user interface, an operator can specify active buses by assigning a flexible generator or flexible load to a specific connection site. Then, it can send a POST request to the scheduling module, with the QSTS simulation data as payload. The scheduling module is designed to execute a linearized version of a three-phase unbalanced multi-period optimal power flow for a day-ahead scheduling horizon. This module generates a solution that enforces grid-level constraints while computing the maximum allowable power injection (operating envelopes) at the specified active buses for the given scenario. The computed solution is then returned to the user interface module, where the interactive visualization component enables operators to analyze and interpret the results effectively.

---

## Technologies Used

- **React**: Front-end framework.
- **D3.js**: Utility data visualization library.
- **Node.js**: Dependency management and front-end setup.

---

## Acknowledgments

- **Team Members**:
  - Jorge Fernandez (jfernandez87)
  - Santiago Grijalva (sgrijalva6)

- **Resources**:
  - React and D3.js for UI development