package com.ispark.upper_package_service.kafka;

import com.ispark.upper_package_service.model.UpperPackage;
import com.ispark.upper_package_service.service.UpperPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
@Service
public class UpperPackageConsumer {

    @Autowired
    private UpperPackageService upperPackageService;

    @Autowired
    private UpperPackageProducer upperPackageProducer;

    @KafkaListener(topics = "upper-package-request", groupId = "upper-package-group")
    public void consumeUpperPackageRequest(String upperPackageId) {
        UpperPackage upperPackage = upperPackageService.findByUpperPackageId(upperPackageId);
        upperPackageProducer.sendUpperPackageResponse("upper-package-response", upperPackage);
    }
}
