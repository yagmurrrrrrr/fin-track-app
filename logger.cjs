const { createLogger, format, transports } = require('winston');

// Winston: hem terminale (önceki console.log/console.error davranışıyla aynı) hem de
// Elasticsearch/OpenSearch'e log yazan tek bir merkezi logger. Docker/ELK kapalıyken de
// sunucunun çalışmaya devam etmesi için bağlantı hatalarını burada sessizce yakalıyoruz —
// loglama asla ana iş akışını (API isteklerini) bloklamamalı.
//
// Local'de (ES_NODE tanımlı değilse) winston-elasticsearch paketi hiç require edilmez —
// bazı Node sürümleriyle bu paket require sırasında donduğu için, sadece gerçekten
// ihtiyaç olduğunda (yani ES_NODE tanımlıysa, production/Render'da) yükleniyor.
const esNode = process.env.ES_NODE;

const logTransports = [
  new transports.Console({
    format: format.combine(format.colorize(), format.simple())
  })
];

if (esNode) {
  // Sadece burada, gerektiğinde require ediliyor.
  const { ElasticsearchTransport } = require('winston-elasticsearch');

  const esAuth = process.env.ES_USERNAME
    ? { username: process.env.ES_USERNAME, password: process.env.ES_PASSWORD }
    : undefined;

  const esTransport = new ElasticsearchTransport({
    level: 'info',
    indexPrefix: 'fintrack-logs',
    clientOpts: {
      node: esNode,
      auth: esAuth,
      ssl: { rejectUnauthorized: false }
    }
  });

  esTransport.on('error', (error) => {
    console.error('Elasticsearch log transport hatası:', error.message);
  });

  logTransports.push(esTransport);
}

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: 'fintrack-api' },
  transports: logTransports
});

module.exports = logger;
