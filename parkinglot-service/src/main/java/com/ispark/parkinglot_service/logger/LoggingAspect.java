package com.ispark.parkinglot_service.logger;

import com.ispark.parkinglot_service.model.OperationLog;
import com.ispark.parkinglot_service.repository.OperationLogRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger(LoggingAspect.class);

    @Autowired
    private OperationLogRepository logRepository;

    @Pointcut("within(com.ispark.vehicle_type_service..*)")
    public void applicationPackagePointcut() {
        // The pointcut definition
    }

    @Before("applicationPackagePointcut()")
    public void logBefore(JoinPoint joinPoint) {
        String details = "Before method: " + joinPoint.getSignature().getName();
        LOGGER.info(details);
        logRepository.save(new OperationLog("Before", details));
    }

    @AfterReturning(pointcut = "applicationPackagePointcut()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        String details = "After method: " + joinPoint.getSignature().getName() + ", returned: " + result;
        LOGGER.info(details);
        logRepository.save(new OperationLog("AfterReturning", details));
    }

    @AfterThrowing(pointcut = "applicationPackagePointcut()", throwing = "e")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable e) {
        String details = "Exception in " + joinPoint.getSignature().getName() + " with cause " + e.getCause();
        LOGGER.error(details);
        logRepository.save(new OperationLog("AfterThrowing", details));
    }
}
