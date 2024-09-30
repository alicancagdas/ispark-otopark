package com.ispark.tariff_service.service;

import com.ispark.tariff_service.model.Tariff;
import com.ispark.tariff_service.repository.TariffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TariffService {

    @Autowired
    private TariffRepository tariffRepository;

    @Autowired
    private LoggingService loggingService;

    public List<Tariff> getAllTariffs() {
        loggingService.logOperation("GET_ALL", "Fetching all tariffs.");
        return tariffRepository.findAll();
    }

    public Tariff getTariffByTarifeNo(String tarifeNo) {
        Tariff tariff = tariffRepository.findByTarifeNo(tarifeNo)
                .orElseThrow(() -> new NoSuchElementException("Tariff not found with tarifeNo: " + tarifeNo));
        loggingService.logOperation("GET", "Fetched tariff with tarifeNo: " + tarifeNo);
        return tariff;
    }

    public Tariff createTariff(Tariff tariff) {
        Tariff createdTariff = tariffRepository.save(tariff);
        loggingService.logOperation("CREATE", "Created new tariff with tarifeNo: " + createdTariff.getTarifeNo() + ", name: " + createdTariff.getName());
        return createdTariff;
    }

    public Tariff updateTariffByTarifeNo(String tarifeNo, Tariff updatedTariff) {
        Tariff existingTariff = getTariffByTarifeNo(tarifeNo);
        existingTariff.setName(updatedTariff.getName());
        // Diğer güncellemeler buraya eklenebilir

        Tariff updated = tariffRepository.save(existingTariff);
        loggingService.logOperation("UPDATE", "Updated tariff with tarifeNo: " + tarifeNo + ", updated name: " + updated.getName());
        return updated;
    }

    public void deleteTariffByTarifeNo(String tarifeNo) {
        Tariff existingTariff = getTariffByTarifeNo(tarifeNo);
        tariffRepository.delete(existingTariff);
        loggingService.logOperation("DELETE", "Deleted tariff with tarifeNo: " + tarifeNo + ", name: " + existingTariff.getName());
    }

    public void deleteAllTariffs() {
        tariffRepository.deleteAll();
        loggingService.logOperation("DELETE_ALL", "Deleted all tariffs.");
    }

    public List<Tariff> getTariffByName(String name) {
        loggingService.logOperation("GET_BY_NAME", "Fetching tariffs by name: " + name);
        return tariffRepository.findByName(name);
    }

    public Tariff duplicateAndChangeName(Tariff originalTariff) {
        Tariff duplicateTariff = new Tariff();
        duplicateTariff.setName(originalTariff.getName() + " - Duplicate");
        // Diğer kopyalama işlemleri buraya eklenir

        Tariff savedDuplicate = tariffRepository.save(duplicateTariff);
        loggingService.logOperation("DUPLICATE", "Duplicated tariff with tarifeNo: " + originalTariff.getTarifeNo() + ", original name: " + originalTariff.getName());
        return savedDuplicate;
    }

    /**
     * Kafka'dan gelen tarifeyi yeni bir tarife olarak oluşturur ve veritabanına kaydeder.
     *
     * @param kafkaTariff Kafka'dan gelen tarife
     * @return Oluşturulan yeni tarife
     */
    public Tariff createTariffFromKafka(Tariff kafkaTariff) {
        // Kafka'dan gelen tarifeye yeni bir tarife numarası atıyoruz
        kafkaTariff.setTarifeNo(TariffFactory.generateTarifeNo());

        // Tarihleri güncelliyoruz
        kafkaTariff.setCreateDate(LocalDateTime.now());
        kafkaTariff.setUpdateDate(LocalDateTime.now());
        kafkaTariff.setLastUpdatedBy("Kafka Event");
        Tariff createdTariff = tariffRepository.save(kafkaTariff);
        loggingService.logOperation("CREATE", "Created new tariff with tarifeNo request came from kafka: " + createdTariff.getTarifeNo() + ", name: " + createdTariff.getName());
        // Mevcut createTariff metodunu kullanarak yeni tarifeyi kaydediyoruz
        return createdTariff;
    }




}
