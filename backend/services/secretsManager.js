// AWS Secrets Manager integration using AWS SDK v2
const AWS = require('aws-sdk');
const config = require('../config');

/**
 * Retrieve a secret from AWS Secrets Manager
 * 
 * @param {string} secretName - Name/ARN of the secret
 * @param {string} region - AWS region name
 * @param {string} secretType - Type of secret - 'plain_text' or 'json'
 * @returns {Promise<string|object>} - The secret value as either a string or object
 */
async function getSecret(secretName, region = config.aws.region, secretType = 'plain_text') {
  console.log(`Attempting to retrieve secret: ${secretName} from region: ${region}`);
  
  try {
    // Create AWS Secrets Manager client with default credentials
    // Cross-account role should only be used for S3 and Bedrock, not Secrets Manager
    let clientOptions = { region };
    
    console.log('Using default credentials chain for Secrets Manager');
    
    const client = new AWS.SecretsManager(clientOptions);

    console.log('AWS Secrets Manager client created, retrieving secret...');
    const response = await client.getSecretValue({ SecretId: secretName }).promise();
    console.log(`Successfully retrieved secret: ${secretName}`);
    
    if (!response.SecretString) {
      throw new Error(`Secret ${secretName} has no value`);
    }
    
    const secret = response.SecretString;
    
    if (secretType.toLowerCase() === 'json') {
      try {
        return JSON.parse(secret);
      } catch (e) {
        console.error(`Failed to parse secret as JSON: ${e}`);
        throw e;
      }
    }
    
    return secret;
  } catch (error) {
    console.error(`Error retrieving secret ${secretName}: ${error.message}`);
    throw error;
  }
}

/**
 * Retrieve additional secrets from ADDITIONAL_SECRETS environment variable
 * Expected format: JSON string containing key-value pairs, or plain string
 * 
 * @returns {object|string} - Parsed additional secrets object or plain string
 * @throws {Error} - If ADDITIONAL_SECRETS environment variable is not set
 */
async function getAdditionalSecrets() {
  const additionalSecretsEnv = process.env.ADDITIONAL_SECRETS;
  
  if (!additionalSecretsEnv) {
    throw new Error('ADDITIONAL_SECRETS environment variable is not set');
  }
  
  // First try to parse as JSON
  try {
    return JSON.parse(additionalSecretsEnv);
  } catch (jsonError) {
    console.log(`ADDITIONAL_SECRETS is not valid JSON, treating as plain string: ${jsonError.message}`);
    // If JSON parsing fails, return as plain string
    return additionalSecretsEnv;
  }
}

module.exports = {
  getSecret,
  getAdditionalSecrets
};
