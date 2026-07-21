const { createLogger, format, transports } = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

// Winston: hem terminale (önceki console.log/console.error davranışıyla aynı) hem de
// Elasticsearch'e log yazan tek bir merkezi logger. Docker/ELK kapalıyken de sunucunun
// çalışmaya devam etmesi için Elasticsearch'e ulaşılamama hatalarını burada sessizce
// yakalıyoruz — loglama asla ana iş akışını (API isteklerini) bloklamamalı.
const esTransport = new ElasticsearchTransport({
  level: 'info',
  indexPrefix: 'fintrack-logs',
  clientOpts: { node: 'http://localhost:9200' }
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