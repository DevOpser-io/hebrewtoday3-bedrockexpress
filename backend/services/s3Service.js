const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts');
const config = require('../config');

class S3Service {
  constructor(regionName = config.aws.region, crossAccountRoleArn = config.aws.customerCrossAccountRoleArn) {
    this.regionName = regionName;
    this.crossAccountRoleArn = crossAccountRoleArn;
    this.credentialsExpiration = null;
    this.s3Client = null;
    this._initializeClient();
  }

  async _initializeClient() {
    try {
      if (this.crossAccountRoleArn) {
        console.log(`Assuming role for S3 access: ${this.crossAccountRoleArn}`);
        const credentials = await this.assumeRole(this.crossAccountRoleArn);
        this.credentialsExpiration = credentials.expiration;
        
        this.s3Client = new S3Client({
          region: this.regionName,
          credentials: {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            sessionToken: credentials.sessionToken
          }
        });
      } else {
        console.log('Using default AWS credentials for S3');
        this.s3Client = new S3Client({ region: this.regionName });
      }
    } catch (error) {
      console.error('Failed to initialize S3 client:', error);
      throw error;
    }
  }

  async assumeRole(roleArn, sessionName = 'S3LessonAccessSession') {
    try {
      const stsClient = new STSClient({ region: this.regionName });
      
      const command = new AssumeRoleCommand({
        RoleArn: roleArn,
        RoleSessionName: sessionName,
        DurationSeconds: 3600 // 1 hour
      });
      
      const response = await stsClient.send(command);
      
      return {
        accessKeyId: response.Credentials.AccessKeyId,
        secretAccessKey: response.Credentials.SecretAccessKey,
        sessionToken: response.Credentials.SessionToken,
        expiration: response.Credentials.Expiration
      };
    } catch (error) {
      console.error(`Failed to assume role ${roleArn}:`, error);
      throw error;
    }
  }

  async refreshCredentialsIfNeeded(forceRefresh = false) {
    const shouldRefresh = forceRefresh || 
      !this.credentialsExpiration || 
      (this.credentialsExpiration && new Date(this.credentialsExpiration) < new Date(Date.now() + 5 * 60 * 1000));
    
    if (this.crossAccountRoleArn && shouldRefresh) {
      console.log('Refreshing S3 credentials');
      await this._initializeClient();
    }
  }

  async getLessonFlashcard(lessonNumber) {
    try {
      await this.refreshCredentialsIfNeeded();
      
      const key = `Lesson ${lessonNumber}/flashcard.jpg`;
      const command = new GetObjectCommand({
        Bucket: 'hebrewtoday',
        Key: key
      });
      
      const response = await this.s3Client.send(command);
      
      // Convert stream to buffer
      const chunks = [];
      
      // Handle different stream types
      if (response.Body.getReader) {
        // Web stream (browser environment)
        const reader = response.Body.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        // Node.js stream
        for await (const chunk of response.Body) {
          chunks.push(chunk);
        }
      }
      
      const buffer = Buffer.concat(chunks);
      
      return {
        success: true,
        data: buffer,
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified
      };
    } catch (error) {
      console.error(`Failed to get flashcard for lesson ${lessonNumber}:`, error);
      
      if (error.name === 'NoSuchKey') {
        return {
          success: false,
          error: 'FLASHCARD_NOT_FOUND',
          message: `Flashcard not found for lesson ${lessonNumber}`
        };
      } else if (error.name === 'AccessDenied') {
        return {
          success: false,
          error: 'ACCESS_DENIED',
          message: 'Access denied to S3 bucket'
        };
      } else {
        return {
          success: false,
          error: 'UNKNOWN_ERROR',
          message: error.message
        };
      }
    }
  }

  async checkLessonFlashcardExists(lessonNumber) {
    try {
      await this.refreshCredentialsIfNeeded();
      
      const key = `Lesson ${lessonNumber}/flashcard.jpg`;
      const command = new GetObjectCommand({
        Bucket: 'hebrewtoday',
        Key: key
      });
      
      // Try to get just the metadata (head operation would be better but this works)
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = S3Service;