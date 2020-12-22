import AWS from 'aws-sdk'
import commonMidleware from '../lib/commonMiddleware'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient({endpoint: 'http://localhost:8000'});

export async function getAppointmentById(id) {
    let appointment;

    try {
        const result = await dynamodb.get({
            TableName: 'AppointmentTable-test', //process.env.APPOINTMENT_TABLE_NAME,
            Key: { id }
        }).promise();
        console.log("result:", result);
        appointment = result.Item;
    } catch (error) {
        throw new createError.InternalServerError(error);
    }

    if (!appointment) {
        throw new createError.NotFound(`Id ${id} not found`);
    }
    return appointment;
}

async function getAppointment(event, context) {

    const { id } = event.pathParameters;
    let appointment = await getAppointmentById(id);
    return {
        statusCode: 200,
        body: JSON.stringify({ appointment }),
      };
}

export const handler = commonMidleware(getAppointment);