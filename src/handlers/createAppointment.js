import {v4 as uuid} from 'uuid'
import AWS from 'aws-sdk'
import commonMidleware from '../lib/commonMiddleware'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient({endpoint: 'http://localhost:8000'});
async function createAppointment(event, context) {
  
  const body = event.body;

  const appointment = {
    id: uuid(),
    status: 'OPENED',
    date: body.date,
    observation: body.observation
  }

  try {
    await dynamodb.put({
      TableName: 'AppointmentTable-test', // process.env.APPOINTMENT_TABLE_NAME,
      Item: appointment
    }).promise()  
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ appointment }),
  };
}

export const handler = commonMidleware(createAppointment);