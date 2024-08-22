import { useState, useEffect, useCallback } from 'react';
import { calculateNetProduction, updateResources } from '../utils/resourceManager';
import { calculateGainedResources } from '../utils/calculateResources'; 

const useResources = () => {
    const [resources, setResources] = useState({
        water: 250,
        food: 250,
        wood: 300,
        stone: 100,
        knowledge: 0,
        population: 15,
        coal: 0,
        gold: 0,
        military: 0,
    });

    const [productionRates, setProductionRates] = useState({
        water: 40 / 3600,
        food: 35 / 3600,
        wood: 33 / 3600,
        stone: 29 / 3600,
        knowledge: 1 / 3600,
        population: 1 / 3600,
        coal: 15 / 3600,
        gold: 0.01 / 3600,
    });

    const [capacityRates, setCapacityRates] = useState({
        water: 500,
        food: 500,
        wood: 500,
        stone: 500,
        knowledge: 100,
        population: 15,
        coal: 500,
        gold: 500,
        military: 0,
        maxMilitaryCapacity: 0,
    });

    const [lastUpdatedAt, setLastUpdatedAt] = useState(null); // Zeitpunkt der letzten Aktualisierung

    // Berechnung und Aktualisierung der Ressourcen
    const calculateAndUpdateResources = useCallback(() => {
        const netProduction = calculateNetProduction(productionRates, {}, resources.population);
        const newResources = updateResources(resources, netProduction, capacityRates);
        setResources(newResources);
    }, [productionRates, resources, capacityRates]);

    // Funktion zum Laden der Ressourcen aus der API und hinzufügen der offline Ressourcen
    const loadAndAddOfflineResources = useCallback(async (userName) => {
        try {
            const response = await fetch(`/api/loadGame?user_name=${userName}`); // API-Endpunkt verwenden
            const result = await response.json();
            const { resources: loadedResources, updated_at } = result;

            const currentTime = new Date().toISOString();
            const timeDifferenceInSeconds = (new Date(currentTime) - new Date(updated_at)) / 1000;

            const gainedResources = calculateGainedResources(productionRates, timeDifferenceInSeconds);

            // Addiere offline-Ressourcen zu den geladenen Ressourcen und setze die Werte
            setResources(prevResources => {
                const updatedResources = { ...loadedResources };
                Object.keys(gainedResources).forEach(resource => {
                    updatedResources[resource] = Math.min(
                        (loadedResources[resource] || 0) + gainedResources[resource],
                        capacityRates[resource] || 0
                    );
                });
                return updatedResources;
            });

            // Setze die letzte Aktualisierung
            setLastUpdatedAt(currentTime);
        } catch (error) {
            console.error('Error loading and adding offline resources:', error);
        }
    }, [capacityRates, productionRates]);

    // Initiale Ressourcen laden und offline Ressourcen hinzufügen
    useEffect(() => {
        const userName = "someUser"; // Beispiel: Benutzername laden
        loadAndAddOfflineResources(userName);
    }, [loadAndAddOfflineResources]);

    // Fortlaufende Erhöhung der Ressourcen alle Sekunde
    useEffect(() => {
        const interval = setInterval(calculateAndUpdateResources, 1000);
        return () => clearInterval(interval);
    }, [calculateAndUpdateResources]);

    return {
        resources,
        setResources,
        loadAndAddOfflineResources, // Funktion zum erneuten Laden und Addieren der Ressourcen
        // Weitere Funktionen
    };
};

export default useResources;
