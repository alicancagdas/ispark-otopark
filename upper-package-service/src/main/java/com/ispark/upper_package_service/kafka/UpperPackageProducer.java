package com.ispark.upper_package_service.kafka;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class UpperPackageProducer {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void sendUpperPackageResponse(String topic, Object response) {
        kafkaTemplate.send(topic, response);
    }
}
