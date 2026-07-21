
const { createLogger, format, transports } = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

// Winston: hem terminale (önceki console.log/console.error davranışıyla aynı) hem de
// Elasticsearch/OpenSearch'e log yazan tek bir merkezi logger. Docker/ELK kapalıyken de
// sunucunun çalışmaya devam etmesi için bağlantı hatalarını burada sessizce yakalıyoruz —
// loglama asla ana iş akışını (API isteklerini) bloklamamalı.
//
// Local'de (ES_NODE tanımlı değilse) eskisi gibi local Docker'daki Elasticsearch'e bağlanır.
// Render'da (yayında) ES_NODE/ES_USERNAME/ES_PASSWORD environment variable'ları Aiven'deki
// OpenSearch servisine işaret eder.
const esNode = process.env.ES_NODE || 'http://localhost:9200';
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
  console.error('Elasticsearch log transport hatası (Docker/ELK ayakta mı kontrol et):', error.message);
});

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  defaultMeta: { service: 'fintrack-api' },
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    }),
    esTransport
  ]
});

module.exports = logger;