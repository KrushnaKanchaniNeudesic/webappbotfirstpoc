// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const { QnAMaker } = require('botbuilder-ai');
const { Attachmentutility } = require('../utilities/attachment-utility');
const attUtil = new Attachmentutility();

class QnABot extends ActivityHandler {
    constructor() {
        super();

        try {
            this.qnaMaker = new QnAMaker({
                knowledgeBaseId: process.env.QnAKnowledgebaseId,
                endpointKey: process.env.QnAEndpointKey,
                host: process.env.QnAEndpointHostName
            });
        } catch (err) {
            console.warn(`QnAMaker Exception: ${err} Check your QnAMaker configuration in .env`);
        }

        // If a new user is added to the conversation, send them a greeting message
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome');
                    await context.sendActivity('Ask question or send attachment to check user wears helmet');
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        // When a user sends a message, perform a call to the QnA Maker service to retrieve matching Question and Answer pairs.
        this.onMessage(async (context, next) => {
            if (!process.env.QnAKnowledgebaseId || !process.env.QnAEndpointKey || !process.env.QnAEndpointHostName) {
                let unconfiguredQnaMessage = 'NOTE: \r\n' +
                    'QnA Maker is not configured. To enable all capabilities, add `QnAKnowledgebaseId`, `QnAEndpointKey` and `QnAEndpointHostName` to the .env file. \r\n' +
                    'You may visit www.qnamaker.ai to create a QnA Maker knowledge base.'

                await context.sendActivity(unconfiguredQnaMessage)
            }
            else {

                if (context.activity.attachments && context.activity.attachments.length > 0) {
                    await context.sendActivity("Calling Customer Vision API");

                    const responsebuffer = await attUtil.downloadAttachmentAndWrite(context.activity.attachments[0]);
                    const responseFromBufferApi = await attUtil.GetResponseFromCustomerVisionAPI(responsebuffer);

                    if (responseFromBufferApi
                        && responseFromBufferApi.status === 200
                        && responseFromBufferApi.data
                        && responseFromBufferApi.data.predictions
                        && responseFromBufferApi.data.predictions.length > 0) {
                        if (responseFromBufferApi.data.predictions[0].probability > 0.8) {
                            await context.sendActivity("person wearing helmet");
                        } else {
                            await context.sendActivity("person without a helmet");
                        }

                    }

                    // The user sent an attachment and the bot should handle the incoming attachment.
                } else {
                    // Since no attachment was received, send an attachment to the user.
                    await context.sendActivity("Calling QNA maker API");

                    const qnaResults = await this.qnaMaker.getAnswers(context);

                    // If an answer was received from QnA Maker, send the answer back to the user.
                    if (qnaResults[0]) {
                        await context.sendActivity(qnaResults[0].answer);

                        // If no answers were returned from QnA Maker, reply with help.
                    } else {
                        await context.sendActivity('No QnA Maker answers were found.');
                    }

                }

            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.QnABot = QnABot;