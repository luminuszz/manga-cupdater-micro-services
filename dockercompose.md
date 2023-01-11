version: '3'
services:
zookeeper:
image: confluentinc/cp-zookeeper:7.3.0
restart: "always"
container_name: zookeeper
environment:
ZOOKEEPER_CLIENT_PORT: 2181
ZOOKEEPER_TICK_TIME: 2000

broker:
image: confluentinc/cp-kafka:7.3.0
restart: "always"
container_name: broker
ports:
# To learn about configuring Kafka for access across networks see
# https://www.confluent.io/blog/kafka-client-cannot-connect-to-broker-on-aws-on-docker-etc/
- "9092:9092"
depends_on:
- zookeeper
environment:
KAFKA_BROKER_ID: 1
KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181'
KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT
KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092,PLAINTEXT_INTERNAL://broker:29092
KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1

notion_service:
environment:
- KAFKA_BROKER_HOST=localhost
- KAFKA_BROKER_PORT=29092
container_name: chapter_updater_notion_service
build:
context: notion-service
dockerfile: ./dockerfile
restart: always
depends_on:
- broker


redis_service:
image: redis
container_name: chapter_updater_redis_service
ports:
- "6379:6379"
volumes:
- redis_data:/data/redis


scraping_service:
build:
context: scraping-service
dockerfile: ./dockerfile
container_name: chapter_updater_scraping_service
environment:
- REDIST_HOST=chapter_updater_redis_service
- REDIS_PORT=6379
- KAFKA_BROKER_HOST=localhost
- KAFKA_BROKER_PORT=29092
depends_on:
- broker
- redis_service




notification_service:
container_name: chapter_updater_notificaion_service
depends_on:
- broker
build:
context: notification-service
dockerfile: ./dockerfile

task_service:
container_name: chapter_updater_task_service
depends_on:
- broker
build:
context: task-service
dockerfile: ./dockerfile

volumes:
redis_data:


