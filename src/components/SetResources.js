import { useState, useEffect, useCallback } from 'react';
import { calculateNetProduction, calculateGainedResources } from '../utils/resourceManager';
import { fetchNotificationData } from '../utils/Notification';

const useResources = (userName) => {
    const [water, setWater] = useState(250);
    const [food, setFood] = useState(250);
    const [wood, setWood] = useState(300);
    const [stone, setStone] = useState(100);
    const [knowledge, setKnowledge] = useState(0);
    const [population, setPopulation] = useState(15);
    const [coal, setCoal] = useState(0);
    const [gold, setGold] = useState(0);
    const [military, setMilitary] = useState(0);

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

    const [researchEffects, setResearchEffects] = useState({ food: 0 });

    const calculateAndUpdateResources = useCallback(() => {
        const netProduction = calculateNetProduction(productionRates, researchEffects, population);
        setWater(prev => Math.min(prev + netProduction.water, capacityRates.water));
        setFood(prev => Math.min(prev + netProduction.food, capacityRates.food));
        setWood(prev => Math.min(prev + netProduction.wood, capacityRates.wood));
        setStone(prev => Math.min(prev + netProduction.stone, capacityRates.stone));
        setKnowledge(prev => Math.min(prev + netProduction.knowledge, capacityRates.knowledge));
        setCoal(prev => Math.min(prev + netProduction.coal, capacityRates.coal));
        setGold(prev => Math.min(prev + netProduction.gold, capacityRates.gold));
    }, [productionRates, researchEffects, population, capacityRates]);

    // Offline-Ressourcen berechnen und hinzufügen
    const addOfflineResources = useCallback((lastSaveTime, currentTime) => {
        const timeDifferenceInSeconds = (new Date(currentTime) - new Date(lastSaveTime)) / 1000;
        const gainedResources = calculateGainedResources(productionRates, timeDifferenceInSeconds);

        setWater(prev => Math.min(prev + gainedResources.water, capacityRates.water));
        setFood(prev => Math.min(prev + gainedResources.food, capacityRates.food));
        setWood(prev => Math.min(prev + gainedResources.wood, capacityRates.wood));
        setStone(prev => Math.min(prev + gainedResources.stone, capacityRates.stone));
        setKnowledge(prev => Math.min(prev + gainedResources.knowledge, capacityRates.knowledge));
        setCoal(prev => Math.min(prev + gainedResources.coal, capacityRates.coal));
        setGold(prev => Math.min(prev + gainedResources.gold, capacityRates.gold));
    }, [capacityRates, productionRates]);

    useEffect(() => {
        const loadResources = async () => {
            try {
                const savedResources = await fetchNotificationData(userName);

                if (savedResources && savedResources.lastSaveTime) {
                    const lastSaveTime = savedResources.lastSaveTime;
                    const currentTime = new Date().toISOString();

                    setWater(savedResources.water);
                    setFood(savedResources.food);
                    setWood(savedResources.wood);
                    setStone(savedResources.stone);
                    setKnowledge(savedResources.knowledge);
                    setPopulation(savedResources.population);
                    setCoal(savedResources.coal);
                    setGold(savedResources.gold);
                    setMilitary(savedResources.military);

                    // Offline-Ressourcen hinzufügen
                    addOfflineResources(lastSaveTime, currentTime);
                } else {
                    console.error('Saved resources are null or lastSaveTime is missing');
                }
            } catch (error) {
                console.error('Error loading resources:', error);
            }
        };

        loadResources();
    }, [addOfflineResources, userName]);

    useEffect(() => {
        const interval = setInterval(calculateAndUpdateResources, 1000);
        return () => clearInterval(interval);
    }, [calculateAndUpdateResources]);

    return {
        water, food, wood, stone, knowledge, population, coal, gold, military,
        setWater, setFood, setWood, setStone, setKnowledge, setPopulation, setCoal, setGold, setMilitary,
        updateProductionRate: setProductionRates,
        updateCapacityRates: setCapacityRates,
    };
};

export default useResources;
