const logger = require('logger');
const ctRegisterMicroservice = require('ct-register-microservice-node');
const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;


const deserializer = obj => new Promise((resolve, reject) => {
    new JSONAPIDeserializer({
        keyForAttribute: 'camelCase'
    }).deserialize(obj, (err, data) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(data);
    });
});


class DatasetService {

    static async checkDataset(ctx) {
        if (ctx.params.dataset || ctx.request.body.dataset) {
            const datasetId = ctx.params.dataset || ctx.request.body.dataset;
            logger.info(`[DatasetService] Validating presence of dataset with id: ${datasetId}`);

            try {
                const dataset = await ctRegisterMicroservice.requestToMicroservice({
                    uri: `/dataset/${datasetId}`,
                    method: 'GET',
                    json: true
                });
                return await deserializer(dataset);
            } catch (err) {
                logger.info(`[DatasetService] There was an error obtaining the dataset: ${err}`);
                throw err;
            }
        } else {
            // If no datasets are present, it has to be catched by the validator
            // Not anymore - need to add it for proper cache tagging
            logger.info(`[DatasetService] No dataset provided in this context.`);
            return null;
        }
    }

    static async getDataset(datasetId) {
        try {
            const dataset = await ctRegisterMicroservice.requestToMicroservice({
                uri: `/dataset/${datasetId}`,
                method: 'GET',
                json: true
            });
            return await deserializer(dataset);
        } catch (err) {
            logger.info(`[DatasetService] There was an error obtaining the dataset: ${err}`);
            throw err;
        }
    }
}


module.exports = DatasetService;
