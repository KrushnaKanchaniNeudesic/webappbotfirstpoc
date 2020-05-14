const axios = require('axios');

class AttachmentUtility {
    constructor() { }


    /**
        * Downloads attachment to the disk.
        * @param {Object} attachment
        */
    async downloadAttachmentAndWrite(attachment) {
        // Retrieve the attachment via the attachment's contentUrl.
        const url = attachment.contentUrl;


        try {
            // arraybuffer is necessary for images
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            // If user uploads JSON file, this prevents it from being written as "{"type":"Buffer","data":[123,13,10,32,32,34,108..."
            if (response.headers['content-type'] === 'application/json') {
                response.data = JSON.parse(response.data, (key, value) => {
                    return value && value.type === 'Buffer' ? Buffer.from(value.data) : value;
                });
            }
           return response.data
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    async GetResponseFromCustomerVisionAPI(stream) {

        try {
            const headers = {
                'Prediction-Key': process.env.CustomVisionPredictionKey,
                'Content-Type': 'application/octet-stream'
              }
            // arraybuffer is necessary for images
            return await axios.post(process.env.CustomVisionAPI,stream , {
                headers: headers
            });
            
            
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
}

module.exports.Attachmentutility = AttachmentUtility;

