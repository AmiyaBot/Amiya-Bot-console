const COS = require('cos-nodejs-sdk-v5')
const fs = require('fs')

const SecretId = ''
const SecretKey = ''
const Bucket = ''
const Region = 'ap-guangzhou'

module.exports = function () {
    this.cos = new COS({
        SecretId,
        SecretKey,
    })

    this.createPath = function (objectPath) {
        this.cos.putObject({
            Bucket: Bucket,
            Region: Region,
            Key: objectPath,
            Body: '',
        }, error)
    }

    this.putFile = function (objectPath, filePath) {
        this.cos.putObject({
            Bucket: Bucket,
            Region: Region,
            Key: objectPath,
            Body: fs.createReadStream(filePath),
            ContentLength: fs.statSync(filePath).size,
            StorageClass: 'STANDARD',
            onProgress: progressData => {
                console.log(JSON.stringify(progressData))
            }
        }, error)
    }
}

function error (err, data) {
    console.log(err || data)
}
