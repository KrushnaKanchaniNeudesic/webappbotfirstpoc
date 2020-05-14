# Description
Boat integrated with sample Kb data which canbe found [sampledata](./sampleKBdata) folder also intgreted with custom vision (person with an image)
 
 ## Custome API VISION
  If we add attachment of person with helmet we wil recive person with helmet text. 
  images will be found at [images](./images)

# Prerequisites
- [Node.js](https://nodejs.org) version 10.14 or higher
    ```bash
    # determine node version
    node --version
    ```
# To run the bot locally
- Download the bot code from the Build blade in the Azure Portal (make sure you click "Yes" when asked "Include app settings in the downloaded zip file?").
    - If you clicked "No" you will need to copy all the Application Settings properties from your App Service to your local .env file.
- Install modules
    ```bash
    npm install
    ```
- Run the bot
    ```bash
    npm start
    ```


