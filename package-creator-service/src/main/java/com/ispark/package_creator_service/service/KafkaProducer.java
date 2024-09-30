package com.ispark.package_creator_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducer {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;  // Kafka, Object gönderimini destekliyor.

    // Mesajı ilgili topic'e göndermek için method
    public void sendMessage(String topic, Object message) {
        kafkaTemplate.send(topic, message);
    }
}
